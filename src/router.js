import Vue from "vue";
import Router from "vue-router";
import menu from "@/page/menu/menu.vue";

// 异步加载模块
Vue.use(Router);
const router = new Router({
  mode: "history",
  routes: [
    {
      path: `/`,
      redirect: `/index`,
    },
    {
      path: `/index`,
      component: menu,
    },
  ],
});
export default router;
