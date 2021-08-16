<template>
  <div class="like">
    <van-nav-bar :placeholder="true" title="我的收藏" left-arrow :fixed="true" @click-left="back" />
    <div class="like-bg"></div>
    <div class="like-box">
      <div class="product-box clearfix" v-if="likeData.length > 0">
        <div
          class="product-item fl"
          :class="[index % 2 == 0 ? 'p-left' : 'p-right']"
          v-for="(item, index) in likeData"
          :key="index"
        >
          <div class="p-img" @click="viewProductInfo(item.pid)">
            <img class="auto-img" :src="item.goods_pic" alt />
          </div>
          <div class="van-ellipsis pro-name one-text ">{{item.goods_name}}</div>
          <div class="clearfix">
            <div class="pro-price fl">￥{{item.min_group_price}}</div>
            <div class="pro-remove fr" @click="removeLike(item.pid, index)">
              <van-icon name="delete" />
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <van-empty description="收藏商品空空如也，去逛一逛!">
          <van-button round color="linear-gradient(to right, rgb(224 71 36 / 58%) , #e02e24)" class="bottom-button" @click="goMenu">
            去逛一逛
          </van-button>
        </van-empty>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/less/like.less";

import {utils} from '../assets/js/utils'

export default {
  data() {
    return {
      //我的收藏商品数据
      likeData: [],
      goods_ids: []
    };
  },

  created() {
    this.getAllLikeData();
  },

  methods: {
    goMenu() {
      return this.$router.push({name: 'Menu'});
    },
    back() {
      this.$router.go(-1);
    },

    //获取我的收藏商品数据
    getAllLikeData() {
      this.goods_ids = JSON.parse(localStorage.getItem("collection"))

      let str = "";
     
      this.goods_ids.map((v) => {
        str += v + ",";
      });
      
      this.$toast.loading({

        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });

      this.axios({
        method: "GET",
          url: "/2260-9",
          params: {
          showapi_appid: this.showapi_appid,
          showapi_sign: this.secret,
          goods_ids: str,
        },
      })
        .then((result) => {
          this.$toast.clear();
          
          let data = JSON.parse(result.data.showapi_res_body.ret_body);
          // 修改数据
          data.map((v) => {
            v.min_group_price = v.min_group_price / 100;
          });
          
          this.likeData = data;
        })
        .catch((err) => {
          this.$toast.clear();
           
        });
    },

    //查看商品详情
    viewProductInfo(pid) {
      this.$router.push({ name: "Detail", query: { pid } });
    },

    //删除收藏商品数据
    removeLike(pid, index) {
      this.goods_ids.splice(index,1)
      localStorage.setItem("collection",JSON.stringify(this.goods_ids))
      
      this.likeData.splice(index, 1);
      this.$toast('删除收藏商品成功');
    }
  }
};
</script>

<style lang="less" scoped>
</style>