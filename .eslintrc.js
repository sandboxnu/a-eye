module.exports = {
    extends: ['airbnb-typescript'],
    parserOptions: {
        project: './tsconfig.eslint.json'
    },
    rules: {
        'prettier/prettier': [
            'error',
            {
                singleQuote: true,
                printWidth: 80,
                arrowParens: 'avoid',
                trailingComma: 'all'
            }
        ]
    }
};
