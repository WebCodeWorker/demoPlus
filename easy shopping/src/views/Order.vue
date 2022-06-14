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
            <div
              class="tab-item"
              v-for="(item, index) in orderDatas"
              :key="index"
            >
              <div class="clearfix tab-item-box">
                <div class="fr">
                  <div
                    class="text"
                    v-if="item.state == 1"
                    @click="confirmReceive(item, index)"
                  >
                    确认收货
                  </div>
                  <div class="text-box-tab" v-if="item.state == 2 && i != 3">
                    <div class="finished">已完成</div>
                    <div class="remove" @click="removeOrder(item, index)">
                      <van-icon name="delete" />
                    </div>
                  </div>
                  <div
                    class="text-box-tab"
                    v-if="item.isComment == 0 && i == 3"
                  >
                    <div class="finished" @click="goComment(item)">去评价</div>
                    <div class="remove" @click="goComment(item)">
                      <van-icon name="arrow" />
                    </div>
                  </div>
                </div>
              </div>

              <div class="order-box">
                <div>
                  <div class="clearfix cell-box">
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
                <div class="pro-box">
                  <div class="pro-boxing">
                    <div class="clearfix">
                      <div class="fl pro-count">
                        共计 {{ item.count }} 件商品
                      </div>
                      <div class="fr pro-total">
                        合计 ￥{{ item.count * item.price }}
                      </div>
                    </div>
                  </div>
                  <div class="left-box left"></div>
                  <div class="left-box right"></div>
                </div>
              </div>
            </div>
          </div>
          <div v-else>
            <div class="van-empty">
              <div class="van-empty__image">
                <img
                  src="https://fastly.jsdelivr.net/npm/@vant/assets/custom-empty-image.png"
                />
              </div>
              <p class="van-empty__description">
                暂无相关的订单数据，去逛一逛!
              </p>
              <van-button
                round
                color="linear-gradient(to right, rgb(224 71 36 / 58%) , #e02e24)"
                class="bottom-button"
                @click="goHome"
                >去逛一逛</van-button
              >
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import "../assets/less/order.less";
export default {
  data() {
    return {
      goods_data: [],
      n: "2020-08-13T02:18:50.000Z",
      tabIndex: 0,
      orderDatas: [],
      tabItems: [
        { title: "全部" },
        { title: "待收货" },
        { title: "已收货" },
        { title: "待评价" },
      ],
      userId: "",
    };
  },

  created() {
    this.getOrderData();
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (from.name == "WriteComment" && vm.$route.query.isComment) {
        setTimeout(() => {
          vm.$toast.success("评论完成");
        }, 20);
      }
      if (from.name == "Pay") {
        setTimeout(() => {
          vm.$toast.success("支付成功");
        }, 20);
      }
    });
  },

  methods: {
    handleUrl(url) {
      return require("@/static/" + url);
    },
    back() {
      if (Object.keys(this.$route.query).length > 0) {
        this.$router.push({ path: "Home" });
        return false;
      } else {
        this.$router.push({ name: "My" });
      }
    },

    goHome() {
      this.$router.push({ name: "Home" });
    },
    //去评论
    goComment(item) {
      this.$router.push({
        name: "WriteComment",
        query: { order_id: item.order_id, goods_id: item.goods_id },
      });
    },

    //获取当前用户订单数据
    getOrderData(name) {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });
      let status = name || false;
      //获取用户订单
      this.axios({
        method: "GET",
        url: "/users/queryAllOrder",
        params: { token: localStorage.getItem("userId") },
      }).then((res) => {
        this.$toast.clear();
        if (status || status != 0) {
          let arr = [];
          res.data.result.map((v) => {
            if (v.state == status) {
              arr.push(v);
            }
            //待评价
            if (v.isComment == 0 && status == 3 && v.state == 2) {
              arr.push(v);
            }
          });
          this.orderDatas = arr;
        } else {
          //全部订单数据
          this.orderDatas = res.data.result;
        }
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
        item.state = 2;
        this.$forceUpdate();
      }
      this.axios({
        method: "POST",
        url: "/users/update",
        params: {
          order_id: item.order_id,
        },
      }).catch((err) => {});
    },

    //删除订单
    removeOrder(item, index) {
      //删除当前点击订单
      this.orderDatas.splice(index, 1);
      this.axios({
        method: "POST",
        url: "/users/delete",
        params: {
          order_id: item.order_id,
        },
      })
        .then((res) => {
          this.$toast.success("已删除订单");
        })
        .catch((err) => {});
    },
  },
};
</script>
