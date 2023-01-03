/**
 * @file inferred-config.js
 */

const findUp = require('find-up');
const parseGitConfig = require('parse-git-config');

const localGitConfPath = findUp.sync('.git/config');

function throwGitUsernameError() {
    throw new Error('你可能没有配置 git config --local user.name\n 请通过 git config user.name "xxx" 配置');
}

if (localGitConfPath) {
    const gitConfig = parseGitConfig.sync({
        path: localGitConfPath,
    });
    if (gitConfig.user && gitConfig.user.name) {
        module.exports = {
            userName: gitConfig.user.name,
        };
    } else {
        throwGitUsernameError();
    }
} else {
    throwGitUsernameError();
}
