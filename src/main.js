import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "./common.css";
import "./global.css";
const loadash = require("lodash");
//Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.prototype._ = loadash;

const vue = new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");

export default vue;
