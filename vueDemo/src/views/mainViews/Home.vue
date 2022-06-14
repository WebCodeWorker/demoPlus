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
      <van-swipe-item>1</van-swipe-item>
      <van-swipe-item>2</van-swipe-item>
      <van-swipe-item>3</van-swipe-item>
      <van-swipe-item>4</van-swipe-item>
    </van-swipe>
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
          :title="item[0].type"
          :key="index"
        >
          <div
            class="fl tab-item"
            v-for="(v, i) in item"
            :key="i"
            @click="goDetail()"
          >
            <img
              class="auto-img"
              @load="goodsListItemImg"
              v-lazy="v.goods_image_url"
            />
            <div class="title">{{ v.goods_name }}</div>
            <div class="fl price">
              <span class="money">￥</span>
              {{ v.min_group_price }}
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
      hotData: [
        [
          {
            type: "华为",
            goods_name: "手机",
            goods_image_url: require("../../assets/images/shop.jpeg"),
            min_group_price: "999",
            sales_tip: "88",
          },
          {
            goods_name: "手机手机手机手机手机",
            goods_image_url: require("../../assets/images/shop.jpeg"),
            min_group_price: "999",
            sales_tip: "88",
          },
          {
            goods_name: "手机",
            goods_image_url: require("../../assets/images/shop.jpeg"),
            min_group_price: "999",
            sales_tip: "88",
          },
          {
            goods_name: "手机",
            goods_image_url: require("../../assets/images/shop.jpeg"),
            min_group_price: "999",
            sales_tip: "88",
          },
          {
            goods_name: "手机",
            goods_image_url: require("../../assets/images/shop.jpeg"),
            min_group_price: "999",
            sales_tip: "88",
          },
          {
            goods_name: "手机",
            goods_image_url: require("../../assets/images/shop.jpeg"),
            min_group_price: "999",
            sales_tip: "88",
          },
        ],
        [
          {
            type: "小米",
            goods_name: "手机",
            goods_image_url: require("../../assets/images/shop.jpeg"),
            min_group_price: "999",
            sales_tip: "88",
          },
          {
            goods_name: "手机",
            goods_image_url: require("../../assets/images/shop.jpeg"),
            min_group_price: "999",
            sales_tip: "88",
          },
          {
            goods_name: "手机",
            goods_image_url: require("../../assets/images/shop.jpeg"),
            min_group_price: "999",
            sales_tip: "88",
          },
          {
            goods_name: "手机",
            goods_image_url: require("../../assets/images/shop.jpeg"),
            min_group_price: "999",
            sales_tip: "88",
          },
          {
            goods_name: "手机",
            goods_image_url: require("../../assets/images/shop.jpeg"),
            min_group_price: "999",
            sales_tip: "88",
          },
          {
            goods_name: "手机",
            goods_image_url: require("../../assets/images/shop.jpeg"),
            min_group_price: "999",
            sales_tip: "88",
          },
        ],
        [
          {
            type: "iPhone",
            goods_name: "手机",
            goods_image_url: require("../../assets/images/shop.jpeg"),
            min_group_price: "999",
            sales_tip: "88",
          },
          {
            goods_name: "手机",
            goods_image_url: require("../../assets/images/shop.jpeg"),
            min_group_price: "999",
            sales_tip: "88",
          },
          {
            goods_name: "手机",
            goods_image_url: require("../../assets/images/shop.jpeg"),
            min_group_price: "999",
            sales_tip: "88",
          },
          {
            goods_name: "手机",
            goods_image_url: require("../../assets/images/shop.jpeg"),
            min_group_price: "999",
            sales_tip: "88",
          },
          {
            goods_name: "手机",
            goods_image_url: require("../../assets/images/shop.jpeg"),
            min_group_price: "999",
            sales_tip: "88",
          },
          {
            goods_name: "手机",
            goods_image_url: require("../../assets/images/shop.jpeg"),
            min_group_price: "999",
            sales_tip: "88",
          },
        ],
        [
          {
            type: "vivo",
            goods_name: "手机",
            goods_image_url: require("../../assets/images/shop.jpeg"),
            min_group_price: "999",
            sales_tip: "88",
          },
          {
            goods_name: "手机",
            goods_image_url: require("../../assets/images/shop.jpeg"),
            min_group_price: "999",
            sales_tip: "88",
          },
          {
            goods_name: "手机",
            goods_image_url: require("../../assets/images/shop.jpeg"),
            min_group_price: "999",
            sales_tip: "88",
          },
          {
            goods_name: "手机",
            goods_image_url: require("../../assets/images/shop.jpeg"),
            min_group_price: "999",
            sales_tip: "88",
          },
          {
            goods_name: "手机",
            goods_image_url: require("../../assets/images/shop.jpeg"),
            min_group_price: "999",
            sales_tip: "88",
          },
          {
            goods_name: "手机",
            goods_image_url: require("../../assets/images/shop.jpeg"),
            min_group_price: "999",
            sales_tip: "88",
          },
        ],
        [
          {
            type: "摩托罗拉",
            goods_name: "手机",
            goods_image_url: require("../../assets/images/shop.jpeg"),
            min_group_price: "999",
            sales_tip: "88",
          },
          {
            goods_name: "手机",
            goods_image_url: require("../../assets/images/shop.jpeg"),
            min_group_price: "999",
            sales_tip: "88",
          },
          {
            goods_name: "手机",
            goods_image_url: require("../../assets/images/shop.jpeg"),
            min_group_price: "999",
            sales_tip: "88",
          },
          {
            goods_name: "手机",
            goods_image_url: require("../../assets/images/shop.jpeg"),
            min_group_price: "999",
            sales_tip: "88",
          },
          {
            goods_name: "手机",
            goods_image_url: require("../../assets/images/shop.jpeg"),
            min_group_price: "999",
            sales_tip: "88",
          },
          {
            goods_name: "手机",
            goods_image_url: require("../../assets/images/shop.jpeg"),
            min_group_price: "999",
            sales_tip: "88",
          },
        ],
        [
          {
            type: "锤子",
            goods_name: "手机",
            goods_image_url: require("../../assets/images/shop.jpeg"),
            min_group_price: "999",
            sales_tip: "88",
          },
          {
            goods_name: "手机",
            goods_image_url: require("../../assets/images/shop.jpeg"),
            min_group_price: "999",
            sales_tip: "88",
          },
          {
            goods_name: "手机",
            goods_image_url: require("../../assets/images/shop.jpeg"),
            min_group_price: "999",
            sales_tip: "88",
          },
          {
            goods_name: "手机",
            goods_image_url: require("../../assets/images/shop.jpeg"),
            min_group_price: "999",
            sales_tip: "88",
          },
          {
            goods_name: "手机",
            goods_image_url: require("../../assets/images/shop.jpeg"),
            min_group_price: "999",
            sales_tip: "88",
          },
          {
            goods_name: "手机",
            goods_image_url: require("../../assets/images/shop.jpeg"),
            min_group_price: "999",
            sales_tip: "88",
          },
        ],
        [
          {
            type: "山寨机就是牛",
            goods_name: "手机",
            goods_image_url: require("../../assets/images/shop.jpeg"),
            min_group_price: "999",
            sales_tip: "88",
          },
          {
            goods_name: "手机",
            goods_image_url: require("../../assets/images/shop.jpeg"),
            min_group_price: "999",
            sales_tip: "88",
          },
          {
            goods_name: "手机",
            goods_image_url: require("../../assets/images/shop.jpeg"),
            min_group_price: "999",
            sales_tip: "88",
          },
          {
            goods_name: "手机",
            goods_image_url: require("../../assets/images/shop.jpeg"),
            min_group_price: "999",
            sales_tip: "88",
          },
          {
            goods_name: "手机",
            goods_image_url: require("../../assets/images/shop.jpeg"),
            min_group_price: "999",
            sales_tip: "88",
          },
          {
            goods_name: "手机",
            goods_image_url: require("../../assets/images/shop.jpeg"),
            min_group_price: "999",
            sales_tip: "88",
          },
        ],
      ],
      hotType: [],
      loading: true,
    };
  },
  created() {
    this.getHot();
  },

  methods: {
    goodsListItemImg() {
      this.loading = false;
    },
    search() {
      this.$router.push({ name: "Search" });
    },

    goDetail(v) {
      // this.$router.push({ name: "Detail", query: { goods: v.goods_id } });
    },
    getHot() {
      //  如果存在缓存数据,则在缓存获取商品数据,不发起请求
      // let data = sessionStorage.getItem("hotData");
      // if (data) {
      //   this.hotData = JSON.parse(data);
      //   return;
      // }
      // this.$toast.loading({
      //   message: "加载中...",
      //   forbidClick: true,
      //   duration: 0,
      //   loadingType: "spinner",
      // });
      // this.axios({
      //   method: "GET", //请求的方式  get/post
      //   url: "/2260-16",
      //   params: {
      //     showapi_appid: this.showapi_appid,
      //     showapi_sign: this.secret,
      //     page_num: 1,
      //     page_size:20
      //   },
      // })
      //   .then((response) => {
      //     this.$toast.clear();
      //   let data = JSON.parse(response.data.showapi_res_body.ret_body);
      // console.log(data)
      //   //商品分类
      //   data.list.map((v) => {
      //     if (!this.hotData[v.opt_name]) {
      //       this.hotData[v.opt_name] = [v];
      //     } else {
      //       this.hotData[v.opt_name].push(v);
      //     }
      //     v.min_group_price = (v.min_group_price / 100).toFixed(2);
      //   });
      //   sessionStorage.setItem("hotData", JSON.stringify(this.hotData));
      //   this.$forceUpdate();
      // })
      // .catch((err) => {
      //   this.$toast.clear();
      // });
    },
  },
};
</script>

<style lang="less" scoped>
.menu-search{
  z-index: 1;
  height: 80px;
}
.box{
  height: 59px;
}
 .my-swipe .van-swipe-item {
    color: #fff;
    font-size: 20px;
    line-height: 150px;
    text-align: center;
    background-color: #39a9ed;
  }
</style>