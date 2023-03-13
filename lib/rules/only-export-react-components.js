/**
 * @fileoverview Only export react components or typescript functions/variables
 * @author Leonard Grosoli
 */
"use strict"

const JSX_ELEMENT = 'JSXElement'
const JSX_ELEMENT_FRAGMENT = 'JSXFragment'
//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------
/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Only export react components or typescript functions/variables",
      recommended: true,
    },
    schema: [],
    messages: {
      theMessage: 'You are exporting react components and typescript functions/variables, in development this can lead hmr to reload the entire app instead of the component.',
      default: 'You are exporting default export and react components or typescript functions/variables, im to lazy to make a rule to find out what type the default export is which means you get an error if you use default export and not default exports.',
    }
  },

  create (context) {
    let hasReactExports = false
    let hasNormalExports = false
    let hasDefault = false

    let nodes = []

    const report = (node) => context.report({
      node,
      messageId: "theMessage"
    })
    const reportDefault = (node) => context.report({
      node,
      messageId: "default"
    })

    return {
      ExportDefaultDeclaration: (node) => {
        hasDefault = true
        if (hasReactExports || hasNormalExports) {
          reportDefault(node)
          for (const n of nodes) {
            reportDefault(n)
          }
          return
        }
        nodes.push(node)
      },
      ExportNamedDeclaration: (node) => {
        const declaration = node.declaration
        if (!declaration || declaration.type.startsWith("TS")) return

        if (hasDefault && (hasReactExports || hasNormalExports)) {
          reportDefault(node)
          return
        }

        if (hasReactExports && hasNormalExports) {
          report(node)
          return
        }

        const areExportsReact = []

        if (declaration.type === 'FunctionDeclaration') {
          let isReact = false
          if (isBlockTypeReturnTypeJsxElement(declaration.body)) {
            isReact = true
          }
          areExportsReact.push(isReact)
        } else if (declaration.type === 'VariableDeclaration') {

          for (const dec of node.declaration.declarations) {

            if (dec.type === 'VariableDeclarator') {
              let isReact = false
              if (dec.init.type === 'ArrowFunctionExpression') {

                if (isReactElement(dec.init.body.type)) {
                  isReact = true
                }
                if (dec.init.body.type === 'BlockStatement' && isBlockTypeReturnTypeJsxElement(dec.init.body)) {

                  isReact = true

                }
              }

              if (isReactElement(dec.init.type)) {
                isReact = true
              }

              if (dec.init.type === "CallExpression" && dec.init.callee.name === 'memo') {
                isReact = true
              }

              areExportsReact.push(isReact)

            }

          }
        } else if (declaration.type === 'ClassDeclaration') {
          const render = declaration.body.body.find(node => node.type === 'MethodDefinition' && node.key.name === 'render')
          let isReact = false
          if (render && isBlockTypeReturnTypeJsxElement(render.value.body)) {
            isReact = true
          }
          areExportsReact.push(isReact)
        }

        for (const isReact of areExportsReact) {

          if (isReact) {
            hasReactExports = true
          } else {
            hasNormalExports = true
          }

        }

        if (hasReactExports && hasNormalExports) {
          for (const n of nodes) {
            report(n)
          }
          report(node)
        } else if (hasDefault && (hasReactExports || hasNormalExports)) {
          for (const n of nodes) {
            reportDefault(n)
          }
          reportDefault(node)
        } else {
          nodes.push(node)
        }
      }
    }
  },
}

function isReactElement (type) {
  return type === JSX_ELEMENT || type === JSX_ELEMENT_FRAGMENT
}

function isBlockTypeReturnTypeJsxElement (block) {
  if (!block || !block.body) return false

  for (const node of block.body) {
    const arg = node.argument
    if (node.type === 'ReturnStatement' && arg && isReactElement(arg.type)) {
      return true
    }
    if (node.type === 'IfStatement') {
      if (checkIfReturn(node.consequent)) return true
      if (checkIfReturn(node.alternate)) return true
    }
    if (node.type === 'ForOfStatement' || node.type === 'ForInStatement' || node.type === 'ForStatement') {
      if (isBlockTypeReturnTypeJsxElement(node.body)) return true
    }
  }

  return false
}

function checkIfReturn (node) {
  if (node) {
    if (node.type === 'ExpressionStatement') {
      return false
    } else if (node.type === 'ReturnStatement') {
      if (!node.argument) return false
      if (isReactElement(node.argument.type)) return true
    } else if (isBlockTypeReturnTypeJsxElement(node)) {
      return true
    }
  }
}