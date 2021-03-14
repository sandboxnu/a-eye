module.exports = {
  extends: ['airbnb-typescript', 'eslint-config-prettier'],
  parserOptions: {
    project: './tsconfig.eslint.json',
  },
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        printWidth: 80,
        arrowParens: 'avoid',
        trailingComma: 'all',
        'endOfLine': 'auto',
      },
    ],
    // incompatible with prettier
    'react/jsx-curly-newline': 'off',
    'react/jsx-indent': 'off',
    'react/jsx-wrap-multilines': 'off',
    'react/jsx-closing-tag-location': 'off',
    'react/no-array-index-key': 'warn',
    '@typescript-eslint/indent': 'off',

    // we're using typescript, so we have prop types
    'react/prop-types': 'off',

    // personal preference
    'react/jsx-props-no-spreading': 'off',
  },
};
