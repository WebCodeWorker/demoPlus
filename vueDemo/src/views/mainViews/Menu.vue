<template>
  <div class="menu">
    <div class="title">分类</div>
    <div class="search-box">
      <van-search
        input-align="center"
        placeholder="请输入商品名称"
        fixded
        shape="round"
        @click="search"
      ></van-search>
    </div>
    <div class="banner">
      <!-- <div class="line"></div> -->
      <div class="fl sidebar" ref="wrapper">
        <div class="content">
          <div
            class="slidebar-box"
            v-for="(item, index) in categoryData"
            :key="index"
            @click="toggleType(item,index)"
            ref="list"
          >
            <div class="listName" ref="name">{{item.opt_name}}</div>
          </div>
        </div>
      </div>
      <div class="fl product">
        <div class="product-box clearfix">
          <div
            class="product-list"
            v-for="(item, index) in product"
            :key="index"
            @click="goMeunDetail(item,index)" 
          >
            <img
              class="auto-img"
              src="https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3359547924,3570410755&fm=26&gp=0.jpg"
              alt
            />
            <div class="name">{{item.opt_name}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../../assets/less/menu.less";
import BScroll from "better-scroll";
export default {
  data() {
    return {
      categoryData: [{opt_name:"纸巾"},{opt_name:"纸巾"},{opt_name:"纸巾"},{opt_name:"纸巾"},{opt_name:"纸巾"},{opt_name:"纸巾"},{opt_name:"纸巾"},],
      product: [{opt_name:"纸巾"},{opt_name:"纸巾"},{opt_name:"纸巾"},{opt_name:"纸巾"},{opt_name:"纸巾"},{opt_name:"纸巾"},{opt_name:"纸巾"}],
      isActive: false,
    };
  },

  created() {
    //获取顶级类目列表
    // this.getDatafenlei(0);
  //   this.axios({
  //     method: "GET", //请求的方式  get/post
  //     url: "/2260-13",
  //     params: {
  //       showapi_appid: this.showapi_appid,
  //       showapi_sign: this.secret,
  //       opt_id: 1,
  //     },
  //   })
  //     .then((response) => {
  //       let data = JSON.parse(response.data.showapi_res_body.ret_body);
  //       this.product = data;
  //     })
  //     .catch((err) => {});
  },

  updated() {
    // if (this.categoryData.length > 0) {
    //   this.$nextTick(() => {
    //     this.scroll = new BScroll(this.$refs.wrapper, {
    //       click: true,
    //     });
    //   });
    // }
  },
  methods: {
    search() {
      this.$router.push({ name: "Search" });
    },

    // 切换商品类型
    toggleType(item, index) {
      for (let i = 0; i < this.$refs.list.length; i++) {
        this.$refs.list[i].style.background = "#f8f8f8";
        this.$refs.list[i].style.color = "#222";
        this.$refs.name[i].style.borderLeft = "none";
      }
      this.$refs.list[index].style.background = "#fff";
      this.$refs.list[index].style.color = "#e02e24";
      this.$refs.name[index].style.borderLeft = "3px solid #e02e24";

      // this.product = [];

      //根据商品类型获取商品数据
      // this.axios({
      //   method: "GET",
      //   url: "/2260-13",
      //   params: {
      //     showapi_appid: this.showapi_appid,
      //     showapi_sign: this.secret,
      //     opt_id: item.opt_id,
      //   },
      // })
      //   .then((response) => {
      //     let data = JSON.parse(response.data.showapi_res_body.ret_body);
      //     this.product = data;
      //   })
      //   .catch((err) => {});
    },

    // goMeunDetail(item, index) {
    //   let str = JSON.stringify(item.opt_name);
    //   this.$router.push({ name: "Search", query: { str } });
    // },

    //获取分类商品
    // getDatafenlei(value) {
    //   this.axios({
    //     method: "GET",
    //     url: "/2260-13",
    //     params: {
    //       showapi_appid: this.showapi_appid,
    //       showapi_sign: this.secret,
    //       opt_id: value,
    //     },
    //   })
    //     .then((response) => {
    //       let data = JSON.parse(response.data.showapi_res_body.ret_body);

    //       data.map((v) => {
    //         if (
    //           v.opt_name.length == 2 &&
    //           this.categoryData.indexOf(v.opt_name) === -1
    //         ) {
    //           this.categoryData.push(v);
    //         }
    //       });
    //     })
    //     .catch((err) => {});
    // },
  },
};
</script>

<style lang="less" scoped>
</style>