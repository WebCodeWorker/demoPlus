<template>
  <div class="writeComment">
    <van-nav-bar
      title="写评论"
      right-text="提交"
      left-arrow
      @click-left="onClickLeft"
      @click-right="submit"
    />
    <div class="title">
      商品评价
      <van-rate
        v-model="scoretValue"
        allow-half
        void-color="#eee"
        void-icon="star"
        :size="19"
      />
      <span>{{ txtArr[Math.ceil(scoretValue - 1)] }}</span>
    </div>
    <textarea
      maxlength="500"
      cols="54"
      rows="8"
      spellcheck="true"
      placeholder="请在此处写下你的评价"
      v-model="commentvalue"
    ></textarea>
    <div class="pic">
      <div class="uploader-box" v-show="fileList.length == 0">
        <van-uploader
          v-model="fileList"
          :before-read="beforeRead"
          multiple="true"
        />
        <div class="description">添加图片</div>
      </div>
      <van-uploader
        class="content"
        v-model="fileList"
        :before-read="beforeRead"
        v-show="fileList.length > 0"
        multiple="true"
        :max-count="6"
      />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      scoretValue: 0,
      txtArr: ["非常差", "差", "一般", "好", "非常好"],
      fileList: [],
      //评论图片
      form: new FormData(),
      commentvalue: "",
      user_name: "",
      user_img: "",
      comment_url: "",
    };
  },
  created() {
    let tokenString = localStorage.getItem("CSTK");
    this.$toast.loading({
      message: "加载中...",
      forbidClick: true,
      duration: 0,
      loadingType: "spinner",
    });
    this.axios({
      method: "get",
      url: "http://www.kangliuyong.com:10002/findMy",
      params: {
        appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
        tokenString,
      },
    })
      .then((result) => {
        this.$toast.clear();

        if (result.data.code == "A001") {
          if (result.data.result.length > 0) {
            this.user_name = result.data.result[0].nickName;
            this.user_img = result.data.result[0].userImg;
          }
        }
      })
      .catch((err) => {
        this.$toast.clear();
      });
  },
  methods: {
    onClickLeft() {
      this.$router.push({ name: "Order", query: { isComment: false } });
    },
    submit() {
      if (!this.scoretValue) {
        this.$notify({
          message: "请给商品评分",
          color: "#fff",
        });
        return;
      }
      this.axios({
        method: "POST",
        url: "/users/writeComment",
        data: this.form,
        params: {
          order_id: this.$route.query.order_id,
          goods_id: this.$route.query.goods_id,
          user_name: this.user_name,
          header_url: this.user_img,
          comment: this.commentvalue,
          score: this.scoretValue,
        },
      });
      this.$router.push({ name: "Order", query: { isComment: true } });
    },
    beforeRead(file) {
      if (file instanceof Array) {
        //批量选择图片
        if (file.length > 6) {
          this.$notify({
            message: "图片最多上传6张",
            color: "#fff",
          });
          return;
        }
        for (let i = 0; i < file.length; i++) {
          let type = file[i].type.split("/")[1];
          let imgTypes = ["gif", "jpg", "jpeg", "png"];
          if (imgTypes.indexOf(type) === -1) {
            this.$notify({
              message: "图片类型只支持" + imgTypes.join(","),
              color: "#fff",
            });
            return false;
          }
          this.comment_url += file[i].name + ",";
        }
        file.forEach((v) => {
          this.form.append("avatar", v);
        });
      } else {
        //选择单个图片
        let type = file.type.split("/")[1];
        let imgTypes = ["gif", "jpg", "jpeg", "png"];
        if (imgTypes.indexOf(type) === -1) {
          this.$notify({
            message: "图片类型只支持" + imgTypes.join(","),
            color: "#fff",
          });
          return false;
        }
        this.comment_url += file.name + ",";
        this.form.append("avatar", file);
      }
      return true;
    },
  },
};
</script>
<style lang="less" scoped>
/deep/.van-nav-bar .van-icon,
/deep/.van-nav-bar__text {
  color: rgb(224, 46, 36);
}
.title {
  padding: 15px;
  font-size: 14px;
  background: #fff;
  margin-bottom: 2px;
  span {
    color: #999;
  }
  .van-rate {
    padding: 0 15px;
  }
}
textarea {
  width: 99%;
  outline: none;
  border: 0;
}
.pic {
  height: 200px;
  background: #fff;
  position: relative;
  .content {
    position: absolute;
    top: 20px;
    left: 10px;
  }
}
.uploader-box {
  position: absolute;
  top: 15px;
  left: calc(~"50% - 40px");
  .description {
    margin-left: 15px;
    color: #999;
  }
}
</style>
