'use strict';

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
    log.success('友情提示，当前的版本是：', pkg.version)
}

/**
 * @description: 检查当前的 node 版本,防止 node 版本过低调用最新 api 出错
 * @param {*}
 * @return {*}
 */
function checkNodeVersion() {
    // 获取当前 node 版本号
    const currentVersion = process.version
    log.info('友情提示,当前的node版本是:', process.version)
    // 获取最低 node 版本号
    const lowestVersion = constant.LOWEST_NODE_VERSION
    // 对比最低 node 版本号
    if (!semver.gte(currentVersion, lowestVersion)) {
        throw new Error(colors.red('错误:node版本过低'));
    }
}

module.exports = core
