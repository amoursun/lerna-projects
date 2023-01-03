const path = require('path');
// const _ = require('lodash');
const {p, entries} = require('../../../config');
const {
    PLOP_ITEM_PAGE,
    I18N_LOCALE_LIST,
} = require('../../constants');


module.exports = function (plop, data, utils) {
    plop.setGenerator(PLOP_ITEM_PAGE, {
        prompts: [
            {
                type: 'list',
                name: 'entryName',
                choices: entries,
                message: '在哪个 entry 创建页面',
                default: entries[0],
            }, {
                type: 'input',
                name: 'pageName',
                message: '页面名称',
                validate: input => {
                    return !!(input.trim()) || 'pageName 名称不能为空';
                },
            },
        ],
        actions(inputs) {
            if (!inputs.entryName) {
                throw new Error('`entryName` is required');
            }

            Object.assign(inputs,
                utils.getNameSet(inputs.pageName, 'page'),
                utils.getNameSet(inputs.entryName, 'entry')
            );
            return [
                {
                    type: 'addMany',
                    data,
                    base: path.join(__dirname),
                    destination: path.join(p.entries, inputs.entryName, inputs.pageName),
                    globOptions: {dot: true},
                    templateFiles: [
                        `${path.join(__dirname)}/**/*`,
                        `!${path.join(__dirname, 'plop.js')}`,
                        `!${path.join(__dirname, 'templates/*')}`,
                    ],
                },
                {
                    type: 'modify',
                    path: path.join(p.entries, inputs.entryName, 'site-map.ts'),
                    pattern: '/* plop.append:SITE_MAP_NODE_EXPORT */',
                    template: utils.readTemplate(path.join(__dirname, 'templates/site-map-node-export.hbs')),
                },
                {
                    type: 'modify',
                    path: path.join(p.entries, inputs.entryName, 'site-map.ts'),
                    pattern: '/* plop.append:PAGE_SITE_MAP_CHILD */',
                    template: utils.readTemplate(path.join(__dirname, 'templates/site-map-child.hbs')),
                },
                {
                    type: 'modify',
                    path: path.join(p.entries, inputs.entryName, 'routes.ts'),
                    pattern: '/* plop.append:PAGE_ROUTES_ROUTE_ITEM */',
                    template: utils.readTemplate(path.join(__dirname, 'templates/routes-route-item.hbs')),
                },
                {
                    type: 'modify',
                    path: path.join(p.entries, inputs.entryName, 'routes.ts'),
                    pattern: '/* plop.append:PAGE_SITE_NODE_IMPORT */',
                    template: utils.readTemplate(path.join(__dirname, 'templates/routes-site-node-import.hbs')),
                },
                ...I18N_LOCALE_LIST.map(locale => {
                    return {
                        type: 'modify',
                        path: path.join(p.i18n, locale, 'common.ts'),
                        pattern: '/* plop.append:I18N_COMMON_DICT_NODE */',
                        template: utils.readTemplate(path.join(__dirname, 'templates/i18n-common-dict-node.hbs')),
                    };
                }),
            ];
        },
    });
};
