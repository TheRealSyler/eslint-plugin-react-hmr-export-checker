/**
 * @fileoverview Only export react components or typescript functions/variables
 * @author Leonard Grosoli
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/only-export-react-components"),
  RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

const parserOptions = {
  ecmaVersion: 'latest',
  ecmaFeatures: {
    jsx: true,
  },
  sourceType: 'module'
};

ruleTester.run("only-export-react-components", rule, {
  valid: [
    {
      parserOptions: parserOptions,
      code: "export const B = () => {return <div></div>}; export const A = () => <div></div>; export const C = <div></div>; export var v = <div></div>"
    },
    {
      parserOptions: parserOptions,
      code: ` export const a = () => <></>;  export const b = () => <input/>; export const c = memo(() => {})`
    },
    {
      parserOptions: parserOptions,
      code: `export { };`
    },
    {
      parserOptions: parserOptions,
      code: `export function a() {
            // let b 
            if (2) b = true
          // return b

          }`},
    {
      parserOptions: parserOptions,
      code: `export const a = () => {

      if (324) return true

      return false

    }`},
    {
      parserOptions: parserOptions,
      code: `export const B = () => {
        if (true) {
          if (false) {
            return null
          }
          return "awd"
        }
        return <input/>
        }`
    },
    {
      parserOptions: parserOptions,
      code: "const A = () => <input/>; export function awd() {return <A/>}"
    },

    {
      parserOptions: parserOptions,
      code: "export const a = 23; export class A {render() {}}"
    },
    {
      parserOptions: parserOptions,
      code: `export class A {render() {return <input/>}}`
    },
    {
      parserOptions: parserOptions,
      code: `
        export const a = () => {
          if (true) {
          } else {
            if  (1) {

            } else {
              if (2) {
                return <input/>

              }
            }

          }
          return null
        }

        export const b = () => <input/>
            `,

    },
  ],

  invalid: [
    {
      parserOptions: parserOptions,
      code: `const a = "string";
        export default a;
        export const B = () => <input/>
            `,
      errors: [{ messageId: 'default' }, { messageId: 'default' }]
    },
    {
      parserOptions: parserOptions,
      code: "export const B = () => {}; const A = () => <input/>; export function awd() {return <A/>}",
      errors: [{ messageId: 'theMessage' }, { messageId: 'theMessage' }]
    },
    {
      parserOptions: parserOptions,
      code: "export const B = () => {}; export const a = () => {return <input/>}",
      errors: [{ messageId: 'theMessage' }, { messageId: 'theMessage' }]
    },
    {
      parserOptions: parserOptions,
      code: "export class A {render() {return <input/>}}; export const a = () => {}",
      errors: [{ messageId: 'theMessage' }, { messageId: 'theMessage' }]
    },
    {
      parserOptions: parserOptions,
      code: "export const B = {}; export const a = <input/>",
      errors: [{ messageId: 'theMessage' }, { messageId: 'theMessage' }]
    },
    {
      parserOptions: parserOptions,
      code: `
        export const a = () => {
          if (true) {
          } else {
            if  (1) {

            } else {
              if (2) {
                return <input/>

              }
            }

          }
          return null
        }

        export const b = () => {}
            `,
      errors: [{ messageId: 'theMessage' }, { messageId: 'theMessage' }]
    },
  ],
});
