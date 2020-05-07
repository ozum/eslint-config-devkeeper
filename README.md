# eslint-config-devkeeper

ESLint shareable config for devkeeper.

# Installation

`$ npm install -D eslint-config-devkeeper`

or with peer dependencies

`$ npm install -D eslint prettier typescript eslint-config-devkeeper`

Installation overwrites your `.editorconfig` and `.eslintignore`. Additionally it creates `.eslintrc.json` if it does not exist.

# Usage

`.eslintrc.js`

```js
module.exports = {
  root: true,
  extends: ["devkeeper"]
}
```
