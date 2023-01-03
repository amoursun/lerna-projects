const fs = require('fs');
const path = require('path');

const {p} = require('../config');

function listDir(dir) {
    return fs.readdirSync(dir).filter(name => fs.statSync(path.join(dir, name)).isDirectory());
}
module.exports = {
    PLOP_ITEM_ENTRY: 'entry',
    PLOP_ITEM_PAGE: 'page',
    PLOP_ITEM_ENTRY_APPROVAL: 'entry-approval',
    I18N_LOCALE_LIST: listDir(path.join(p.src, 'i18n')),
};
