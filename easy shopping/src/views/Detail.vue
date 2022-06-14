<template>
  <!-- 头部 -->
  <div class="detail">
    <van-skeleton
      class="skeleton-header"
      title
      avatar
      avatar-shape="square"
      :row="0"
      :loading="!galleryData"
    >
      <van-nav-bar left-arrow fixed ref="navs" @click-left="back">
        <template #right>
          <van-icon name="share-o" size="22">
            <van-cell class="share" @click="showShare = true" />
            <van-share-sheet
              v-model="showShare"
              title="立即分享给好友"
              :options="options"
              @select="onSelect"
            />
          </van-icon>
        </template>
      </van-nav-bar>
      <van-overlay :show="showPoster" @click="closePoster">
        <div class="wrapper">
          <div class="download">
            <van-tag
              round
              color="rgb(71 71 72 / 45%)"
              type="primary"
              @click="createPoster"
            >
              <van-icon size="21" name="back-top" />
            </van-tag>
          </div>
          <div class="block">
            <div class="poster">
              <img
                class="posterImg auto-img"
                :src="handleUrl(productData.goods_image_url)"
                alt
              />
              <div class="poster-price">￥{{ productData.price }}</div>
              <div class="poster-name">{{ productData.goods_name }}</div>
              <div id="qrcodeImg"></div>
            </div>
          </div>
        </div>
      </van-overlay>
    </van-skeleton>
    <div class="banner">
      <div class="product-img">
        <!-- <van-swipe> -->
        <!-- <van-swipe-item v-for="(item, index) in productData" :key="index"> -->
        <img class="auto-img" v-lazy="handleUrl(productData.goods_image_url)" />
        <!-- </van-swipe-item> -->
        <!-- </van-swipe> -->
      </div>

      <!-- 价格 -->
      <van-skeleton
        class="skeleton-price"
        title
        avatar
        avatar-shape="square"
        :row="2"
        :loading="!galleryData"
      >
        <div class="product-info">
          <div class="product-price clearfix">
            <span class="fl">
              <span class="money">￥</span>
              <span>{{ productData.price }}</span>
            </span>
            <span class="fr">{{ productData.sales_tip }}人付款</span>
          </div>
          <div class="product-name">{{ productData.goods_name }}</div>
        </div>
      </van-skeleton>
      <!-- 发货 -->
      <van-skeleton
        avatar
        avatar-shape="square"
        :row="1"
        :loading="!galleryData"
      >
        <div class="deliver-goods">
          <span class="cell-title">发货</span>
          <van-icon class="icon" name="location-o" />浙江杭州
          <span class="express">快递：免运费</span>
        </div>
      </van-skeleton>
      <!-- 保障 -->
      <van-skeleton
        class="skeleton-goods"
        avatar
        avatar-shape="square"
        :row="1"
        :loading="!galleryData"
      >
        <div class="deliver-goods">
          <van-cell
            is-link
            class="cell-title"
            title="保障"
            @click="shows = true"
          >
            <span class="guarantee">
              假一赔四
              <span class="point">•</span>上门换取
              <span class="point">•</span>极速退款
              <span class="point">•</span>七天无理由退换
            </span>
          </van-cell>
          <van-action-sheet
            v-model="shows"
            :actions="actions"
            cancel-text="确定"
            description="基础保障"
            close-on-click-action
          />
        </div>
      </van-skeleton>
      <!-- 商品评价 -->
      <div class="evaluation" v-if="commentTotal > 0">
        <div class="comment fl">
          <span class="comment-title">评价</span>
          <span class="comment-count">({{ commentTotal }})</span>
        </div>
        <div class="viewAll fr" @click="goComment">
          查看全部 <van-icon name="arrow" />
        </div>
        <div class="comment-header">
          <img class="header_url fl" :src="commentData.header_url" />
          <div class="comment-userName fl">
            <div class="userName">{{ commentData.user_name }}</div>
            <van-rate
              v-model="commentData.score"
              allow-half
              readonly
              void-color="#eee"
              void-icon="star"
              :size="12"
            />
          </div>
        </div>
        <div class="comment-content">
          <div>
            {{
              !commentData.comment
                ? "该用户未填写任何评价"
                : commentData.comment
            }}
          </div>
          <div class="goods_picture">
            <img
              v-for="(v, i) in commentData.comment_pic.split(',')"
              :key="i"
              :src="handleCommentUrl(v)"
              v-show="commentData.comment_pic != ''"
            />
          </div>
        </div>
      </div>
      <div class="describe" v-else>暂时还没有评价哦</div>
      <!-- 商家 -->
      <van-skeleton
        class="van-skeleton-shop"
        avatar
        avatar-shape="square"
        :row="3"
        :loading="!galleryData"
      >
        <div class="shop-direction">
          <div class="left fl">
            <img class="auto-img fl" src="../assets/images/shop.jpg" alt />
            <div class="name">{{ productData.mall_name }}</div>
            <span class="zonghe">综合体验</span>
            <van-rate
              allow-half
              void-color="#eee"
              void-icon="star"
              v-model="value"
              :size="12"
            />
          </div>
          <div class="right fr">
            <div>宝贝描述4.8 高</div>
            <div>卖家服务4.0 中</div>
            <div>物流服务3.0 低</div>
          </div>
        </div>
      </van-skeleton>

      <div class="shop">
        <van-skeleton
          class="skeleton-header"
          title
          avatar
          avatar-shape="square"
          :row="0"
          :loading="!galleryData"
        >
          <van-cell
            value="查看全部"
            is-link
            :arrow-direction="direction"
            @click="checkAll"
          >
            <template #title>
              <span class="custom-title">店铺推荐</span>
            </template>
          </van-cell>
          <div class="expect" v-show="!isDirection">
            店铺功能暂未开发完毕，敬请期待！！！！
          </div>
        </van-skeleton>
        <div class="shop-product clearfix">
          <div
            class="product"
            v-for="(item, index) in goodsData"
            :key="index"
            @click="checkDetail(item)"
          >
            <div class="product-img">
              <img
                class="auto-img"
                v-lazy="handleUrl(item.goods_image_url)"
                alt
              />
            </div>
            <van-skeleton
              class="van-skeleton-shops"
              :row="2"
              :loading="!galleryData"
            >
              <div class="product-name van-multi-ellipsis--l2">
                {{ item.goods_name }}
              </div>

              <div class="fl price">
                <span class="money">￥</span>
                <span>{{ item.price }}</span>
              </div>
            </van-skeleton>
          </div>
        </div>
      </div>
      <div class="shop-detail">
        <div class="header clearfix">
          <van-skeleton class="van-skeleton-d" :row="1" :loading="!galleryData">
            <div class="left-line fl"></div>
            <div class="detail-title fl">商品详情</div>
            <div class="right-line fl"></div>
          </van-skeleton>
        </div>
        <img
          class="auto-img"
          v-for="(item, index) in imageList"
          v-lazy="item"
          :key="index"
        />
      </div>
    </div>
    <!-- 商品导航 -->
    <van-goods-action>
      <van-skeleton
        class="skeleton-header"
        title
        avatar
        avatar-shape="square"
        :row="0"
        :loading="!galleryData"
      >
        <van-goods-action-icon
          icon="cart-o"
          text="购物车"
          :badge="badge"
          @click="goShopbag"
        />
        <van-goods-action-icon
          :icon="isActive ? 'star-o' : 'star'"
          :text="isActive ? '收藏' : '已收藏'"
          :color="isActive ? '#5d5d5e' : '#ff5000'"
          @click="collection"
        />
        <!-- color="#ff5000" -->
        <van-goods-action-button
          type="warning"
          text="加入购物车"
          @click="addProduct"
        />
        <van-goods-action-button type="danger" text="立即购买" @click="goPay" />
      </van-skeleton>
    </van-goods-action>
  </div>
</template>

<script>
import "../assets/less/detail.less";
import QRCode from "qrcodejs2";
import html2canvas from "html2canvas";
export default {
  data() {
    return {
      goods_id: "",
      showShare: false,
      shows: false,
      showPoster: false,
      isActive: true,
      mall_id: "",
      loading: true,
      direction: "",
      value: 3.5,
      isDirection: true,
      actions: [
        { name: "假一赔四", subname: "正品保障，假一赔四" },
        {
          name: "上门换取",
          subname: "预约上门取件，最快1小时上门，取件后极速退款到账",
        },
        { name: "极速退款", subname: "诚信用户在退货寄出后，享受极速退款到账" },
        {
          name: "七天无理由退换",
          subname: "满足相应条件时，消费者可申请“七天无理由退换货”",
        },
      ],
      options: [
        { name: "分享海报", icon: "poster" },
        { name: "复制链接", icon: "link" },
      ],

      productData: [],
      goodsData: [],
      recommendingGoods: [],
      recommendingAllGoods: [],
      galleryData: false,
      imageList: [],
      height: 0,
      a: 0,
      badge: 0,
      posterImg: "", // 最终生成的海报图片
      posterImgName: "海报", // 最终生成的海报图片名称
      commentTotal: "",
      commentData: [],
    };
  },

  created() {
    this.goods_id = this.$route.query.goods_id;
    let goods = localStorage.getItem("goods_data");

    if (!goods || goods.indexOf(this.goods_id) == -1) {
      this.getProductById();
    } else {
      JSON.parse(goods).forEach((e) => {
        if (e.productData.id == this.goods_id) {
          this.productData = e.productData;
          this.badge = e.count;
        }
      });
      this.galleryData = true;
    }
    //判断是否添加收藏
    if (
      localStorage.getItem("collection") &&
      localStorage.getItem("collection").indexOf(this.goods_id) != -1
    ) {
      this.isActive = false;
    }
    //获取评论数据
    this.getCommentData();
  },

  mounted() {
    this.loading = false;
    window.addEventListener("scroll", this.show);
    this.createQrcode(window.location.href);
  },

  destroyed() {
    window.removeEventListener("scroll", this.show);
  },

  methods: {
    handleUrl(url) {
      return require("@/static/" + url);
    },
    handleCommentUrl(url) {
      return !url ? "/" : "http://119.23.140.110:3000/img/comment_pic/" + url;
    },
    back() {
      this.$router.go(-1);
    },
    //查看评论
    goComment() {
      this.$router.push({
        name: "Comment",
        query: { goods_id: this.goods_id },
      });
    },
    //根据商品id获取商品评论
    getCommentData() {
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
          goods_id: this.goods_id,
          sort: "DESC",
        },
      })
        .then((response) => {
          this.commentTotal = response.data.result.length;
          this.commentData = response.data.result[0];

          this.$toast.clear();
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },

    onClickIcon() {
      Toast("点击图标");
    },
    onClickButton() {
      Toast("点击按钮");
    },
    onSelect(option) {
      if (option.icon == "poster") {
        this.showPoster = true;
      }
      if (option.icon == "link") {
        var aux = document.createElement("input");
        aux.setAttribute("value", window.location.href);
        document.body.appendChild(aux);
        aux.select();
        document.execCommand("copy");
        document.body.removeChild(aux);
        this.$toast.success("链接已经复制到剪切板");
      }
      this.showShare = false;
    },
    closePoster() {
      this.showPoster = false;
    },
    //查看全部
    checkAll() {
      if (this.isDirection) {
        this.direction = "down";
        this.isDirection = false;
        this.goodsData = this.recommendingAllGoods;
      } else {
        this.direction = "";
        this.isDirection = true;
        this.goodsData = this.recommendingGoods;
      }
    },

    //商品详情
    checkDetail(item) {
      this.goods_id = item.goods_id;
      this.getProductById();
    },

    //去购物车
    goShopbag() {
      //获取token字符串
      let tokenString = localStorage.getItem("CSTK");
      //判断是否已经登录
      if (!tokenString) {
        return this.$router.push({ name: "Login" });
      }
      this.$router.push({ name: "Shopbag" });
    },

    //点击收藏
    collection() {
      //获取token字符串
      let tokenString = localStorage.getItem("CSTK");
      //判断是否已经登录
      if (!tokenString) {
        return this.$router.push({ name: "Login" });
      }

      if (this.isActive) {
        this.isActive = false;
        //判断本地是否有数据
        let datas = JSON.parse(localStorage.getItem("collection"));
        if (!datas) {
          //存储json数据
          let data = [{ productData: this.productData }];
          localStorage.setItem("collection", JSON.stringify(data));
        } else {
          if (JSON.stringify(datas).indexOf(this.productData.id) == -1) {
            datas.unshift({ productData: this.productData });
          }
          localStorage.setItem("collection", JSON.stringify(datas));
        }
      } else {
        this.isActive = true;
        let isData = JSON.parse(localStorage.getItem("collection"));
        isData.forEach((v, i) => {
          if (v.productData.id == this.goods_id) {
            isData.splice(i, 1);
          }
        });
        localStorage.setItem("collection", JSON.stringify(isData));
      }
    },

    //加入购物车
    addProduct() {
      //获取token字符串
      let tokenString = localStorage.getItem("CSTK");
      //判断是否已经登录
      if (!tokenString) {
        return this.$router.push({ name: "Login" });
      }

      //判断本地是否有数据
      let datas = JSON.parse(localStorage.getItem("goods_data"));
      if (!datas) {
        //存储json数据
        let data = [{ productData: this.productData, count: 1 }];
        this.badge = data[0].count;
        localStorage.setItem("goods_data", JSON.stringify(data));
      } else {
        if (JSON.stringify(datas).indexOf(this.productData.id) == -1) {
          datas.unshift({ productData: this.productData, count: 1 });
          this.badge = 1;
        } else {
          datas.map((e) => {
            if (e.productData.id == this.goods_id) {
              e.count++;
              this.badge = e.count;
            }
          });
        }
        localStorage.setItem("goods_data", JSON.stringify(datas));
      }

      this.$toast.success("加入购物车成功");
    },

    show() {
      //滚动条的高度
      let scrollTop =
        document.body.scrollTop || document.documentElement.scrollTop;

      let distance = scrollTop - this.height;
      this.height = scrollTop;

      if ((scrollTop > 60) & (distance > 0)) {
        this.a =
          this.a + 0.05 >= 1 || scrollTop >= 89 ? (this.a = 1) : this.a + 0.05;
      } else if ((distance < 0) & (scrollTop < 60)) {
        this.a = this.a <= 0 || scrollTop == 0 ? (this.a = 0) : this.a - 0.05;
      }

      this.$refs.navs.$refs.navBar.style.background =
        "rgba(255,255,255," + this.a + ")";
      //
    },

    //根据商品id获取商品
    getProductById() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });
      this.axios({
        method: "GET",
        url: "/queryById",
        params: {
          id: this.goods_id,
        },
      })
        .then((response) => {
          this.productData = response.data.result[0];
          this.galleryData = true;
          this.$toast.clear();
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },

    //获取店铺推荐商品
    getProductByMallId() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });
      this.axios({
        method: "GET",
        url: "/hotData",
        params: {},
      })
        .then((response) => {
          this.goodsData = this.response.data.result;
          this.galleryData = true;
          this.$toast.clear();
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },
    //立即购买
    goPay() {
      //获取token字符串
      let tokenString = localStorage.getItem("CSTK");
      //判断是否已经登录
      if (!tokenString) {
        return this.$router.push({ name: "Login" });
      }

      let goods_data = {
        goods_id: this.goods_id,
        count: this.badge == 0 ? 1 : this.badge,
        price: this.productData.price,
      };
      this.$router.push({
        name: "Pay",
        query: { goods_data: JSON.stringify(goods_data) },
      });
    },

    // 生成二维码
    createQrcode(text) {
      const qrcodeImgEl = document.getElementById("qrcodeImg");
      let qrcode = new QRCode(qrcodeImgEl, {
        width: 70,
        height: 70,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H,
      });
      qrcode.makeCode(text);
    },
    // 生成海报
    createPoster() {
      const vm = this;
      const domObj = document.querySelector(".block");
      html2canvas(domObj, {
        useCORS: true,
        allowTaint: false,
        logging: false,
        letterRendering: true,
        onclone(doc) {
          let e = doc.querySelector(".block");
          e.style.display = "block";
        },
      }).then((canvas) => {
        // 在微信里,可长按保存或转发
        vm.posterImg = canvas.toDataURL();

        vm.imgDown(vm.posterImg);
      });
      // 生成二维码海报
      this.createQrcodePoster();
    },
    // 生成二维码海报
    createQrcodePoster() {
      const vm = this;
      const domObj = document.getElementById("qrcodeImg");
      html2canvas(domObj, {
        useCORS: true,
        allowTaint: false,
        logging: false,
        letterRendering: true,
        onclone(doc) {
          let e = doc.getElementById("qrcodeImg");
          e.style.display = "block";
        },
      }).then((canvas) => {
        // 在微信里,可长按保存或转发
        vm.posterImg = canvas.toDataURL();

        vm.imgDown(vm.posterImg);
      });
    },
    // 保存图片到本地
    imgDown(img) {
      var alink = document.createElement("a");
      alink.href = img;
      alink.download = this.posterImgName; // 图片名
      alink.click();
    },
  },
};
</script>

<style lang="less" scoped>
/deep/.van-nav-bar__content .van-icon {
  color: rgb(224, 46, 36);
}
.describe {
  font-size: 14px;
  padding: 10px 131px;
  background: #fff;
  margin: 10px 0;
}
.expect {
  font-size: 14px;
  padding: 50px 49px;
  background: #fff;
}
</style>
