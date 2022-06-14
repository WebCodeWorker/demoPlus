<template>
  <div class="login">
    <div class="login-box">
      <van-nav-bar @click-left="goHome" :border="false">
        <template #left>
          <div class="close-box">
            <van-icon color="#323233" size="28" name="cross" />
          </div>
        </template>
      </van-nav-bar>

      <div class="login-form">
        <div class="title">亲,　欢迎登陆</div>
        <div class="register">
          没有账号？<span @click="showPopup">立即注册</span>
        </div>
        <div class="login-form-box">
          <van-form>
            <van-field
              left-icon="phone-o"
              placeholder="请输入手机号"
              v-model="userLoginInfo.phone"
            />
            <van-field
              :type="isPassword ? 'password' : 'text'"
              left-icon="lock"
              placeholder="请输入密码"
              v-model="userLoginInfo.password"
              :right-icon="isPassword ? 'closed-eye' : 'eye-o'"
              @click-right-icon="viewPassword"
            />
            <div class="clearfix forgot">
              <span class="fr" @click="goPage('Forgot')">忘记密码?</span>
            </div>
            <div class="login-btn">
              <van-button
                round
                block
                type="info"
                color="linear-gradient(to right, rgb(255 104 69 / 89%), rgb(212 18 7))"
                native-type="submit"
                @click="login"
                >登&nbsp;&nbsp;录</van-button
              >
            </div>
            <div class="login-btn">
              <van-popup
                v-model="show"
                round
                position="bottom"
                :style="{ height: '50%' }"
                closeable
                close-icon-position="top-right"
              >
                <div class="register-box">
                  <h1>注册</h1>
                  <van-field
                    label="手机号"
                    placeholder="11位手机号"
                    v-model="userRegisterInfo.phone"
                  />
                  <van-field
                    label="昵称"
                    placeholder="1-10位昵称"
                    v-model="userRegisterInfo.nickName"
                  />
                  <van-field
                    label="密码"
                    :type="isPassword ? 'password' : 'text'"
                    placeholder="6-16位密码且以字母开头"
                    v-model="userRegisterInfo.password"
                    :right-icon="isPassword ? 'closed-eye' : 'eye-o'"
                    @click-right-icon="viewPassword"
                  />

                  <van-button
                    round
                    color="linear-gradient(to right, rgb(255 104 69 / 89%), rgb(212 18 7))"
                    size="large"
                    native-type="submit"
                    @click="register"
                    >注&nbsp;&nbsp;册</van-button
                  >
                </div>
              </van-popup>
            </div>
          </van-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/less/login.less";
import { validForm } from "../assets/js/validForm";
import { utils } from "../assets/js/utils";

export default {
  data() {
    return {
      userLoginInfo: {
        phone: "",
        password: "",
      },
      userRegisterInfo: {
        phone: "",
        nickName: "",
        password: "",
      },
      isPassword: true,
      isRegister: false,
      show: false,
      password: "",
    };
  },

  methods: {
    goPage(name) {
      this.$router.push({ name: "Forgot" });
    },
    goHome() {
      this.$router.push({ name: "Home" });
    },

    //查看密码
    viewPassword() {
      this.isPassword = !this.isPassword;
    },
    //弹出控制面板
    showPopup() {
      this.show = true;
    },
    //注册
    register() {
      //获取用户注册信息
      let userInfo = this.userRegisterInfo;

      //验证注册表单
      let o = {
        phone: {
          value: userInfo.phone,
          reg: /^1[3-9]\d{9}$/,
          errorMsg: "手机号格式不正确",
        },
        nickName: {
          value: userInfo.nickName,
          reg: /^[\w\u4e00-\u9fa5]{1,10}$/,
          errorMsg: "昵称格式不正确",
        },
        password: {
          value: userInfo.password,
          reg: /^[A-Za-z]\w{5,15}$/,
          errorMsg: "密码格式不正确",
        },
      };
      if (!validForm.valid(o)) {
        // validForm.valid(o) !== true
        //验证不通过
        return;
      }

      //发起请求
      // 开启加载提示
      this.$toast.loading({
        message: "加载中...",
        //防止穿透
        forbidClick: true,

        //显示时间，如果时间为零，则不会自动关闭
        duration: 0,
        loadingType: "spinner",
      });

      //序列化参数
      //复制对象
      let info = Object.assign({}, userInfo);
      info.appkey = "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=";
      let data = utils.queryString(info);

      this.axios({
        method: "POST",
        //请求参数
        url: "http://www.kangliuyong.com:10002/register",
        data,
      })
        .then((result) => {
          //关闭加载提示
          this.$toast.clear();

          //如果注册成功
          if (result.data.code == 100) {
            this.show = false;
            this.$notify({
              type: "success",
              message: result.data.msg,
            });
            //清空注册表单的数据
            for (let key in userInfo) {
              userInfo[key] = "";
            }
          } else {
            //如果注册失败,则提示
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
    //登录
    login() {
      let userInfo = this.userLoginInfo;

      let o = {
        phone: {
          value: userInfo.phone,
          reg: /^1[3-9]\d{9}$/,
          errorMsg: "手机格式不正确",
        },
        password: {
          value: userInfo.password,
          reg: /^[A-Za-z]\w{5,15}$/,
          errorMsg: "密码格式不正确",
        },
      };

      //验证表单
      if (!validForm.valid(o)) {
        return;
      }

      //验证通过
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });

      //复制userInfo
      let info = Object.assign({}, userInfo);
      info.appkey = "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=";

      //参数序列化
      let data = utils.queryString(info);

      this.axios({
        method: "POST",
        url: "http://www.kangliuyong.com:10002/login",
        data,
      })
        .then((result) => {
          this.$toast.clear();

          if (result.data.code == 200) {
            localStorage.setItem("CSTK", result.data.token);
            this.$router.push({ name: "Home" });
            //获取用户id
            this.axios({
              method: "get",
              url: "http://www.kangliuyong.com:10002/findAccountInfo",
              params: {
                appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
                tokenString: result.data.token
              },
            }).then((res) => {
              if (res.data.code == "B001") {
                if (res.data.result.length > 0) {
                  localStorage.setItem("userId", res.data.result[0].userId);
                }
              }
            });
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
  },
};
</script>
