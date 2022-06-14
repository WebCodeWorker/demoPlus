<template>
  <div class="pay">
    <van-nav-bar
      title="确认订单"
      left-arrow
      :fixed="true"
      placeholder
      @click-left="back"
    />

    <div class="address-box">
      <div class="address">
        <div class="clearfix" @click="openAddressBox">
          <div class="fl address-title">选择收货地址</div>
          <div class="fl arrow-box">
            <van-icon name="arrow" class="arrow-icon" />
          </div>
        </div>
        <div class="address-content">
          <div class="clearfix">
            <div class="fl name">{{ currentAddress.name }}</div>
            <div class="fl phone">{{ currentAddress.tel }}</div>
          </div>
          <div class="address-info">{{ currentAddress.address }}</div>
        </div>
      </div>
    </div>

    <div class="order-info">
      <div class="order-box">
        <div class="order-title">订单信息</div>

        <div>
          <div
            class="clearfix cell-box"
            v-for="(item, index) in shopbagData"
            :key="index"
          >
            <div class="fl pro-img">
              <img
                class="auto-img"
                :src="handleUrl(item.goods_image_url)"
                alt
              />
            </div>
            <div class="fl pro-info">
              <div class="text-box">
                <div class="clearfix">
                  <div class="text-name van-multi-ellipsis--l2">
                    {{ item.goods_name }}
                  </div>
                  <div class="price">￥{{ item.price }}</div>
                </div>
                <van-icon class="fl" name="shop-o" />
                <div class="fl text-enname">{{ item.mall_name }}</div>
              </div>
              <div class="price-box">
                <div class="fr count">x{{ item.count }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="circle">
      <van-circle
        v-if="flag"
        v-model="currentRate"
        :rate="100"
        :clockwise="true"
        :speed="100"
        :color="gradientColor"
        :text="text"
      />
    </div>
    <div class="pay-btn">
      <div class="sum">
        <div class="fl pro-count">共计 {{ totalCount }} 件,</div>
        <div class="fl pro-total">合计 ￥{{ totalPrice }}</div>
      </div>
      <van-button
        class="fr"
        round
        block
        color="linear-gradient(to right, rgb(224 71 36 / 58%) , #e02e24)"
        @click="pay"
        >提交订单</van-button
      >
    </div>

    <van-popup v-model="isOpen" position="bottom" closeable>
      <div class="address-title-box">选择收货地址</div>
      <van-address-list
        v-model="chosenAddressId"
        :list="list"
        default-tag-text="默认"
        @select="selectAddress"
        @add="newAddress"
        @edit="onEdit"
      />
    </van-popup>
  </div>
</template>

<script>
import "../assets/less/pay.less";
export default {
  data() {
    return {
      isOpen: false,
      chosenAddressId: "",
      //地址列表数据
      list: [],
      //选择地址数据
      currentAddress: {
        name: "",
        tel: "",
        address: "",
      },
      //购物袋数据
      shopbagData: [],

      totalCount: 1,
      totalPrice: 0,

      goods_data: [],
      idStr: "",
      url: "/queryById",
      currentRate: 0,
      text: "正在支付",
      gradientColor: {
        "0%": "#3fecff",
        "100%": "#6149f6",
      },
      flag: false,
    };
  },

  created() {
    this.goods_data = JSON.parse(this.$route.query.goods_data);
    //获取订单id
     
    //判断是否为数组
    if (this.goods_data instanceof Array) {
      let goods_ids = [];
      this.goods_data.map((v) => {
        goods_ids.push(v.goods_id);
      });
      this.idStr = JSON.stringify(goods_ids);
      this.idStr = this.idStr.slice(1, this.idStr.length - 1);
      this.url = "/queryByBatchId";
    } else {
      this.idStr = this.goods_data.goods_id;
      this.totalCount = this.goods_data.count;
      this.totalPrice = this.goods_data.price * this.totalCount;
    }
    //获取收获地址
    this.getReceiveAddress();
    //获取订单数据
    this.getShopbagDataBySids();
  },

  methods: {
    handleUrl(url) {
      return require("@/static/" + url);
    },
    //返回上一级
    back() {
      this.$router.go(-1);
    },

    openAddressBox() {
      this.isOpen = true;
    },

    //选择地址
    selectAddress(item, index) {
      this.isOpen = false;
       
      for (let key in this.currentAddress) {
        this.currentAddress[key] = item[key];
      }
       
    },
    //编辑地址
    onEdit(item, index) {
       
      this.$router.push({
        name: "NewAddress",
        query: { id: item.id, isEdit: true },
      });
    },

    //新增地址
    newAddress() {
      this.$router.push({ name: "NewAddress" });
    },

    //查询收货地址
    getReceiveAddress() {
      let address = JSON.parse(localStorage.getItem("address"));
      if (!address) {
        this.$toast("目前还没有填写收货地址");
        this.isOpen = true;
        return;
      }
      address.map((v) => {
        let address = v.province + v.city + v.county + v.addressDetail;
        this.list.push({
          id: v.id,
          name: v.name,
          tel: v.tel,
          address,
          isDefault: Boolean(v.isDefault),
        });

        if (Boolean(v.isDefault)) {
          (this.chosenAddressId = v.id), (this.currentAddress.name = v.name);
          this.currentAddress.tel = v.tel;
          this.currentAddress.address = address;
        }
      });
       
    },

    //根据id查询购物袋数据
    getShopbagDataBySids() {
      if (!this.goods_data) {
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
        url: this.url,
        params: {
          id: this.idStr,
        },
      })
        .then((res) => {
          this.$toast.clear();
          this.shopbagData = res.data.result;
          //添加商品数量数据
          if (this.goods_data instanceof Array) {
            if (this.shopbagData.length == 1) {
              this.shopbagData[0].count = this.goods_data[0].count;
              this.totalPrice =
                this.goods_data[0].count * this.shopbagData[0].price;
              this.totalCount = this.goods_data[0].count;
            } else {
              this.shopbagData.forEach((v) => {
                this.goods_data.forEach((e) => {
                  if (v.id == e.goods_id) {
                    v.count = e.count;
                    this.totalPrice += v.count * v.price;
                    this.totalCount += v.count;
                  }
                });
              });
            }
          } else {
             
            this.shopbagData[0].count = this.goods_data.count;
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },

    //立即结算
    pay() {
      //判断是否选择地址
      if (this.chosenAddressId == "") {
         
        this.$toast("请选择收货地址");
        return;
      }
      this.flag = true;
      let that = this;
      setTimeout(function () {
        that.$router.push({
          name: "Order",
          query: { goods_data: that.goods_data },
        });
      }, 1000);
      if (this.goods_data instanceof Array) {
        //创建多个订单
        this.goods_data.forEach((v) => {
          this.axios({
            method: "GET", //请求的方式  get/post
            url: "/users/createOrder",
            params: {
              goods_id: v.goods_id,
              count: v.count,
              token: localStorage.getItem("userId")
            },
          })
            .then((response) => {
              this.hotData.push(response.data.result);
            })
            .catch((err) => {
               console.log(err)
            });
        });
      }
      //创建一个订单
      this.axios({
        method: "GET", //请求的方式  get/post
        url: "/users/createOrder",
        params: {
          goods_id: this.goods_data.goods_id,
          count: this.goods_data.count,
          token: localStorage.getItem("userId")
        },
      })
        .then((response) => {
          this.hotData = response.data.result;
        })
        .catch((err) => {
           
        });
    },
  },
};
</script>
