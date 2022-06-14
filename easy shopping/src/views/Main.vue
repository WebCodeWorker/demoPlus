<template>
  <div class="main">
    <div>
      <!-- 二级路由 -->
      <keep-alive include="Home,Menu">
        <router-view></router-view>
      </keep-alive>
    </div>

    <van-tabbar v-model="tabbarIndex" active-color="#e02e24" route>
      <van-tabbar-item v-for="(item, index) in tabbarData" :key="index" :to="item.url">
        <span>{{item.title}}</span>
        <template #icon="props">
          <img :src="props.active ? item.icon.active : item.icon.inactive" />
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tabbarIndex: 0,
      tabbarData: [
        {
          title: "首页",
          icon: {
            active: require("../assets/images/home_active.png"),
            inactive: require("../assets/images/home.png"),
          },
          url: {
            name: "Home",
          },
        },
        {
          title: "分类",
          icon: {
            active: require("../assets/images/menu_active.png"),
            inactive: require("../assets/images/menu.png"),
          },
          url: {
            name: "Menu",
          },
        },

        {
          title: "购物车",
          icon: {
            active: require("../assets/images/concern_active.png"),
            inactive: require("../assets/images/concern.png"),
          },
          url: {
            name: "Shopbag",
          },
        },

        {
          title: "个人中心",
          icon: {
            active: require("../assets/images/my_active.png"),
            inactive: require("../assets/images/my.png"),
          },
          url: {
            name: "My",
          },
        },
      ],
    };
  },
};
</script>

<style lang="less" scoped>
.main {
  padding-bottom: 50px;
  box-sizing: border-box;
  height: 100%;
  background: #f7f7f7;
  .van-tabbar-item__icon img {
    height: 24px;
  }

  .van-tabbar-item__text {
    span {
      font-size: 14px;
    }
  }
}
</style>