const chalk = require('chalk');

const colorMap = {
    info: 'blue',
    success: 'green',
    error: 'red',
    warn: 'yellow',
    debug: 'cyan',
};

function consoleMsg(msg, type = 'info') {
    if (msg) {
        const color = colorMap[type];
        const title = color ? chalk[color](`[${type}] `) : '';

        console.info(`${title}${msg}`);
    }
}

module.exports = {
    log: msg => console.info(msg),
    info: msg => consoleMsg(msg, 'info'),
    success: msg => consoleMsg(msg, 'success'),
    error: msg => consoleMsg(msg, 'error'),
    warn: msg => consoleMsg(msg, 'warn'),
    debug: msg => consoleMsg(msg, 'debug'),
};
