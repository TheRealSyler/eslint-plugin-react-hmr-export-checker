# Only export react components or typescript functions/variables (only-export-react-components)

Only export react components or typescript functions/variables

## Rule Details

react refresh hmr does not work if you export react component and a variable or function, this rule is to prevent that you go insane because hmr doesn't work

Examples of **incorrect** code for this rule:

```js

export const A = () => <div></div>;
export const B = () => "string";

```

Examples of **correct** code for this rule:

```js

export const A = () => <div></div>;
// different file
export const B = () => "string";

```


## When Not To Use It

if you don't use react refresh or if they fixed the export issue.

