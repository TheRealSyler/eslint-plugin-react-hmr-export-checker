/**
 * @fileoverview Only export react components or typescript functions/variables
 * @author Leonard Grosoli
 */
"use strict";

const JSX_ELEMENT = 'JSXElement';
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
        if (hasDefault && (hasReactExports || hasNormalExports)) {
          reportDefault(node)
          return
        }
        if (hasReactExports && hasNormalExports) {
          report(node)
          return
        }
        const exportTypes = []
        const declaration = node.declaration

        if (declaration.type === 'FunctionDeclaration') {
          let type = declaration.type
          if (isBlockTypeReturnTypeJsxElement(declaration.body)) {
            type = JSX_ELEMENT
          }
          exportTypes.push(type)
        } else if (declaration.type === 'VariableDeclaration') {

          for (const dec of node.declaration.declarations) {

            if (dec.type === 'VariableDeclarator') {

              let type = dec.init.type
              if (type === 'ArrowFunctionExpression') {

                if (dec.init.body.type === JSX_ELEMENT) {
                  type = JSX_ELEMENT
                }
                if (dec.init.body.type === 'BlockStatement') {
                  if (isBlockTypeReturnTypeJsxElement(dec.init.body)) {
                    type = JSX_ELEMENT
                  }
                }
              }

              exportTypes.push(type)

            }

          }
        } else if (declaration.type === 'ClassDeclaration') {
          const render = declaration.body.body.find(node => node.type === 'MethodDefinition' && node.key.name === 'render')
          let type = declaration.type
          if (isBlockTypeReturnTypeJsxElement(render.value.body)) {
            type = JSX_ELEMENT
          }
          exportTypes.push(type)
        }

        for (const type of exportTypes) {

          if (type === JSX_ELEMENT) {
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
      // visitor functions for different types of nodes
    };
  },
};


function isBlockTypeReturnTypeJsxElement (block) {
  if (!block) return false

  for (const node of block.body) {
    if (node.type === 'ReturnStatement' && node.argument.type === JSX_ELEMENT) {
      return true
    }
    if (node.type === 'IfStatement') {
      if (isBlockTypeReturnTypeJsxElement(node.consequent)) {
        return true
      } else if (isBlockTypeReturnTypeJsxElement(node.alternate)) {
        return true
      }
    }
  }


  return false
}