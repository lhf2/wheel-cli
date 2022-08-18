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

