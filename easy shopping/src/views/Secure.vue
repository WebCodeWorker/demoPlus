<template>
  <div class="secure">
    <van-nav-bar title="安全中心" left-arrow :fixed="true" @click-left="back" />
    <div class="secure-bg"></div>
    <div class="secure-box">
      <div>
        <van-cell title="修改密码" isLink @click="openPasswordPopup" />
        <van-cell title="注销账号" isLink @click="destroyAccount" />
      </div>
    </div>
    <div class="btn-box">
      <van-button round block color="linear-gradient(to right, rgb(224 71 36 / 58%) , #e02e24)" @click="logout">退出登录</van-button>
    </div>
    <van-popup class="popup-box" closeable v-model="isOpen" position="bottom">
      <div class="popup-item">
        <div class="password-text">修改密码</div>
        <van-form>
          <van-field
            v-for="(item, index) in passwords"
            :key="index"
            :type="item.isPassword ? 'password' : 'text'"
            :label="item.title"
            placeholder="6-16位密码且以字母开头"
            v-model="item.password"
            :right-icon="item.isPassword ? 'closed-eye' : 'eye-o'"
            @click-right-icon="viewPassword(item)"
          />
          <div class="login-btn">
            <van-button
              round
              block
              color="linear-gradient(to right, rgb(224 71 36 / 58%) , #e02e24)"
              native-type="submit"
              @click="confirmPassword"
            >确认修改</van-button>
          </div>
        </van-form>
      </div>
    </van-popup>
  </div>
</template>

<script>
import "../assets/less/secure.less";

import { utils } from "../assets/js/utils";

import { validForm } from "../assets/js/validForm";

export default {
  data() {
    return {
      isOpen: false,
      passwords: {
        old: {
          password: "",
          isPassword: true,
          title: "旧密码",
        },
        new: {
          password: "",
          isPassword: true,
          title: "新密码",
        },
      },
    };
  },
  methods: {
    back() {
      this.$router.go(-1);
    },

    //查看密码
    viewPassword(item) {
      item.isPassword = !item.isPassword;
    },

    //退出登录
    logout() {
      this.$dialog
        .confirm({
          title: "退出登录",
          message: "是否确认退出登录！",
          confirmButtonColor: "linear-gradient(to right, rgb(224 71 36 / 58%) , #e02e24)",
        })
        .then(() => {
          this.$toast.loading({
            message: "加载中...",
            forbidClick: true,
            duration: 0,
            loadingType: "spinner",
          });

          localStorage.removeItem("CSTK");

          setTimeout(() => {
            this.$toast.clear();
            this.$router.push({ name: "Login" });
          }, 1000);
        });
    },

    //修改密码
    openPasswordPopup() {
      this.isOpen = true;
    },

    //确认修改密码
    confirmPassword() {
      //获取token字符串
      let tokenString = localStorage.getItem("CSTK");
      if (!tokenString) {
        return this.$router.push({ name: "Login" });
      }

      let o = {
        oldPassword: {
          value: this.passwords.old.password,
          reg: /^[A-Za-z]\w{5,15}$/,
          errorMsg: "旧密码支持字母数字_组合",
        },
        password: {
          value: this.passwords.new.password,
          reg: /^[A-Za-z]\w{5,15}$/,
          errorMsg: "新密码支持字母数字_组合",
        },
      };

      //验证表单
      if (!validForm.valid(o)) {
        //验证不通过
        return;
      }

      //发起修改密码请求
      //验证通过
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });

      //参数序列化
      let data = utils.queryString({
        appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
        tokenString,
        oldPassword: this.passwords.old.password,
        password: this.passwords.new.password,
      });

      this.axios({
        method: "POST",
        url: "http://www.kangliuyong.com:10002/updatePassword",
        data,
      })
        .then((result) => {
          this.$toast.clear();
           
          if (result.data.code == "E001") {
            localStorage.removeItem("CSTK");
            this.$router.push({ name: "Login" });
          } else {
            this.$notify({
              type: "warning",
              message: result.data.msg,
            });
          }
        })
        .catch((err) => {
          this.$toast.clear();
           
        });
    },

    //注销账号
    destroyAccount() {
      this.$dialog
        .confirm({
          title: "注销账号",
          message: "是否确认注销号，一旦确认无法恢复！",
          confirmButtonColor: "linear-gradient(to right, rgb(224 71 36 / 58%) , #e02e24)",
        })
        .then(() => {
           
          //获取token字符串
          let tokenString = localStorage.getItem("CSTK");
          if (!tokenString) {
            return this.$router.push({ name: "Login" });
          }

          this.$toast.loading({
            message: "加载中...",
            forbidClick: true,
            duration: 0,
            loadingType: "spinner",
          });

          //参数序列化
          let data = utils.queryString({
            appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
            tokenString
          });

          this.axios({
            method: "POST",
            url: "http://www.kangliuyong.com:10002/destroyAccount",
            data
          })
            .then((result) => {
              this.$toast.clear();
               
              this.$toast(result.data.msg);
              if (result.data.code == "G001") {
                localStorage.removeItem("CSTK");
                setTimeout(() => {
                  this.$router.push({ name: "Login" });
                }, 600)
                
              }
            })
            .catch((err) => {
              this.$toast.clear();
               
            });
        })
        .catch(() => {
           
        });
    },
  },
};
</script>

<style lang="less" scoped>
</style>