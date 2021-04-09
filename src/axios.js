/*
 * @Author       : xuesong.li
 * @Date         : 2020-08-12 15:02:21
 * @LastEditors  : xuesong.li
 * @LastEditTime : 2020-08-12 16:37:09
 * @FilePath     : /iot-min/src/utils/request.js
 */
import Vue from "vue";
const bus = new Vue();
import axios from "axios";
import uuidjs from "uuidjs";
import { store } from "./store/store.js";
const service = axios.create({
  // baseURL: `/${envConfig.group}/${envConfig.rep}`,
  timeout: 10000, // 请求超时时间
  headers: {
    // 'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
    userSource: "inner",
    osType: "web",
  },
});

// 创建 axios 实例
class RequestPool {
  constructor(concurrentNum) {
    this.dataStore = [];
    this.concurrentNum = concurrentNum;
  }
  enqueue(config) {
    //写入唯一标识,cancelToken
    config.req_id = uuidjs.generate();
    var CancelToken = axios.CancelToken;
    var source = CancelToken.source();
    config.cancelToken = source.token;
    config.cancelSource = source;
    this.dataStore.push(config);
  }
  async dequeue(req_id) {
    for (let index in this.dataStore) {
      if (this.dataStore[index].req_id === req_id) {
        this.dataStore.splice(index, 1);
        break;
      }
    }
    const nextReq = this.dataStore[this.concurrentNum - 1];
    if (nextReq) {
      const res = await service(nextReq);
      bus.$emit(nextReq.req_id, res);
    }
  }
  queuewaitSequence(config) {
    return (
      this.dataStore.length <= this.concurrentNum ||
      this.dataStore.indexOf(config) <= this.concurrentNum - 1
    );
  }
  async send(config) {
    this.enqueue(config);
    if (this.queuewaitSequence(config)) {
      return await service(config);
    } else {
      return new Promise(function(resolve, reject) {
        bus.$once(config.req_id, function(event) {
          resolve(event);
        });
      });
    }
  }
  cancelPendingRequests() {
    for (let item of this.dataStore) {
      item.cancelSource && item.cancelSource.cancel();
    }
    this.dataStore = [];
  }
}
const requestPool = new RequestPool(5);

const err = (error) => {
  error.config && requestPool.dequeue(error.config.req_id);
  if (error.response) {
    if (error.response.status === 403) {
      bus.$message.error("ticket invalid");

      // window.location.href =
      //   error.response.headers.location + "?jumpto=" + window.location.href;
    } else {
      bus.$message.error(error.response.data.msg);
    }
  }
  store.commit("STOP_ALL_LOADING");
  return Promise.reject(error);
};

// request interceptor
service.interceptors.request.use((config, req) => {
  config.headers["x-requested-with"] = "XMLHttpRequest";
  return config;
}, err);
// response interceptor
service.interceptors.response.use((response) => {
  requestPool.dequeue(response.config.req_id);
  return response;
}, err);

export { requestPool as axios };
