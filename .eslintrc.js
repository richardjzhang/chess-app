module.exports = {
  extends: [
    'react-app',
    'prettier',
    'prettier/flowtype',
    'prettier/react',
    'plugin:react/recommended',
  ],
  parser: 'babel-eslint',
  plugins: ['flowtype', 'prettier', 'import', 'module-resolver'],
  rules: {
    'no-console': 'off',
    'class-methods-use-this': 'off',
    'react/jsx-curly-brace-presence': [{ children: 'ignore' }],
    'react/no-array-index-key': 'warn',
    'react/require-default-props': 'off',
  },
  settings: {
    'import/resolver': {
      node: {
        moduleDirectory: ['node_modules', 'src/'],
      },
    },
  },
};
