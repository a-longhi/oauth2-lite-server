module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: [
        'eslint-config-airbnb-base',
    ],
    parserOptions: {
        parser: 'babel-eslint',
    },
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'linebreak-style': ['error', 'windows'],
        indent: ['error', 4],
    },
    overrides: [
        {
            files: [
                '**/__tests__/*.{j,t}s?(x)',
                '**/tests/unit/**/*.spec.{j,t}s?(x)',
                '**/tests/e2e/**/*.spec.{j,t}s?(x)',
                '**/tests/unit/stubs/*.{j,t}s?(x)',
                '**/tests/unit/*.{j,t}s?(x)',
            ],
            env: {
                jest: true,
            },
        },
    ],
};
