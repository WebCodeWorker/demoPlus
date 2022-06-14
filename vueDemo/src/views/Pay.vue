<template>
  <div class="pay">
    <van-nav-bar title="确认订单" left-arrow :fixed="true" placeholder @click-left="back" />

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
            <div class="fl name">{{currentAddress.name}}</div>
            <div class="fl phone">{{currentAddress.tel}}</div>
          </div>
          <div class="address-info">{{currentAddress.address}}</div>
        </div>
      </div>
    </div>

    <div class="order-info">
      <div class="order-box">
        <div class="order-title">订单信息</div>

        <div>
          <div class="clearfix cell-box" v-for="(item, index) in shopbagData" :key="index">
            <div class="fl pro-img">
              <img class="auto-img" :src="item.goods_pic" alt />
            </div>
            <div class="fl pro-info">
              <div class="text-box">
                <div class="clearfix">
                  <div class="text-name van-multi-ellipsis--l2">{{item.goods_name}}</div>
                  <div class="price">￥{{item.min_group_price}}</div>
                </div>
                <van-icon class="fl" name="shop-o" />
                <div class="fl text-enname">{{item.mall_name}}</div>
              </div>
              <div class="price-box">
                <div class="fr count">x{{item.count}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="pay-btn">
      <div class="sum">
        <div class="fl pro-count">共计 {{product.count}} 件,</div>
        <div class="fl pro-total">合计 ￥{{product.total}}</div>
      </div>
      <van-button
        class="fr"
        round
        block
        color="linear-gradient(to right, rgb(224 71 36 / 58%) , #e02e24)"
        @click="pay"
      >提交订单</van-button>
    </div>

    <van-popup v-model="isOpen" position="bottom" closeable>
      <div class="address-title-box">选择收货地址</div>
      <van-address-list
        v-model="chosenAddressId"
        :list="list"
        default-tag-text="默认"
        @select="selectAddress"
        @add="newAddress"
      />
    </van-popup>
  </div>
</template>

<script>
import "../assets/less/pay.less";
import { utils } from "../assets/js/utils";
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

      product: {
        count: 0,
        total: 0,
      },

      goods_data: [],
    };
  },

  created() {
    this.goods_data = this.$route.query.goods_data;
    
    this.getReceiveAddress();

    this.getShopbagDataBySids();
  },

  

  methods: {
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
          id: v.aid,
          name: v.name,
          tel: v.tel,
          address,
          isDefault: Boolean(v.isDefault),
        });

        if (Boolean(v.isDefault)) {
          (this.chosenAddressId = v.aid), (this.currentAddress.name = v.name);
          this.currentAddress.tel = v.tel;
          this.currentAddress.address = address;
        }
      });
    },

    //根据id查询购物袋数据
    getShopbagDataBySids() {
      //获取token字符串
      if (!this.goods_data) {
        return;
      }

      let goods_ids = "";

      if (typeof this.goods_data === "string") {
        goods_ids = this.goods_data;
        
      } else {
        this.goods_data.map((v) => {
          goods_ids += v.goods_id + ",";
        });
      }
        

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });

      this.axios({
        method: "GET",
        url: "/2260-9",
        params: {
          showapi_appid: this.showapi_appid,
          showapi_sign: this.secret,
          goods_ids: goods_ids,
        },
      })
        .then((result) => {
          this.$toast.clear();

          let data = JSON.parse(result.data.showapi_res_body.ret_body);

          // 修改数据
          data.map((v) => {
            v.min_group_price = v.min_group_price / 100;
          });

          this.shopbagData = data;

          for (let i = 0; i < this.shopbagData.length; i++) {
            this.shopbagData[i].count = this.goods_data[i].count;
          }

          this.shopbagData.map((v) => {
            this.product.count += v.count;
            this.product.total += v.count * v.min_group_price;
          });

          let month = new Date().getMonth() + 1
           //判断本地是否有数据
        let isData = JSON.parse(localStorage.getItem("Expenses"));
        if (isData == null) {
          //存储json数据
          let data = [];
          localStorage.setItem("Expenses", JSON.stringify(data));
        }

        //当需要添加、更新数据，获取本地json、解析、编辑，再放回本地
        let datas = JSON.parse(localStorage.getItem("Expenses"));
        datas.unshift({time:month, money:this.product.total});
     
        
        localStorage.setItem("Expenses", JSON.stringify(datas));
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

      this.$router.push({
        name: "Order",
        query: { goods_data: this.goods_data },
      });
    },
  },
};
</script>
 