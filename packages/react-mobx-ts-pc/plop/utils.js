/* eslint-disable */
const fs = require('fs');
const npath = require('path');
const dayjs = require('dayjs');
const _ = require('lodash');

const globalConfig = {};

const plopUtils = {
    getNameSet(nameRaw, keyPrefix = '') {
        const name = _.kebabCase(nameRaw);
        const nameKebab = name;
        const nameCamel = _.camelCase(name);
        const nameSnake = _.snakeCase(name);
        const nameSnakeUpper = nameSnake.toUpperCase();
        const namePascal = _.upperFirst(nameCamel);

        const nameSet = {
            name,
            nameKebab,
            nameSnake,
            nameSnakeUpper,
            nameConstant: nameSnakeUpper,
            nameCamel,
            namePascal,
        }

        if (keyPrefix) {
            const _nameSet = {}
            keyPrefix = _.camelCase(keyPrefix)
            Object.keys(nameSet).forEach(key => {
                const _key = keyPrefix ? `${keyPrefix}${_.upperFirst(key)}` : key
                _nameSet[_key] = nameSet[key]
            })
            return _nameSet
        }

        return nameSet;
    },

    getDirNextFileNameIndex(dirname = process.cwd()) {
        if (!fs.existsSync(dirname)) {
            return 0;
        }

        return Math.max(0, ...fs.readdirSync(dirname).map(filename => {
            const maybeNumber = Number(filename.split('.')[0]);
            return isNaN(maybeNumber) ? -1 : maybeNumber;
        })) + 1;
    },

    readTemplate(tplPath) {
        return fs.readFileSync(tplPath).toString().trim()
    },

    fixCodeStyle(fileContent) {
        return fileContent
            .replace(/import {\s(.+)\s} from/g, (match, p1) => `import {${p1}} from`);
    },

    validators: {
        required(keyName) {
            return function (input) {
                const done = this.async();

                if (!_.trim(input)) {
                    done(`${keyName} 不能为空`);
                } else {
                    done(null, true);
                }
            };
        },
    },

    setGlobal(incomingGlobalConfig) {
        Object.assign(globalConfig, incomingGlobalConfig);
    },

    validateWorkingDir(pathsToMatch, relativeToWorkingPath = '.') {
        const workingPath = npath.resolve(process.cwd(), relativeToWorkingPath);
        return pathsToMatch.includes(workingPath);
    },

    /**
     * 本方法需要在 setGlobal 之后才能调用
     *
     * @def: path, plop => undefined
     *  ///
     *  generators 的文件夹所在,
     *  利用其位置, 得到一系列 generator 的文件夹,
     *  使用其内部 plop.js 进行初始化, plop.js 的规则与 plopfile.js 一致
     *  ///
     *  path: string
     *
     *  plop: #@plopInstance
     */
    loadGenerators(path, plop) {
        const currentPath = npath.resolve('.');
        const extraData = {
            currentPath,
            today: dayjs().format('YYYY-MM-DD'),
            ...globalConfig,
        };

        const files = fs.readdirSync(path);

        files.forEach(file => {
            const generatorPlopFile = npath.resolve(path, file, 'plop.js');
            if (fs.existsSync(generatorPlopFile)) {
                try {
                    require(generatorPlopFile)(plop, extraData, plopUtils);
                } catch (ex) {
                    console.error('遇到错误', ex);
                    console.error('路径为 : ', generatorPlopFile);
                }
            }
        });
    },
};

module.exports = plopUtils;
