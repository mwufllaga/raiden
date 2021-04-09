import { axios } from "@/axios.js";

class RequestPool {
  constructor() {
    this.dataStore = [];
    this.length = this.dataStore.length;
  }
  enqueue(element) {
    this.dataStore.push(element);
  }
  dequeue() {
    if (this.length === 0) return "This queue is empty";
    else {
      this.dataStore.shift();
    }
    this.dataStore[4] && this.send(this.dataStore[4]);
  }
  queuewaitSequence(number, cancelToken) {
    if (this.dataStore.indexOf(cancelToken) <= number - 1) {
      return true;
    }
    return false;
  }
  send(config) {
    this.enqueue(config);
    // return Promise(async function(resolve, reject) {
    if (this.queuewaitSequence(5, config)) {
      axios(config);
      //resolve();
    }
    //   else {
    //     reject();
    //   }
    //});
  }
}
const requestPool = new RequestPool();
axios.interceptors.response.use((response) => {
  requestPool.dequeue();
  return response.data;
}, err);
module.exports.rpool = requestPool;
