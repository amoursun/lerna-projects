/**
 * 发版前的必要工作
 * - copy 每个 seed 的 .gitignore 为 ${SEED_GIT_IGNORE_FILE_NAME}
 * - copy 每个 seed 的 .npmrc 为 ${SEED_NPMRC_FILE_NAME}
 */
const path = require('path');
const glob = require('glob');
const {program} = require('commander');
const shell = require('shelljs');
const {p} = require('../config');
const {PACKAGE_GIT_IGNORE_FILE_NAME, PACKAGE_NPMRC_FILE_NAME} = require('./constants');
const {info, execSync} = require('./util');
const {checkPublishBranch, checkRepoDirty} = require('./util-version-publish');

function globPackages() {
    return glob.sync(path.join(p.packages, '*'));
}

function cpNpmIgnoreFile(seed, fileName, targetName) {
    shell.cp('-f', fileName, targetName);
    info(`${path.basename(seed)}: cp ${fileName} -> ${targetName}`);
}

function disguiseNpmIgnoreFiles() {
    globPackages().forEach(package => {
        // .gitignore 可能不止一个
        glob.sync(path.join(package, '**/.gitignore')).forEach(ignoreFile => {
            if (!ignoreFile.includes('node_modules')) {
                cpNpmIgnoreFile(package, ignoreFile, ignoreFile.replace('.gitignore', PACKAGE_GIT_IGNORE_FILE_NAME));
            }
        });
        cpNpmIgnoreFile(package, path.join(package, '.npmrc'), path.join(package, PACKAGE_NPMRC_FILE_NAME));
    });
}

function preCheck(options) {
    const {ci} = options;
    // ci 是 version 串联 publish，不用重复检查
    if (!ci) {
        checkPublishBranch();
        checkRepoDirty();
    }
}

function prePublish() {
    disguiseNpmIgnoreFiles();
}

async function postPublish(options) {
    const {ci = false} = options;
    if (ci) {
        execSync('git push');
    }
    execSync('git push --tags');
}

function publish() {
    execSync('npx lerna publish from-package --yes');
}

async function cmdPublish(options) {
    try {
        preCheck(options);
        prePublish(options);
        publish(options);
        await postPublish(options);
    } catch (e) {
        process.exit(1);
    }
}

program
    .option('--ci')
    .action(cmdPublish);

program.parse(process.argv);
