const {exec} = require('child_process');
const path = require('path');
const fs = require('fs');
const {program} = require('commander');
const glob = require('glob');
const ora = require('ora');
const semver = require('semver');
const {workspaces} = require('../package.json');
const {p} = require('../config');
const {execSync, warn, getRepoBranch} = require('./util');
const {
    checkRepoDirty,
    checkPublishBranch,
    checkRemoteRevision,
} = require('./util-version-publish');

function checkProjects() {
    const pkgJsonPaths = glob.sync(path.join(p.root, 'projects/*/package.json'));
    const allPrivate = pkgJsonPaths.every(pkgJsonPath => {
        return JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8')).private;
    });
    if (!allPrivate) {
        warn('projects 目录存在非 private package, 无法进行 version');
        process.exit(1);
    }
}

/**
 * 尝试推送一个 dummy 分支看是否可以直接用 git push 进行推送到远端（icode）
 * - 成功则马上将其从远端删除
 * - 失败则由 git 抛错自然退出
 */
function canCiPush() {
    const DUMMY_BRANCH_NAME = 'temp/dummy-check-ci-push';
    const branchName = getRepoBranch();
    execSync('echo "try git push" > dummy.txt');
    execSync(`git checkout -b "${DUMMY_BRANCH_NAME}" && git add -A && git commit -m "dummy message" --no-verify`);
    execSync(`git push --set-upstream origin "${DUMMY_BRANCH_NAME}" && git push -d origin "${DUMMY_BRANCH_NAME}"`);
    execSync(`git reset --hard ${branchName} && git clean -fd && git checkout ${branchName}`);
    execSync(`git branch -d ${DUMMY_BRANCH_NAME}`);
}

async function checkRemoteTag(pkg) {
    return new Promise((resolve, reject) => {
        // eslint-disable-next-line import/no-dynamic-require
        const {name, version, ..._pkg} = require(pkg);
        if (_pkg.private) {
            resolve();
        }

        const nextVersion = semver.inc(version, 'patch');
        const tag = `${name}@${nextVersion}`;
        exec(`git ls-remote --tags origin ${tag}`, {stdio: 'pipe', encoding: 'utf8'}, function (err, stdout) {
            if (stdout) {
                reject(new Error(stdout.toString()));
            }
            resolve(tag);
        });
    });
}

async function checkRemoteTags() {
    const spinner = ora().start('checking remote tags ');

    const packages = workspaces.reduce(
        (cal, workspace) => cal.concat(glob.sync(path.resolve(__dirname, '..', workspace, 'package.json'))),
        []
    );

    try {
        await Promise.all(packages.map(pkg => {
            return checkRemoteTag(pkg).then(pkgVersion => {
                if (pkgVersion) {
                    spinner.text = `${pkgVersion} checked, it is not exist in remote`;
                }
            });
        }));
        spinner.succeed('remote tags all checked');
    } catch (e) {
        spinner.fail(`tag exist in remote: ${e.message}`);
        warn('可能有未合入的 publish commit，请检查确认并更新后重新执行 version');
        process.exit(1);
    }
}

function getVersionScope() {
    const output = execSync('npx lerna updated', {stdio: 'pipe', encoding: 'utf8'});
    return output.trim().split('\n')
        .filter(pkgName => !/^@befe\/(seed|play)-/.test(pkgName))
        .map(pkgName => `--scope=${pkgName}`)
        .join(' ');
}

function preVersion(options) {
    const {ci = false} = options;
    // ===== pre version =====
    const versionScope = getVersionScope();
    if (versionScope) {
        let runOptionsString = `--stream --no-private ${versionScope}`;
        if (ci) {
            // agile 进行的是 `git clone --depth 1` shallow clone
            // 没有历史会导致 version 总是所有包都跳版本，需要先把历史恢复过来
            execSync('git fetch --unshallow');

            // ci 必定先 install 而 postinstall 已经 bootstrap 过了，不需要再次 bootstrap
        } else {
            // 不同于 ci version 运行前未必经过（正确） bootstrap，所以总是先运行一下
            execSync('npm run lerna:bootstrap');
            execSync('npx jest -c jest.config.ci.js');
        }

        execSync(`npx lerna run build ${runOptionsString}`);
    }
}

function version(options) {
    const {semver} = options;
    execSync(`npx lerna version ${semver} --yes`);
}

async function preCheck(options) {
    if (options.ci) {
        // ci 可能因为未关闭 "仅允许 git push origin HEAD:refs/for/xxx" 设置而无法推送
        // 先试一下，失败就快速退出
        canCiPush();
    }
    checkPublishBranch();
    checkRepoDirty();
    checkRemoteRevision();
    checkProjects();
    await checkRemoteTags();
}

async function cmdVersion(options) {
    try {
        await preCheck(options);
        preVersion(options);
        version(options);
    } catch (e) {
        process.exit(1);
    }
}

program
    .option('--ci')
    .option('-s, --semver <keyword>', 'semantic version keyword', 'patch')
    .action(cmdVersion);

program.parse(process.argv);
