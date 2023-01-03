const path = require('path');
const {execSync} = require('child_process');
const fs = require('fs-extra');
const chalk = require('chalk');

const colorMap = {
    info: 'blue',
    success: 'green',
    error: 'red',
    warn: 'yellow',
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
    exit: (code = 0, message = '', type) => {
        type = type || {
            1: 'error',
        }[code] || 'info';

        if (message) {
            consoleMsg(message, type);
        }
        process.exit(code);
    },
    appendContent: (path, content) => {
        fs.ensureFileSync(path);
        content = fs.readFileSync(path).toString() + content;
        fs.writeFileSync(path, content);
    },
    listDir: dir => {
        return fs.readdirSync(dir).filter(name => fs.statSync(path.join(dir, name)).isDirectory());
    },
    execSync: (command, options = {}) => {
        return execSync(command, {
            stdio: 'inherit',
            ...options,
        });
    },
    isRepoDirty: () => {
        return !!execSync('git status -s', {encoding: 'utf8'}).trim();
    },
    getRepoBranch: () => {
        // git version >= 2.22, only
        // return execSync('git branch --show-current', {encoding: 'utf8'}).trim();
        return execSync('git rev-parse --abbrev-ref HEAD', {encoding: 'utf8'}).trim();
    },
    isRepoBranch: (branchName = 'master') => {
        const currentBranchName = module.exports.getRepoBranch();
        return branchName instanceof RegExp
            ? branchName.test(currentBranchName)
            : currentBranchName === branchName;
    },
    isDirExist: (dirPath) => {
        return fs.existsSync(dirPath) && fs.lstatSync(dirPath).isDirectory();
    },
    getRevision: (refname) => {
        return execSync(`git rev-parse ${refname}`, {encoding: 'utf8'}).trim();
    },
};
