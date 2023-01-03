const {execSync, isRepoDirty, isRepoBranch, getRevision, getRepoBranch, warn} = require('./util');

const TEMP_PUBLISH_BRANCH = 'publish';

function checkRemoteBranchPublish() {
    const remoteBranch = execSync(
        `git ls-remote origin ${TEMP_PUBLISH_BRANCH}`,
        {stdio: 'pipe', encoding: 'utf8'}
    ).toString();

    if (remoteBranch) {
        warn(`remote(icode) 存在分支 ${TEMP_PUBLISH_BRANCH}，无法进行 version-publish`);
        warn('请将 remote(icode) 已发布的 publish 分支合入 master 并删除后重试');
        process.exit(1);
    }
}

function checkPublishBranch() {
    if (!isRepoBranch(/^ver\/\d+\.\d+\.0$/)) {
        warn('只能在 ver/x.y.0 分支上执行 version-publish');
        process.exit(1);
    }
}

function checkRepoDirty() {
    if (isRepoDirty()) {
        warn('存在未提交的更改，无法进行 version-publish');
        process.exit(1);
    }
}

/**
 * 检查触发 version 的 revision 是不是和 origin/${branchName} 匹配，
 * 以防流水线误触发过时的发版
 */
function checkRemoteRevision() {
    const branchName = getRepoBranch();
    if (getRevision(`origin/${branchName}`) !== getRevision('HEAD')) {
        warn(`当前 revision 和 origin/${branchName} 不匹配，无法进行 version`);
        process.exit(1);
    }
}

exports.checkPublishBranch = checkPublishBranch;
exports.checkRepoDirty = checkRepoDirty;
exports.checkRemoteBranchPublish = checkRemoteBranchPublish;
exports.checkRemoteRevision = checkRemoteRevision;
exports.TEMP_PUBLISH_BRANCH = TEMP_PUBLISH_BRANCH;
