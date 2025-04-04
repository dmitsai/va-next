/** @type {import("eslint").Linter.Config} */
const config = {
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": true
  },
  "plugins": [
    "@typescript-eslint"
  ],
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
    "plugin:storybook/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "airbnb",
    "prettier"
  ],
  "rules": {
    "no-shadow": "off",
    "no-unused-vars": ["warn", { varsIgnorePattern: '^_', argsIgnorePattern: '^_' }],
    "react/jsx-curly-brace-presence" : 'off',
    "react/no-unescaped-entities": "off",
    "react/jsx-props-no-spreading": "off",
    "jsx-a11y/label-has-associated-control" : "off",
    "@typescript-eslint/no-empty-object-type": "off",
    "@typescript-eslint/consistent-type-imports": "off",
    "react/prop-types": "off",
    // TODO: fix this later
    "import/no-extraneous-dependencies": [
      "error",
      {
        "devDependencies": [
          "**/*.stories.*",
          "**/.storybook/**/*.*"
        ],
        "peerDependencies": true
      }
    ],
    "react/function-component-definition": [
      2,
      {
        namedComponents: "arrow-function",
        unnamedComponents: "arrow-function",
      },
    ],
    "import/prefer-default-export": "off",
    "react/require-default-props": "off",
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        "js": "never",
        "jsx": "never",
        "ts": "never",
        "tsx": "never"
      }
    ],
    "react/react-in-jsx-scope": "off",
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx",".tsx",".ts"] }],
    "@typescript-eslint/array-type": "off",
    "@typescript-eslint/consistent-type-definitions": "off",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        "argsIgnorePattern": "^_"
      }
    ],
    "@typescript-eslint/require-await": "off",
    "@typescript-eslint/no-misused-promises": [
      "error",
      {
        "checksVoidReturn": {
          "attributes": false
        }
      }
    ]
  }
}
module.exports = config;