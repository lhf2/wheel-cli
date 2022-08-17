'use strict';

// 引入当前脚手架的 package.json
const pkg = require('../package.json')

// 引入我们封装的 npmlog 工具
const log = require('@wheel-cli/log')

/**
 * @description: 核心方法
 * @param {*}
 * @return {*}
 */
function core() {
    // 检查版本号
    checkPkgVersion()
}

/**
 * @description: 检查 package.json 中的 version 版本号
 * @param {*}
 * @return {*}
 */
function checkPkgVersion() {
    log.success('友情提示，当前的版本是：', pkg.version)
}

module.exports = core
