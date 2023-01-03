/**
 * 创建 seed pkg 脚本
 * - 创建 seed 包，标准化包名 `@befe/seed-${seedName}`
 * - 模板化生成 seed 基础文件
 */

// const path = require('path')
const {program} = require('commander');
const shell = require('shelljs');
const prompts = require('prompts');

const {p} = require('../config');

const plopUtils = require('../plop/utils');
const {PLOP_ITEM_REPO_PACKAGE} = require('../plop/constants');
const util = require('./util');

function createRepo(name) {
    const {packageName, repoName} = plopUtils.getRepoNameSet(name);

    util.info(`create seed ${name} `);

    shell.cd(p.packages);
    util.execSync(`npx plop ${PLOP_ITEM_REPO_PACKAGE} ${repoName}`);

    shell.cd(p.root);
    util.execSync('npm run bootstrap');

    util.success(`${packageName} created`);
}

program
    .arguments('[repoName]')
    .action(async repoName => {
        const questions = [
            {
                type: repoName ? null : 'text',
                name: 'name',
                message: 'enter repo name without prefix `react-mobx-pc`',
                initial: '',
                validate: input => !!input,
            },
        ];

        const {name} = {
            name: repoName,
            ...(await prompts(questions)),
        };
        createRepo(name);
    })
    .parse(process.argv);
