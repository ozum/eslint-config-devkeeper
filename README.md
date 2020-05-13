# eslint-config-devkeeper

ESLint shareable config for devkeeper.

# Installation

`$ npm install -D eslint-config-devkeeper`


`$ npm install -D eslint prettier typescript eslint-config-devkeeper`

**Create configuration files and `package.json` scripts:**

_Overwrites your `.editorconfig` and `.eslintignore`. Additionally it creates `.eslintrc.json` if it does not exist._

`$ node_modules/.bin/eslint-config-devkeeper`


# Usage

`.eslintrc.js`

```js
module.exports = {
  root: true,
  extends: ["devkeeper"]
}
```
