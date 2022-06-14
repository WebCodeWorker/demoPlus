<template>
  <div class="comment">
    <van-nav-bar left-arrow fixed ref="navs" @click-left="back"> </van-nav-bar>
    <div class="evaluation">
      <div class="comment fl">
        <span class="comment-title">评价</span>
        <span class="comment-count">(666)</span>
      </div>
      <div class="viewAll fr" @click="goComment">
        查看全部 <van-icon name="arrow" />
      </div>
      <div class="comment-header">
        <img
          class="header_url fl"
          src="http://www.kangliuyong.com:10002/assets/coffeeshop72480349869519411653141967573.jpeg"
          alt=""
        />
        <div class="comment-userName">
          <div class="userName">元始天尊</div>
          <van-rate
            v-model="commentValue"
            allow-half
            void-color="#eee"
            void-icon="star"
            :size="12"
          />
        </div>
        <div class="comment-time fr">2022-5-26</div>
        <div class="comment-content">
          <span>
            rnm,退钱，买的什么垃圾货啊，rnm,退钱，买的什么垃圾货啊rnm,退钱，买的什么垃圾货啊rnm,退钱，买的什么垃圾货啊rnm,退钱，买的什么垃圾货啊rnm,退钱，买的什么垃圾货啊
          </span>
          <div class="goods_picture">
            <img
              src="http://www.kangliuyong.com:10002/assets/coffeeshop72480349869519411653141967573.jpeg"
              alt=""
            />
            <img
              src="http://www.kangliuyong.com:10002/assets/coffeeshop72480349869519411653141967573.jpeg"
              alt=""
            />
            <img
              src="http://www.kangliuyong.com:10002/assets/coffeeshop72480349869519411653141967573.jpeg"
              alt=""
            />
            <img
              src="http://www.kangliuyong.com:10002/assets/coffeeshop72480349869519411653141967573.jpeg"
              alt=""
            />
            <img
              src="http://www.kangliuyong.com:10002/assets/coffeeshop72480349869519411653141967573.jpeg"
              alt=""
            />
            <img
              src="http://www.kangliuyong.com:10002/assets/coffeeshop72480349869519411653141967573.jpeg"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
        commentValue: 3,
    };
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
  },
};
</script>
<style lang="less">
.van-nav-bar .van-icon {
  color: rgb(224, 46, 36);
}
.evaluation {
  background: #fff;
  margin: 10px 0;
  padding: 10px;
  .comment-title {
    font-size: 15px;
  }
  .comment-count {
    color: #999;
    font-size: 12px;
  }
  .viewAll {
    color: #999;
  }
  .comment-header {
    margin-top: 30px;
    .header_url {
      width: 35px;
      height: 35px;
      border-radius: 50%;
      margin-right: 10px;
    }
  }
  .comment-content {
    span {
      display: inline-block;
      margin-top: 10px;
    }
    .goods_picture {
      margin: 10px 0;
    }
    img {
      width: 112px;
      height: 112px;
      margin: 3px;
      border-radius: 5px;
    }
  }
}
</style>
