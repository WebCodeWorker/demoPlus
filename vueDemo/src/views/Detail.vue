<template>
  <!-- 头部 -->
  <div class="detail">
    <van-skeleton
      class="skeleton-header"
      title
      avatar
      avatar-shape="square"
      :row="0"
      :loading="!galleryData[0]"
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
          <div class="block">
            <div class="download">
              <van-tag round color="rgb(71 71 72 / 45%)" type="primary" @click="createPoster">
                <van-icon size="21" name="back-top" />
              </van-tag>
            </div>
            <div class="poster">
              <img class="posterImg auto-img" :src="productData.hd_thumb_url" alt />
              <div class="poster-name fl">{{productData.goods_desc}}</div>
              <div class="poster-price fr">￥{{productData.min_normal_price}}</div>
            </div>
          </div>
        </div>
      </van-overlay>
    </van-skeleton>
    <van-overlay :show="isQrcode" @click="closeQrcode">
      <div class="wrapper">
        <div class="block">
           <div class="download qr">
              <van-tag round color="rgb(71 71 72 / 45%)" type="primary" @click="createQrcodePoster">
                <van-icon size="21" name="back-top" />
              </van-tag>
            </div>
          <div id="qrcodeImg"></div>
        </div>
      </div>
    </van-overlay>
    <div class="banner">
      <div class="product-img">
        <van-swipe>
          <van-swipe-item v-for="(item, index) in galleryData" :key="index">
            <img class="auto-img" v-lazy="item.url" />
          </van-swipe-item>
        </van-swipe>
      </div>

      <!-- 价格 -->
      <van-skeleton
        class="skeleton-price"
        title
        avatar
        avatar-shape="square"
        :row="2"
        :loading="!galleryData[0]"
      >
        <div class="product-info">
          <div class="product-price clearfix">
            <span class="fl">
              <span class="money">￥</span>
              {{productData.min_normal_price}}
            </span>
            <span class="fr">月销{{productData.sales}}</span>
          </div>
          <div class="product-name">{{productData.goods_desc}}</div>
        </div>
      </van-skeleton>

      <van-skeleton avatar avatar-shape="square" :row="1" :loading="!galleryData[0]">
        <div class="deliver-goods">
          <span class="cell-title">发货</span>
          <van-icon class="icon" name="location-o" />浙江杭州
          <span class="express">快递：免运费</span>
        </div>
      </van-skeleton>

      <van-skeleton
        class="skeleton-goods"
        avatar
        avatar-shape="square"
        :row="1"
        :loading="!galleryData[0]"
      >
        <div class="deliver-goods">
          <van-cell is-link class="cell-title" title="保障" @click="shows = true">
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

      <van-skeleton
        class="van-skeleton-shop"
        avatar
        avatar-shape="square"
        :row="3"
        :loading="!galleryData[0]"
      >
        <div class="shop-direction">
          <div class="left fl">
            <img class="auto-img fl" src="../assets/images/shop.jpg" alt />
            <div class="name">{{productData.mall_name}}</div>
            <span class="zonghe">综合体验</span>
            <van-rate allow-half void-color="#eee" void-icon="star" v-model="value" :size="12" />
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
          :loading="!galleryData[0]"
        >
          <van-cell value="查看全部" is-link :arrow-direction="direction" @click="checkAll">
            <template #title>
              <span class="custom-title">店铺推荐</span>
            </template>
          </van-cell>
        </van-skeleton>
        <div class="shop-product clearfix">
          <div
            class="product"
            v-for="(item, index) in goodsData"
            :key="index"
            @click="checkDetail(item)"
          >
            <div class="product-img">
              <img class="auto-img" v-lazy="item.goods_image_url" alt />
            </div>
            <van-skeleton class="van-skeleton-shops" :row="2" :loading="!galleryData[0]">
              <div class="product-name van-multi-ellipsis--l2">{{item.goods_name}}</div>

              <div class="fl price">
                <span class="money">￥</span>
                {{item.min_normal_price}}
              </div>
            </van-skeleton>
          </div>
        </div>
      </div>
      <div class="shop-detail">
        <div class="header clearfix">
          <van-skeleton class="van-skeleton-d" :row="1" :loading="!galleryData[0]">
            <div class="left-line fl"></div>
            <div class="detail-title fl">商品详情</div>
            <div class="right-line fl"></div>
          </van-skeleton>
        </div>
        <img class="auto-img" v-for="(item,index) in imageList" v-lazy="item" :key="index" />
      </div>
    </div>

    <van-goods-action>
      <van-skeleton
        class="skeleton-header"
        title
        avatar
        avatar-shape="square"
        :row="0"
        :loading="!galleryData[0]"
      >
        <van-goods-action-icon icon="cart-o" text="购物车" :badge="badge" @click="goShopbag" />
        <van-goods-action-icon
          :icon="isActive ? 'star-o' : 'star'"
          :text="isActive ? '收藏' : '已收藏'"
          :color="isActive ? '#5d5d5e' : '#ff5000'"
          @click="collection"
        />
        <!-- color="#ff5000" -->
        <van-goods-action-button type="warning" text="加入购物车" @click="addProduct" />
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
      isQrcode: false,
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
        { name: "生成海报", icon: "poster" },
        { name: "二维码", icon: "qrcode" },
      ],

      productData: [],
      goodsData: [],
      recommendingGoods: [],
      recommendingAllGoods: [],
      galleryData: [],
      imageList: [],
      height: 0,
      a: 0,
      badge: 0,
      count: 0,
      posterImg: "", // 最终生成的海报图片
      posterImgName: "海报", // 最终生成的海报图片名称
    };
  },

  created() {
    this.goods_id = this.$route.query.goods;
    let badges = JSON.parse(localStorage.getItem("badges"));
    this.badge = badges;
    
    this.getProductById();
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
    back() {
      this.$router.go(-1);
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
      } else {
        this.isQrcode = true;
      }
      this.showShare = false;
    },
    closePoster() {
      this.showPoster = false;
    },
    closeQrcode() {
      this.isQrcode = false;
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
        let isData = JSON.parse(localStorage.getItem("collection"));
        if (isData == null) {
          //存储json数据
          let data = [];
          localStorage.setItem("collection", JSON.stringify(data));
        }

        //当需要添加、更新数据，获取本地json、解析、编辑，再放回本地
        let datas = JSON.parse(localStorage.getItem("collection"));
        datas.unshift(Number(this.goods_id));
        //去重
        datas = [...new Set(datas)];
        
        localStorage.setItem("collection", JSON.stringify(datas));
      } else {
        this.isActive = true;
        let isData = JSON.parse(localStorage.getItem("collection"));

        isData.splice(0, 1);
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
      let isData = JSON.parse(localStorage.getItem("goods_id_car"));
      if (isData == null) {
        //存储json数据
        let data = [];
        localStorage.setItem("goods_id_car", JSON.stringify(data));
      }

      //当需要添加、更新数据，获取本地json、解析、编辑，再放回本地
      let datas = JSON.parse(localStorage.getItem("goods_id_car"));
      this.count = this.count + 1;
      datas.unshift({ goods_id: this.goods_id, count: this.count });
      
      
      localStorage.setItem("goods_id_car", JSON.stringify(datas));

      let badges = JSON.parse(localStorage.getItem("badges"));
      this.badge = badges + 1;
      localStorage.setItem("badges", JSON.stringify(this.badge));
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
        url: "/2260-8",
        params: {
          showapi_appid: this.showapi_appid,
          showapi_sign: this.secret,
          goods_id: this.goods_id,
        },
      })
        .then((response) => {
          this.$toast.clear();
          let data = JSON.parse(response.data.showapi_res_body.ret_body);
          data;
          //修改数据
          data.min_normal_price = Math.round(data.min_normal_price / 100);

          this.productData = data;
          this.mall_id = data.mall_id;
          this.galleryData = [];
          data.gallery.reverse().map((v, i) => {
            if (i < 8) {
              this.galleryData.push(v);
            }
          });
          this.imageList = [];
          data.gallery.map((v, i) => {
            if (i > 9) {
              this.imageList.push(v.url);
            }
          });
          
          
          this.getProductByMallId();
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
        url: "/2260-11",
        params: {
          showapi_appid: this.showapi_appid,
          showapi_sign: this.secret,
          mall_id: this.mall_id,
        },
      })
        .then((response) => {
          this.$toast.clear();
          let data = JSON.parse(response.data.showapi_res_body.ret_body);

          data.goods_list.map((v) => {
            v.min_normal_price = Math.round(v.min_normal_price / 100);
          });

          this.recommendingGoods = [];
          data.goods_list.map((v, i) => {
            if (i < 3) {
              this.recommendingGoods.push(v);
            }
          });

          this.recommendingAllGoods = data.goods_list;
          this.goodsData = this.recommendingGoods;
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

      let goods_data = [{ goods_id: this.goods_id, count: 1 }];

      this.$router.push({
        name: "Pay",
        query: { goods_data: goods_data },
      });
    },

    //生成海报
    createQrcode(text) {
      // 生成二维码
      const qrcodeImgEl = document.getElementById("qrcodeImg");
      let qrcode = new QRCode(qrcodeImgEl, {
        width: 230,
        height: 230,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H,
      });
      qrcode.makeCode(text);
    },
    createPoster() {
      // 生成海报
      const vm = this;
      const domObj = document.querySelector(".poster");
      html2canvas(domObj, {
        useCORS: true,
        allowTaint: false,
        logging: false,
        letterRendering: true,
        onclone(doc) {
          let e = doc.querySelector(".poster");
          e.style.display = "block";
        },
      }).then((canvas) => {
        // 在微信里,可长按保存或转发
        vm.posterImg = canvas.toDataURL();
        
        vm.imgDown(vm.posterImg);
      });
    },
    createQrcodePoster() {
      // 生成二维码
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

<style lang="scss" scoped>
</style>