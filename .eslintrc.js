module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2021: true,
    },
    extends: ['airbnb-base'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'latest',
    },
    plugins: ['@typescript-eslint'],
    rules: {
        indent: ['error', 4],
        'import/extensions': ['error', 'never'],
        'no-use-before-define': 'off',
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': ['error'],
        'operator-linebreak': 'off',
    },
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
            },
        },
    },
};
