<template>
  <div id="app">
    <!-- 一级路由 -->
    <router-view />

  </div>
</template>
<script>
import vueWaterfallEasy from 'vue-waterfall-easy'
export default {
  name: 'app',
  components: {
    vueWaterfallEasy
  }
}
</script>
<style lang="less">
html,body{
  height: 100%;
  margin: 0;
  padding: 0;
  background: #f7f7f7;
}
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    height: 100%;
  }

  .fl{
    float: left;
  }

  .fr{
    float: right;
  }

  .clearfix::after{
    content: "";
    display: block;
    clear: both;
    height: 0;
  }

  .auto-img{
    width: 100%;
    display: block;
    background-repeat: no-repeat;
    background-size: cover;
  }

</style>
