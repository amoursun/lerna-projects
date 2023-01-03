module.exports = {
    extends: [
        '@babel/preset-typescript',
        'plugin:react/jsx-runtime',
    ],

    /**
     * 必要时，此处覆盖团队规范规则。
     * 务必明确覆盖的意义， why, why not。
     * 应在团队层面进行讨论后，谨慎加入。
     * 注意，.ts, .tsx 的覆盖须写到下方 overrides[0].rules 中
     */
    rules: {
        // override .js, .jsx rules
        'react/no-unknown-property': ['error', {ignore: ['styleName']}],
    },
    overrides: [{
        files: ['*.ts?(x)'],
        rules: {
            // override .ts, .tsx rules
        },
    }],
};
