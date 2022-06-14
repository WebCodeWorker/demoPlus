  <template>
  <div class="my">
    <!-- <van-nav-bar
      title="个人中心"
      :fixed="true"
      placeholder="true"
    /> -->

    <div class="my-content">
      <div class="my-box">
        <div class="my-img">
          <!-- 默认头像 -->
          <div class="fl img-box">
            <img class="auto-img" :src="userInfo.userImg" alt />
            <van-uploader class="uploader-box small" :after-read="uploadUserImg" />
          </div>
          <div class="fl my-info">
            <div class="nickname"><span></span>{{userInfo.nickName}}</div>
          </div>
        </div>
      </div>

      <div class="lists">
        <div class="lists1" >
          <van-cell
            :title="item.title"
            :to="isLogin ? item.to : {name: 'Login'}"
            size="large"
            is-link
            v-for="(item, index) in lists1"
            :key="index"
          />
        </div>
        <div class="lists2">
          <van-cell
            :title="item.title"
            :to="isLogin ? item.to : {name: 'Login'}"
            size="large"
            is-link
            v-for="(item, index) in lists2"
            :key="index"
          />
        </div>
        <div class="lists2">
          <van-cell
            :title="item.title"
            :to="isLogin ? item.to : {name: 'Login'}"
            size="large"
            is-link
            v-for="(item, index) in lists3"
            :key="index"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../../assets/less/my.less";
import { utils } from "../../assets/js/utils";
export default {
  data() {
    return {
      lists1: [{ title: "个人资料", to: { name: "Account" } }],
      lists2: [
        { title: "我的订单", to: { name: "Order" } },
        { title: "我的收藏", to: { name: "Like" } },
        { title: "收货地址", to: { name: "Address" } },
        { title: "我的花销", to: { name: "Echart" } },
      ],
      lists3: [{ title: "安全中心", to: { name: "Secure" } }],

      isLogin: true,
      userInfo: {},
      maxSize: 1024 * 1024 * 1,
    };
  },

  created() {
    this.getUserInfo();
  },
   beforeRouteEnter(to, from, next) {
    
    //获取token字符串
      let tokenString = localStorage.getItem("CSTK");
      //判断是否已经登录
      if (!tokenString) {
        next({ name: "Login" });
      }else{
        next()
      }
  },
  methods: {
    //上传头像
    uploadUserImg(file) {
      //获取token字符串
      let tokenString = localStorage.getItem("CSTK");
      if (!tokenString) {
        return;
      }

      //获取文件类型,只给上传"png", "gif", "jpg", "jpeg"类型的图片
      let type = file.file.type.split("/")[1];
      let imgTypes = ["png", "gif", "jpg", "jpeg"];
      if (imgTypes.indexOf(type) === -1) {
        this.$notify({
          message: "图片类型只支持" + imgTypes.join(","),
          color: "#fff",
          background: "#0C34BA",
        });

        return;
      }

      //大小
      if (this.maxSize < file.file.size) {
        this.$notify({
          message: "上传文件大小不能超过" + this.maxSize / 1024 + "KB",
          color: "#fff",
          background: "#0C34BA",
        });
        return;
      }

      

      //获取base64
      let base64 = file.content.replace(/data:image\/[A-Za-z]+;base64,/, "");

      //参数序列化
      let data = utils.queryString({
        appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
        tokenString,
        imgType: type,
        serverBase64Img: base64,
      });

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });

      this.axios({
        method: "POST",
        url: "http://www.kangliuyong.com:10002/updateAvatar",
        data,
      })
        .then((result) => {
          this.$toast.clear();
           
          if (result.data.code == "H001") {
            this.userInfo.userImg = result.data.userImg;
          }
        })
        .catch((err) => {
          this.$toast.clear();
           
        });
    },
    goLogin() {
      this.$router.push({ name: "Login" });
    },
    //查询用户信息
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
        method: "get",
        url: "http://www.kangliuyong.com:10002/findMy",
        params: {
          appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
          tokenString,
        },
      })
        .then((result) => {
          this.$toast.clear();
           console.log(result)
          if (result.data.code == "A001") {
            if (result.data.result.length > 0) {
              this.isLogin = true;
              this.userInfo = result.data.result[0];
            }
          }
        })
        .catch((err) => {
          this.$toast.clear();
           
        });
    },
    // 上传背景图
    upload(file) {
      //获取token字符串
      let tokenString = localStorage.getItem("CSTK");
      if (!tokenString) {
        return;
      }
      //获取文件类型
      let type = file.file.type.split("/")[1];
      let imgTypes = [ "gif", "jpg", "jpeg","png"];
      if (imgTypes.indexOf(type) === -1) {
        this.$notify({
          message: "图片类型只支持" + imgTypes.join(","),
          color: "#fff",
          background: "#0C34BA",
        });
        return;
      }
      //大小
      if (this.maxSize < file.file.size) {
        this.$notify({
          message: "上传文件大小不能超过" + this.maxSize / 1024 + "KB",
          color: "#fff",
          background: "#0C34BA",
        });
        return;
      }
      //替换一个与正则表达式匹配的子串。
      let base64 = file.content.replace(/data:image\/[A-Za-z]+;base64,/, "");
      //参数序列化
      let data = utils.queryString({
        appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
        tokenString,
        imgType: type,
        serverBase64Img: base64,
      });

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });

      this.axios({
        method: "post",
        url: "http://www.kangliuyong.com:10002/updateUserBg",
        data,
      })
        .then((result) => {
          this.$toast.clear();
           
          if (result.data.code == "I001") {
            this.userInfo.userBg = result.data.userBg;
          }
        })
        .catch((err) => {
          this.$toast.clear();
           
        });
    },
  },
};
</script>

<style lang="less" scoped>
</style>