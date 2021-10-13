module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'airbnb',
    'plugin:import/errors',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'prettier/@typescript-eslint',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    window: true,
    document: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'react',
    '@typescript-eslint',
    'prettier',
    'react-hooks',
    'import'
  ],
  rules: {
    'prettier/prettier': [
      'error',
      {
        'printWidth': 120,
        'singleQuote': true,
        'semi': false,
        'trailingComma': 'es5',
        'arrowParens': 'always'
      }
    ],
    'import/extensions': [
      'error',
      'always',
      {
        'js': 'never',
        'jsx': 'never',
        'ts': 'never',
        'tsx': 'never'
      }
    ],
    'import/no-extraneous-dependencies': 0,
    'import/prefer-default-export': 0,
    'import/order': 1,
    'no-unused-expressions': 0, // Turn off base to work with following line
    '@typescript-eslint/no-unused-expressions': ['error', { // https://github.com/facebook/create-react-app/pull/8003
      'allowShortCircuit': true,
      'allowTernary': true,
      'allowTaggedTemplates': true,
    }],
    'no-prototype-builtins': 0,
    'no-use-before-define': 0,
    'arrow-body-style': 0,
    'arrow-parens': [1, 'always'],
    'dot-notation': 0,
    'no-console': ['error', { 'allow': ['warn', 'error'] }],
    'no-case-declarations': 0,
    'no-shadow': 0,
    'no-nested-ternary': 0,
    'consistent-return': 0,
    'react/no-unused-state': 1,
    'react/state-in-constructor': 0,
    'react/destructuring-assignment': [2, 'always', { 'ignoreClassFields': true }],
    'react/jsx-key': 0,
    'react/prop-types': 0,
    'react/display-name': 0,
    'react/sort-comp': [1, {
      'order': [
        'static-methods',
        'instance-variables',
        'lifecycle',
        'everything-else',
        'render',
      ]
    }],
    'react/no-array-index-key': 1,
    'react/no-unescaped-entities': 0,
    'react/jsx-filename-extension': [1, { 'extensions': ['.tsx', '.jsx'] }],
    'react/jsx-props-no-spreading': 0,
    'react/jsx-wrap-multilines': 0,
    'react/jsx-one-expression-per-line': 0,
    'semi': [1, 'never'],
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/no-empty-interface': 0,
    '@typescript-eslint/no-namespace': [1, { 'allowDeclarations': true, 'allowDefinitionFiles': true }],
    '@typescript-eslint/no-unused-vars': [1, {
      'vars': 'all',
      'args': 'after-used',
      'ignoreRestSiblings': true
    }],
    '@typescript-eslint/camelcase': 0,
    '@typescript-eslint/ban-ts-ignore': 1,
    '@typescript-eslint/no-inferrable-types': 0,
    'jsx-a11y/no-noninteractive-element-interactions': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-static-element-interactions': 0
  },
  overrides: [
    {
      'files': ['**/*.d.ts'],
      'rules': {
        'prettier/prettier': 0,
        'no-var': 0,
        'semi': 0,
        'import/order': 0,
        'import/newline-after-import': 0
      }
    }
  ],
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      node: {
        extensions: ['.tsx', '.ts', '.jsx', '.js']
      }
    }
  }
};
