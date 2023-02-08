/**
 * @fileoverview Only export react components or typescript functions/variables
 * @author Leonard Grosoli
 */
"use strict"

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/only-export-react-components")
// eslint-disable-next-line node/no-unpublished-require
const RuleTester = require("@typescript-eslint/utils/dist/eslint-utils/rule-tester/RuleTester").RuleTester


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
})

const parserOptions = {
  ecmaVersion: 'latest',
  ecmaFeatures: {
    jsx: true,
  },
  sourceType: 'module'
}

ruleTester.run("only-export-react-components", rule, {
  valid: [
    {
      parserOptions,
      code: "export const B = () => {return <div></div>}; export const A = () => <div></div>; export const C = <div></div>; export var v = <div></div>"
    },
    {
      parserOptions,
      code: `
export async function f() {
  if (false) {
    if (true) {
      return
    }
  }
}`
    },
    {
      parserOptions,
      code: ` export const a = () => <></>;  export const b = () => <input/>; export const c = memo(() => {})`
    },
    {
      code: `type DataQuery = any
        export async function awd(id: string) {
          return []
        }

        export async function a(id: string): Promise<DataQuery | void> {
          const f =  awd(id)

          if (!f) return

          for (const t of f) {
            if  (t === 'banana') continue
            const field = t.fields.find((v) => v === null)
            if (field) {
              return { ...t, fields: [field] };
            }
          }
        }`
    },
    {
      code: `type DataQuery = any
        export async function awd(id: string) {
          return []
        }

        export async function a(id: string): Promise<DataQuery | void> {
          const f =  awd(id)

          if (!f) return

          for (const t of f) {
            const field = t.fields.find((v) => v === null)
            if (field) {
              return { ...t, fields: [field] };
            }
          }
        }`
    },
    {
      parserOptions,
      code: `type DataQuery = any
        export async function awd(id: string) {
          return <div></div>
        }

        export async function a(id: string): Promise<DataQuery | void> {
          const f =  awd(id)

          if (!f) return

          for (const t of f) {
            const field = t.fields.find((v) => v === null)
            if (field) {
              return <div></div>;
            }
          }

        }`
    },
    {
      parserOptions,
      code: `type DataQuery = any
        export async function awd(id: string) {
          return <div></div>
        }

        export async function a(id: string): Promise<DataQuery | void> {
          const f =  awd(id)

          if (!f) return
          for (const key in f) {
            if (Object.hasOwnProperty.call(f, key)) {
              const field = f[key];
              if (field) {
                return <div></div>;
              }
            }
          }

        }`
    },
    {
      parserOptions,
      code: `type DataQuery = any
    export async function awd(id: string) {
      return <div></div>
    }

    export async function a(id: string): Promise<DataQuery | void> {
      const f =  awd(id)

      if (!f) return

      for (let i = 0; i < Object.values(f).length; i++) {
        const field = Object.values(f)[i];
        if (field) {
          return <div></div>;
        }
      }

    }`
    },
    {
      parserOptions,
      code: `export { };`
    },
    {
      parserOptions,
      code: `export function a() {
                // let b 
                if (2) b = true
              // return b

              }`},
    {
      parserOptions,
      code: `export const a = () => {

          if (324) return true

          return false

        }`},
    {
      parserOptions,
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
      parserOptions,
      code: "const A = () => <input/>; export function awd() {return <A/>}"
    },

    {
      parserOptions,
      code: "export const a = 23; export class A {render() {}}"
    },
    {
      parserOptions,
      code: `export class A {render() {return <input/>}}`
    },
    {
      parserOptions,
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
      parserOptions,
      code: `const a = "string";
        export default a;
        export const B = () => <input/>
            `,
      errors: [{ messageId: 'default' }, { messageId: 'default' }]
    },
    {
      parserOptions,
      code: "export const B = () => {}; const A = () => <input/>; export function awd() {return <A/>}",
      errors: [{ messageId: 'theMessage' }, { messageId: 'theMessage' }]
    },
    {
      parserOptions,
      code: "export const B = () => {}; export const a = () => {return <input/>}",
      errors: [{ messageId: 'theMessage' }, { messageId: 'theMessage' }]
    },
    {
      parserOptions,
      code: "export class A {render() {return <input/>}}; export const a = () => {}",
      errors: [{ messageId: 'theMessage' }, { messageId: 'theMessage' }]
    },
    {
      parserOptions,
      code: "export const B = {}; export const a = <input/>",
      errors: [{ messageId: 'theMessage' }, { messageId: 'theMessage' }]
    },
    {
      parserOptions,
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
})
