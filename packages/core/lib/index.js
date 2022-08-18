'use strict';

const fs = require('fs')
const path = require('path')
// 引入颜色库 colors
const colors = require('colors/safe')
// 引入版本比对第三方库 semver
const semver = require('semver')
// 引入当前脚手架的 package.json
const pkg = require('../package.json')
// 引入我们封装的 npmlog 工具
const log = require('@wheel-cli/log')
// 引入配置文件
const { LOWEST_NODE_VERSION, DEFAULT_CLI_HOME} = require('./const')
// 引入user-home 跨操作系统获取用户主目录
const userHome = require('user-home')

/**
 * @description: 核心方法
 * @param {*}
 * @return {*}
 */
function core() {
    try {
        // 检查版本号
        checkPkgVersion()
        // 检查 node 版本
        checkNodeVersion()
        // 检查是否为 root 启动
        checkRoot()
        // 检查用户主目录
        checkUserHome()
        // 检查用户输入参数
        checkInputArgs()
        // 检查环境变量
        checkEnv()
    } catch (error) {
        log.error(error.message)
    }
    
}

/**
 * @description: 检查 package.json 中的 version 版本号
 * @param {*}
 * @return {*}
 */
function checkPkgVersion() {
    log.info('wheel-cli version', pkg.version)
}

/**
 * @description: 检查当前的 node 版本,防止 node 版本过低调用最新 api 出错
 * @param {*}
 * @return {*}
 */
function checkNodeVersion() {
    // 获取当前 node 版本号
    const currentVersion = process.version
    // 获取最低 node 版本号
    const lowestVersion = LOWEST_NODE_VERSION
    // 对比最低 node 版本号
    if (!semver.gte(currentVersion, lowestVersion)) {
        throw new Error(`wheel-cli 需要node的最低版本为${lowestVersion}，当前node.js版本为${currentVersion}`);
    }
}

/**
 * @description: 需要检查用户是否有root权限，如果没有，则会进行降级处理
 * @param {*}
 * @return {*}
 */
function checkRoot() {
    // 检查 root 等级并自动降级
    const rootCheck = require('root-check');
    rootCheck();
}

/**
 * @description:检查用户主目录
 * @param {*}
 * @return {*}
 */
function checkUserHome() {
    // userHome: /Users/xxx
    if (!userHome || !fs.existsSync(userHome)) {
        throw new Error(colors.red('当前登录用户主目录不存在！'));
    }
}

/**
 * @description: 解析参数,判断是否开启 debug 模式,并在全局变量中设置 log 等级
 * @param {*}
 * @return {*}
 */
let args
function checkInputArgs() {
    const minimist = require('minimist');
    args = minimist(process.argv.slice(2));
    // 判断是否开启 debug 模式,并在全局变量中设置 log 等级
    checkArgs();
}

/**
 * @description: 判断是否开启 debug 模式,并在全局变量中设置 log 等级
 * @param {*}
 * @return {*}
 */
function checkArgs() {
    // wheel-cli --debug
    if (args.debug) {
        process.env.LOG_LEVEL = 'verbose';
    } else {
        process.env.LOG_LEVEL = 'info';
    }
    // 设置 log 的等级
    log.level = process.env.LOG_LEVEL;
}


/**
 * @description: 检查环境变量
 * @param {*}
 * @return {*}
 */
function checkEnv() {
    const dotenv = require('dotenv')
    // 把.env的环境变量放在process.env里
    dotenv.config({
        path: path.resolve(userHome, '.env')
    })
    // 创建默认的环境变量配置
    createDefaultConfig()
    log.verbose('环境变量', process.env.CLI_HOME_PATH)
}

/**
 * @description: 创建默认的环境变量配置
 * @param {*}
 * @return {*}
 */
function createDefaultConfig() {
    const cliConfig = {
        home: userHome
    }

    // 如果 CLI_HOME 存在 使用CLI_HOME
    if (process.env.CLI_HOME) {
        cliConfig['cliHome'] = path.join(userHome, process.env.CLI_HOME)
    } else {
        // 如果 CLI_HOME 不存在 使用默认配置
        cliConfig['cliHome'] = path.join(userHome, DEFAULT_CLI_HOME);
    }

    // 设置 process.env.CLI_HOME_PATH
    process.env.CLI_HOME_PATH = cliConfig.cliHome;
}


module.exports = core
