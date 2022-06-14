<template>
  <div class="comment">
    <van-nav-bar
      title="商品评论"
      left-arrow
      fixed
      ref="navs"
      @click-left="back"
    >
    </van-nav-bar>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
    <div class="sort">评论排序 <van-icon :name="nameValue" @click="changeSort"/></div>
      <div class="evaluation" v-for="(item, index) in commentData" :key="index">
        <div class="comment-header">
          <img class="header_url fl" :src="item.header_url" />
          <div class="comment-userName fl">
            <div class="userName">{{ item.user_name }}</div>
            <van-rate
              v-model="item.score"
              allow-half
              readonly
              void-color="#eee"
              void-icon="star"
              :size="12"
            />
          </div>
          <div class="comment-time fr">{{ item.creat_time.split("T")[0] }}</div>
        </div>
        <div class="comment-content">
          <div>{{ !item.comment ? "该用户未填写任何评价" : item.comment }}</div>
          <div class="goods_picture">
            <img
              v-for="(v, i) in item.comment_pic.split(',')"
              :key="i"
              :src="handleUrl(v)"
              v-show="item.comment_pic != ''"
            />
          </div>
        </div>
      </div>
    </van-pull-refresh>
  </div>
</template>
<script>
export default {
  data() {
    return {
      commentData: [],
      isLoading: false,
      sort: "DESC",
      nameValue:"descending"
    };
  },
  created() {
    this.getProductById();
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    handleUrl(url) {
      // console.log(require("../../server/public/images/" + url))
      return !url ? "/" : "http://119.23.140.110:3000/img/comment_pic/" + url;
    },
    changeSort(){
        if(this.nameValue == "descending"){
            this.nameValue = "ascending"
            this.sort = "ASC"
        }else{
            this.nameValue = "descending"
            this.sort = "DESC"
        }
        this.getProductById();
    },
    async onRefresh() {
      await this.getProductById();
      setTimeout(() => {
        // this.$toast("刷新成功");
        this.isLoading = false;
      }, 1000);
    },
    //根据商品id获取商品评论
    getProductById() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });
      this.axios({
        method: "GET",
        url: "/users/queryGoodsComment",
        params: {
          goods_id: this.$route.query.goods_id,
          sort: this.sort
        },
      })
        .then((response) => {
          this.commentData = response.data.result;
           

          this.$toast.clear();
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },
  },
};
</script>
<style lang="less" scoped>
/deep/.van-pull-refresh__head {
  margin-top: 25px;
  background: #fff;
  z-index: -1;
}
.sort{
    margin-top: 10px;
    margin-bottom: 20px;
    padding: 10px;
    height: 20px;
    background: #fff;
    position: relative;
    top: 20px;
    border-bottom: 2px solid #ebedf0;
    font-size: 14px;
}
.van-icon{
    left: 276px;
    font-size: 20px;
}
.comment {
  padding-top: 12px;
  /deep/.van-nav-bar .van-icon {
    color: rgb(224, 46, 36);
  }
}
.evaluation {
  background: #fff;
  padding: 10px;
  border-radius: 15px;
  margin: 10px 0;
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
    height: 40px;
    .header_url {
      width: 35px;
      height: 35px;
      border-radius: 50%;
      margin-right: 10px;
    }
  }
  .comment-content {
    font-size: 14px;
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
  .comment-time {
    color: #999;
  }
}
</style>
