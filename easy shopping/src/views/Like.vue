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
          <div class="p-img" @click="viewProductInfo(item.productData.id)">
            <img class="auto-img" :src="handleUrl(item.productData.goods_image_url)" alt />
          </div>
          <div class="van-ellipsis pro-name one-text ">{{item.productData.goods_name}}</div>
          <div class="clearfix">
            <div class="pro-price fl">￥{{item.productData.price}}</div>
            <div class="pro-remove fr" @click="removeLike(item.productData.id, index)">
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
    };
  },

  created() {
    this.likeData = JSON.parse(localStorage.getItem("collection"));
  },

  methods: {
    handleUrl(url) {
      return require("@/static/" + url);
    },
    goMenu() {
      return this.$router.push({name: 'Menu'});
    },
    back() {
      this.$router.go(-1);
    },

    //查看商品详情
    viewProductInfo(id) {
      this.$router.push({ name: "Detail", query: {  goods_id: id } });
    },

    //删除收藏商品数据
    removeLike(id, index) {
      let data = JSON.parse(localStorage.getItem("collection"));
      data.forEach((element,i) => {
        if(element.productData.id == id){
          data.splice(i,1);
        }
      });
      localStorage.setItem("collection",JSON.stringify(data))
      
      this.likeData.splice(index, 1);
      this.$toast('删除收藏商品成功');
    }
  }
};
</script>

<style lang="less" scoped>
</style>