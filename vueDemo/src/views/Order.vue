<template>
  <div class="order">
    <van-nav-bar title="我的订单" left-arrow :fixed="true" @click-left="back" />
    <div class="order-bg"></div>
    <div class="tab-box">
      <van-tabs
        class="tabs-box"
        v-model="tabIndex"
        color="#e02e24"
        line-height="2px"
        title-active-color="#e02e24"
        @change="toggleStatus"
      >
        <van-tab :title="v.title" v-for="(v, i) in tabItems" :key="i">
          <div v-if="orderDatas.length > 0">
            <div class="tab-item" v-for="(item, index) in orderDatas" :key="index">
              <div class="clearfix tab-item-box">
                <div class="fr">
                  <div
                    class="text"
                    v-if="item.status == 1"
                    @click="confirmReceive(item, index)"
                  >确认收货</div>
                  <div class="text-box-tab" v-else>
                    <div class="finished">已完成</div>
                    <div class="remove" @click="removeOrder(item.orderId, index)">
                      <van-icon name="delete" />
                    </div>
                  </div>
                </div>
              </div>

              <div class="order-box">
                <div>
                  <div class="clearfix cell-box">
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
                <div class="pro-box">
                  <div class="pro-boxing">
                    <div class="clearfix">
                      <div class="fl pro-count">共计 {{item.count}} 件商品</div>
                      <div class="fr pro-total">合计 ￥{{item.count*item.min_group_price}}</div>
                    </div>
                  </div>
                  <div class="left-box left"></div>
                  <div class="left-box right"></div>
                </div>
              </div>
            </div>
          </div>
          <div v-else>
            <van-empty description="订单数据空空如也，去逛一逛!">
              <van-button
                round
                color="linear-gradient(to right, rgb(224 71 36 / 58%) , #e02e24)"
                class="bottom-button"
                @click="goMenu"
              >去逛一逛</van-button>
            </van-empty>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import "../assets/less/order.less";

import { utils } from "../assets/js/utils";

export default {
  data() {
    return {
      goods_data: [],
      n: "2020-08-13T02:18:50.000Z",
      tabIndex: 0,
      orderDatas: [],
      tabItems: [{ title: "全部" }, { title: "待收货" }, { title: "已收货" }],
    };
  },

  created() {
    this.getOrderData();
  },

  methods: {
    back() {
      this.$router.push({name:"Home"});
    },

    goMenu() {
      this.$router.push({ name: "Menu" });
    },

    //获取订单数据
    getOrderData() {
      this.goods_data = this.$route.query.goods_data;
      
      let goods_ids = "";
      if (!this.goods_data) {
        return;
      }
      this.goods_data.map((v) => {
        goods_ids += v.goods_id + ",";
      });
      
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
          this.orderDatas = [];
          this.$toast.clear();

          let orderData = {};
          let data = JSON.parse(result.data.showapi_res_body.ret_body);
          // 修改数据
          data.map((v) => {
            v.min_group_price = v.min_group_price / 100;
          });
          for (let i = 0; i < data.length; i++) {
            data[i].count = this.goods_data[i].count;
            data[i].status = 1;
          }
          

          this.orderDatas = data;
          
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },

    //切换订单状态
    toggleStatus(name) {
      this.getOrderData(name);
    },

    //确认收货
    confirmReceive(item, index) {
      
      if (this.tabIndex == 1) {
        //进行中,去掉当前点击的订单的数据
        this.orderDatas.splice(index, 1);
      } else {
        item.status = 2;
        this.$forceUpdate();
      }
    },

    //删除订单
    removeOrder(oid, index) {
      //删除当前点击订单
      this.orderDatas.splice(index, 1);
    },
  },
};
</script>
