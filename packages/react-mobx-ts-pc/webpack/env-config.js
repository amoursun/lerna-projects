// 建议总是将前端静态资源按一个整体 serve 出去
// 相应的，流控可以简单配置成 webapp-domain/static/* -> frontend-domain/*

// @note:
// WEBPACK_ENV = 'dev' | 'sit' | ... | 'prd' 在 ci 环境运行时写入，
// 见 ../ci.yml 中各个 profile 的 commend，
// 调整、新增需一一对应调整

// @todo 根据项目情况处置
module.exports = {
    dev: {
        API_CONTEXT: '',
        WEB_CONTEXT: 'static',
        ERP_HOME_URL: '',
    },
    uat: {
        API_CONTEXT: '',
        WEB_CONTEXT: 'static',
        ERP_HOME_URL: '',
    },
    prd: {
        API_CONTEXT: '',
        WEB_CONTEXT: 'static',
        ERP_HOME_URL: '',
        devtool: false,
    },
}[process.env.WEBPACK_ENV] || {
    API_CONTEXT: '',
    WEB_CONTEXT: '',
    ERP_HOME_URL: '',
};
