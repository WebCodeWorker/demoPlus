<template>
  <div class="home">
    <div class="menu-search">
      <van-search
        input-align="center"
        placeholder="请输入商品名称"
        fixded
        shape="round"
        show-action
        @focus="search"
      >
        <template #action>
          <div @click="search">搜索</div>
        </template>
      </van-search>
    </div>
    <div class="box"></div>
    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item
        ><img class="rotation" src="@/static/advertisement.jpeg"
      /></van-swipe-item>
      <van-swipe-item
        ><img class="rotation" src="@/static/advertisement.jpeg"
      /></van-swipe-item>
      <van-swipe-item
        ><img class="rotation" src="@/static/advertisement.jpeg"
      /></van-swipe-item>
      <van-swipe-item
        ><img class="rotation" src="@/static/advertisement.jpeg"
      /></van-swipe-item>
    </van-swipe>
    <div class="tips">
      <van-icon name="fire-o" />
      <span class="txt">热门推荐</span>
    </div>
    <div class="banner">
      <van-tabs
        v-model="active"
        :swipeable="true"
        :animated="true"
        color="#ee0a24"
        title-active-color="#ee0a24"
        :sticky="false"
      >
        <van-tab
          v-for="(item, index) in hotData"
          :title="item.type"
          :key="index"
        >
          <div
            class="fl tab-item"
            v-for="(v, i) in item.info"
            :key="i"
            @click="goDetail(v)"
          >
            <img
              class="auto-img"
              @load="goodsListItemImg"
              v-lazy="handleUrl(v.goods_image_url)"
            />

            <div class="title">{{ v.goods_name }}</div>
            <div class="fl price">
              <span class="money">￥</span>
              {{ v.price }}
            </div>
            <div class="fl saled" ref="kong">{{ v.sales_tip }}人付款</div>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import "../../assets/less/home.less";

export default {
  data() {
    return {
      active: 0,
      hotData: [],
      hotType: [],
      loading: true,
    };
  },
  created() {
    this.getHot();
  },

  methods: {
    handleUrl(url) {
      return require("@/static/" + url);
    },
    goodsListItemImg() {
      this.loading = false;
    },
    search() {
      this.$router.push({ name: "Search" });
    },
    goDetail(v) {
      this.$router.push({ name: "Detail", query: { goods_id: v.id } });
    },
    getHot() {
      //  如果存在缓存数据,则在缓存获取商品数据,不发起请求
      let data = sessionStorage.getItem("hotData");
      if (data) {
        this.hotData = JSON.parse(data);
        return;
      }
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });
      this.axios({
        method: "GET", //请求的方式  get/post
        url: "/hotData",
      })
        .then((response) => {
          this.$toast.clear();
          this.hotData = response.data.result;
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },
  },
};
</script>

<style lang="less" scoped>
.rotation {
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
}
.menu-search {
  z-index: 999;
  height: 80px;
}
.box {
  height: 20px;
}
.my-swipe .van-swipe-item {
  color: #fff;
  font-size: 20px;
  // line-height: 114px;
  text-align: center;
}
</style>
