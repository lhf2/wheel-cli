'use strict';

const fs = require('fs')
// 引入颜色库 colors
const colors = require('colors/safe')
// 引入版本比对第三方库 semver
const semver = require('semver')
// 引入当前脚手架的 package.json
const pkg = require('../package.json')
// 引入我们封装的 npmlog 工具
const log = require('@wheel-cli/log')
// 引入配置文件
const constant = require('./const')
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
        checkInputArgs(); 
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
    const lowestVersion = constant.LOWEST_NODE_VERSION
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
  if (args.debug) {
    process.env.LOG_LEVEL = 'verbose';
  } else {
    process.env.LOG_LEVEL = 'info';
  }
  // 设置 log 的等级
  log.level = process.env.LOG_LEVEL;
}



module.exports = core
