module.exports = {
  root: true,
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
//    extends:'eslint-config-airbnb',
  extends: 'standard',
  //extends: 'eslint:recommended',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
    'parserOptions': {
        "ecmaVersion": 6,
        "sourceType": 'module'
    },
  // add your custom rules here
  rules: {
      "eqeqeq": 1,
      "curly": 2,
      "indent": 0,
      "key-spacing": 0,
      "semi": 0,
      "quotes": [1, "single"],
      "no-use-before-define": [1, "nofunc"],
      "dot-notation": [2, {"allowPattern": "^\\w+$"}],
      "camelcase": [2, {"properties": "never"}],
      "no-unused-expressions": [2, { "allowShortCircuit": true, "allowTernary": true }],
      "no-console": [2, { allow: ["dir","warn", "error"] }],
      "no-unused-vars": 1
  },
    globals: {
        "Vue": true
    },
    env: {
        "node":true,
        "browser": true
    }

}
