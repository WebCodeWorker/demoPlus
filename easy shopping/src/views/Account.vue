<template>
  <div class="account">
    <van-nav-bar title="个人资料" left-arrow :fixed="true" @click-left="back" />
    <div class="account-bg"></div>
    <div class="account-info">
      <van-cell title="头像">
        <div class="avatar fr">
          <img class="auto-img" :src="userInfo.userImg" alt />
        </div>
      </van-cell>
      <van-cell title="用户id">
        <div class="fr">{{userInfo.userId}}</div>
      </van-cell>
      <van-cell title="手机号">
        <div class="fr">{{userInfo.phone}}</div>
      </van-cell>
      <van-cell title="昵称">
        <div class="fr">
          <input
            class="nickname"
            type="text"
            v-model="userInfo.nickName"
            @change="modifyUserInfo('nickName', 'http://www.kangliuyong.com:10002/updateNickName')"
          />
        </div>
      </van-cell>
      <div class="desc-box">
        <div class="desc-title">简介</div>
        <div>
          <textarea
            v-model="userInfo.desc"
            class="text-area"
            cols="30" 
            rows="10"
            maxlength="15"
            placeholder="这家伙很懒，什么都没有留下"
            @change="modifyUserInfo('desc', 'http://www.kangliuyong.com:10002/updateDesc')"
          ></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/less/account.less";
import {utils} from "../assets/js/utils"
export default {
  data() {
    return {
      userInfo: {},
      maxSize: 1 * 1024 * 1024,
    };
  },
  created() {
    this.getUserInfo();
  },

  methods: {
    back() {
      this.$router.go(-1);
    },

    //获取个人资料
    getUserInfo() {
      //获取token字符串
      let tokenString = localStorage.getItem("CSTK");
      if (!tokenString) {
        return;
      }

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });

      this.axios({
        method: "GET",
        url: "http://www.kangliuyong.com:10002/findAccountInfo",
        params: {
          appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
          tokenString,
        },
      })
        .then((result) => {
          this.$toast.clear();
            
          if (result.data.code == "B001") {
            this.userInfo = result.data.result[0];
          }
        })
        .catch((err) => {
          this.$toast.clear();
           
        });
    },


    //修改用户信息
    modifyUserInfo(key, url) {
      //获取token字符串
      let tokenString = localStorage.getItem("CSTK");
      if (!tokenString) {
        return;
      }

      //参数序列化
      let data = utils.queryString({
        appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
        tokenString,
        [key]: this.userInfo[key],
      });

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });

      this.axios({
        method: "POST",
        url,
        data,
      })
        .then((result) => {
          this.$toast.clear();
           
          this.$toast(result.data.msg);
        })
        .catch((err) => {
          this.$toast.clear();
           
        });
    },
  },
};
</script>
