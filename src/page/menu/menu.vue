<template>
  <div class="horizontalFlexWrapper agileFlex" style="overflow:hidden">
    <div style="width:200px;height:100%">
      <el-menu style="height:100%" ref="menu">
        <template v-for="item in menu">
          <el-menu-item
            :key="item.label"
            @click="menuClick(item)"
            :class="{
              selected: activeName === item.label,
            }"
            v-if="!item.children"
          >
            <i class="el-icon-menu"></i>
            <span slot="title">{{ item.label }}</span>
          </el-menu-item>
          <el-submenu v-else :index="item.label" :key="item.label">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{ item.label }}</span>
            </template>
            <el-menu-item
              v-for="subitem of item.children"
              :key="subitem.label"
              :class="{
                selected: activeName === subitem.label,
              }"
              @click="menuClick(subitem)"
              >{{ subitem.label }}</el-menu-item
            >
          </el-submenu>
        </template>
      </el-menu>
    </div>
    <div class="agileFlex verticalFlexWrapper" style="overflow:auto">
      <div>
        <div style="float:right">
          <el-dropdown>
            <span class="el-dropdown-link">
              UserName<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>logout</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div style="">
          <el-tabs
            v-model="activeName"
            type="card"
            @tab-click="tabClick"
            closable
            @edit="tabClose"
            style="padding-left:10px
            "
          >
            <el-tab-pane
              v-for="item in tabs"
              :key="item.name"
              :label="item.label"
              :name="item.name"
            ></el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <div class="agileFlex verticalFlexWrapper" style="overflow:auto">
        <keep-alive>
          <component :is="view" ref="comp" :params="params"></component>
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script>
import { menu } from "../../menu.js";
import uuidjs from "uuidjs";
import getFile from "./getFile.js";
export default {
  data: function() {
    return {
      //TODO set initial page
      tabs: [],
      menu: menu,
      activeName: "test",
      view: null,
      defaultPage: "",
      pageMap: {},
      params: {},
    };
  },
  computed: {},
  created: function() {},
  watch: {},
  methods: {
    tabClose(tab) {
      //销毁已缓存实例,必须在对应实例中添加destorySelf方法
      for (let index in this.tabs) {
        index = Number(index);
        if (this.tabs[index].name === tab) {
          this.activeName = this.tabs[index + 1]
            ? this.tabs[index + 1].name
            : this.tabs[index - 1]
            ? this.tabs[index - 1].name
            : "";
          if (this.activeName) {
            this.view = this.pageMap[this.activeName];
          } else {
            //TODO change into default page
            this.view = null;
          }
          this.tabs.splice(index, 1);
          break;
        }
      }
      this.pageMap[tab] = void 0;
      this.$refs["comp"].destroySelf();
    },
    async addPage(page, { label, params }) {
      let currentView = await getFile(page);
      this.params = params;
      this.view = this._.cloneDeep(eval(currentView.data).default);
      const uuid = uuidjs.generate();
      this.pageMap[page + uuid] = this.view;
      this.tabs.push({ name: page + uuid, label });
      this.activeName = page + uuid;
    },
    menuClick: async function(menu) {
      if (typeof menu === "string") {
        menu = { name: menu, url: menu };
      }
      if (!this.pageMap[menu.url]) {
        let currentView = await getFile(menu.url);
        this.view = eval(currentView.data).default;
        this.pageMap[menu.url] = this.view;
        this.tabs.push({ name: menu.url, label: menu.label });
      } else {
        this.activeName = menu.url;
        this.view = this.pageMap[menu.url];
      }
      this.activeName = menu.url;
    },

    tabClick() {
      // if (this.activeName.indexOf("Sdk") !== -1) {
      //   this.$refs.menu.open("sdk");
      // }
      let currentView = this.pageMap[this.activeName];
      this.view = currentView;
    },
  },
};
</script>
<style>
.selected {
  background-color: #ecf5ff;
}
</style>
