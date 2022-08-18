'use strict';

const axios = require('axios');
const urlJoin = require('url-join');
const semver = require('semver');

/**
 * @description: 获取 npm 模块的信息
 * @param {*} npmName npm 模块名称
 * @param {*} register npm 镜像地址
 * @return {*}
 */
async function getNpmInfo(npmName, register) {
    // 如果 npmName 不存在直接返回
    if (!npmName) {
        return null;
    }
    // 获取镜像地址, 如果没有传递参数则默认使用 npm 源
    const registerUrl = register || getRegister('taobao');
    // 拼接url
    const npmInfoUrl = urlJoin(registerUrl, npmName);
    // 调用 npm API 获取数据
    return axios
        .get(npmInfoUrl)
        .then((res) => {
          if (res.status === 200) {
            return res.data;
          }
          return null;
        })
        .catch((e) => {
          return Promise.reject(e);
        });
}


/**
 * @description: 获取 npm 镜像地址
 * @param {*} origin 源
 * @return {*} 镜像地址
 */
function getRegister(origin) {
  const originList = {
    npm: 'https://registry.npmjs.org/',
    taobao: 'https://registry.npmmirror.com/',
  };
  return originList[origin];
}

/**
 * @description: 获取模块版本号数组
 * @param {*} npmName npm 模块名称
 * @param {*} register npm 镜像地址
 * @return {*} 模块的版本号
 */
async function getNpmVersions(npmName, register) {
  const data = await getNpmInfo(npmName, register)
  const versions = Object.keys(data.versions)
  return versions
}

/**
 * @description: 获取符合条件的版本号(大于当前版本的版本号)
 * @param {*} baseVersion  当前版本
 * @param {*} versions 版本号数组
 * @return {*} 大于当前版本的版本号数组
 */
function getNpmSemverVersions(baseVersion, versions) {
  if (!versions || versions.length === 0) {
    return []
  }
  return versions
    .filter((version) => semver.satisfies(version, `>=1.0.0`))
    .sort((a, b) => semver.gt(b, a))
}


/**
 * @description:从 npm 获取符合条件的版本号(大于当前版本的最新版本号)
 * @param {*} npmName npm 模块名称
 * @param {*} register npm 镜像地址
 * @param {*} baseVersion  当前版本
 * @return {*} 最新版本号
 */
async function getNpmSemverVersion(baseVersion, npmName, register) {
  const versions = await getNpmVersions(npmName, register)
  const newVersions = await getNpmSemverVersions(baseVersion, versions)
  return newVersions[0] || null
}

module.exports = {
  getNpmInfo,
  getNpmVersions,
  getNpmSemverVersion
}