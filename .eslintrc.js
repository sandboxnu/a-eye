module.exports = {
    extends: ['airbnb-typescript', 'eslint-config-prettier' ],
    parserOptions: {
        project: './tsconfig.eslint.json'
    },
    plugins: ["prettier"],
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
