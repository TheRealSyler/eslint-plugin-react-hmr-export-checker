# eslint-plugin-react-hmr-export-checker

Only export react components or typescript functions/variables.

> WARNING i made this rule because my hmr was broken, i probably have not thought about all possible scenarios so it might not work correctly.

> WARNING default export with other exports are not allowed/supported because im to lazy to implement it.

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-react-hmr-export-checker`:

```sh
npm install eslint-plugin-react-hmr-export-checker --save-dev
```

## Usage

Add `react-hmr-export-checker` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "react-hmr-export-checker"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "react-hmr-export-checker/rule-name": 2
    }
}
```

## Supported Rules

* Fill in provided rules here

* only-export-react-components

<span id="LICENSE_GENERATION_MARKER_0"></span>
Copyright (c) 2022 Leonard Grosoli Licensed under the MIT license.
<span id="LICENSE_GENERATION_MARKER_1"></span>