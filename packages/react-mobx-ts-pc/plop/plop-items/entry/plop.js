const path = require('path');
// const _ = require('lodash');
const {p} = require('../../../config');
const {
    PLOP_ITEM_ENTRY,
    PLOP_ITEM_PAGE,
    I18N_LOCALE_LIST,
} = require('../../constants');

const siteMapPath = path.join(p.src, 'common/site-map.ts');

module.exports = function (plop, data, utils) {
    plop.setGenerator(PLOP_ITEM_ENTRY, {
        prompts: [
            {
                type: 'input',
                name: 'entryName',
                message: 'entry 名称',
                validate: input => {
                    return !!(input.trim()) || 'entryName 名称不能为空';
                },
            },
        ],
        actions(inputs) {
            const pageGenerator = plop.getGenerator(PLOP_ITEM_PAGE);

            Object.assign(inputs, utils.getNameSet(inputs.entryName, 'entry'), {
                pageName: 'home',
            });

            return [
                {
                    type: 'addMany',
                    data,
                    base: path.join(__dirname),
                    destination: path.join(p.entries, inputs.entryName),
                    globOptions: {dot: true},
                    templateFiles: [
                        `${path.join(__dirname)}/**/*`,
                        `!${path.join(__dirname, 'plop.js')}`,
                        `!${path.join(__dirname, 'templates/*')}`,
                    ],
                },
                ...pageGenerator.actions(inputs),
                {
                    type: 'modify',
                    path: siteMapPath,
                    pattern: '/* plop.append:SITE_MAP_ENTRY_IMPORT */',
                    template: utils.readTemplate(path.join(__dirname, 'templates/site-map-entry-import.hbs')),
                    transform: utils.fixCodeStyle,
                },
                ...I18N_LOCALE_LIST.map(locale => {
                    return {
                        type: 'modify',
                        path: path.join(p.i18n, locale, 'common.ts'),
                        pattern: '/* plop.append:I18N_COMMON_DICT_NODE */',
                        template: utils.readTemplate(path.join(__dirname, 'templates/i18n-common-dict-node.hbs')),
                    };
                }),
                {
                    type: 'modify',
                    path: siteMapPath,
                    pattern: '/* plop.append:SITE_MAP_ENTRY_NODE */',
                    template: utils.readTemplate(path.join(__dirname, 'templates/site-map-entry-node.hbs')),
                },
            ];
        },
    });
};
