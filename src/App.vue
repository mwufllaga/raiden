<template>
  <div class="horizontalFlexWrapper" style="height:100%;width:100%">
    <transition :name="transitionName">
      <router-view></router-view>
    </transition>
  </div>
</template>
<script>
export default {
  data() {
    return {
      transitionName: "",
    };
  },
  watch: {
    $route: function(to, from) {
      this.transitionName =
        (to.params && to.params.transition) || to.meta.transition || "";
    },
  },
  mounted() {
    window.onerror = undefined;
  },
};
</script>
