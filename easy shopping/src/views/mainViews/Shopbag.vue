<template>
  <div class="shopbag">
    <van-nav-bar
      title="购物车"
      left-arrow
      :fixed="true"
      @click-left="goBack"
      @click-right="editProduct"
    >
      <template #right>
        <img :src="isEdit ? editImg.edited : editImg.edit" alt />
      </template>
    </van-nav-bar>

    <div class="product" v-if="shopbagData.length > 0">
      <van-swipe-cell
        :disabled="!isEdit"
        v-for="(item, index) in shopbagData"
        :key="index"
      >
        <van-cell :border="false">
          <div class="clearfix cell-box">
            <div class="fl check">
              <van-checkbox
                v-model="item.isCheck"
                icon-size="20px"
                checked-color="#e02e24"
                @change="simpleSelect(item)"
              ></van-checkbox>
            </div>
            <div class="fl pro-img">
              <img
                class="auto-img"
                :src="handleUrl(item.productData.goods_image_url)"
                alt
              />
            </div>
            <div class="fl pro-info">
              <div class="text-box">
                <div class="clearfix">
                  <div class="text-name van-multi-ellipsis--l2">
                    {{ item.productData.goods_name }}
                  </div>
                  <div class="price">￥{{ item.productData.price }}</div>
                </div>
                <van-icon class="fl" name="shop-o" />
                <div class="fl text-enname">
                  {{ item.productData.mall_name }}
                </div>
              </div>
              <div class="price-box">
                <div class="">
                  <van-stepper
                    v-model="item.count"
                    button-size="26"
                    disable-input
                    @change="modifyCount(item)"
                  />
                </div>
              </div>
            </div>
          </div>
        </van-cell>
        <template #right>
          <van-button
            square
            color="#e02e24"
            text="删除"
            @click="removeOneShopbag(item, index)"
          />
        </template>
      </van-swipe-cell>
      <div>
        <van-submit-bar
          v-show="!isEdit"
          :price="totalPrice"
          button-text="结算"
          button-color="linear-gradient(to right, rgb(224 71 36 / 58%) , #e02e24)"
          @submit="commit"
        >
          <van-checkbox
            @click="allSelect"
            v-model="allCheck"
            icon-size="20px"
            checked-color="#e02e24"
            >全选</van-checkbox
          >
        </van-submit-bar>
        <van-submit-bar
          v-show="isEdit"
          button-text="删除选择"
          button-color="#e02e24"
          @submit="removeMoreShopbag"
        >
          <van-checkbox
            v-model="allCheck"
            @click="allSelect"
            icon-size="20px"
            checked-color="#e02e24"
            class="compeleted"
            >全选</van-checkbox
          >
        </van-submit-bar>
      </div>
    </div>
    <div v-else>
      <div class="van-empty">
        <div class="van-empty__image">
          <img
            src="https://fastly.jsdelivr.net/npm/@vant/assets/custom-empty-image.png"
          />
        </div>
        <p class="van-empty__description">购物车空空如也，去逛一逛</p>
        <van-button
          round
          color="linear-gradient(to right, rgb(224 71 36 / 58%) , #e02e24)"
          class="bottom-button"
          @click="goHome"
          >去逛一逛</van-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import "../../assets/less/shopbag.less";
export default {
  data() {
    return {
      isEdit: false,
      allCheck: false,
      shopbagData: [],
      total: 0,
      // isCheck: false,
      count: 0,
      editImg: {
        edited: require("../../assets/images/edited.png"),
        edit: require("../../assets/images/edit.png"),
      },
    };
  },
  computed: {
    totalPrice() {
      return this.total * 100;
    },
  },

  created() {
    this.findShopbag();
  },
  beforeRouteEnter(to, from, next) {
    //获取token字符串
    let tokenString = localStorage.getItem("CSTK");
    //判断是否已经登录
    if (!tokenString) {
      next({ name: "Login" });
    } else {
      next();
    }
  },
  methods: {
    handleUrl(url) {
      return require("@/static/" + url);
    },
    //提交订单
    commit() {
      //查找需要购买的商品，goods_id
      let flag = false;
      let goods_data = [];
      this.shopbagData.map((v) => {
        if (v.isCheck) {
          flag = true;
          goods_data.push({ goods_id: v.productData.id, count: v.count });
        }
      });
      if (!flag) {
        return;
      }
      // 携带参数跳转路由到pay页面
      this.$router.push({
        name: "Pay",
        query: { goods_data: JSON.stringify(goods_data) },
      });
    },
    goHome() {
      this.$router.push({ name: "Home" });
    },
    goBack() {
      this.$router.go(-1);
    },
    //编辑商品
    editProduct() {
      this.isEdit = !this.isEdit;
    },
    //查询购物袋数据
    findShopbag() {
      this.shopbagData = JSON.parse(localStorage.getItem("goods_data"));
      if (!this.shopbagData) {
        this.shopbagData = [];
      }
    },
    //全选
    allSelect() {
      let that = this;
      this.shopbagData.map((v) => {
        that.$set(v, "isCheck", that.allCheck);
      });
    },
    //单选
    simpleSelect(item) {
      if (item.isCheck) {
        this.total = item.count * item.productData.price + this.total;
      } else {
        this.total = this.total - item.count * item.productData.price;
      }

      for (let i = 0; i < this.shopbagData.length; i++) {
        if (!this.shopbagData[i].isCheck) {
          this.allCheck = false;
          return;
        }
      }
      this.allCheck = true;
    },

    //修改商品数量
    modifyCount(item) {
      this.shopbagData.count = item.count;
      let datas = JSON.parse(localStorage.getItem("goods_data"));
      datas.map((v) => {
        if (item.productData.id == v.productData.id) {
          v.count = item.count;
          return;
        }
      });
      localStorage.setItem("goods_data", JSON.stringify(datas));
    },

    //删除购物袋数据
    removeShopbag(ids) {
      let data = JSON.parse(localStorage.getItem("goods_data"));
      //删除单个购物车数据
      if (typeof ids == "string") {
        data.map((v, i) => {
          if (v.productData.id == ids) {
            data.splice(i, 1);
          }
        });
      } else {
        //删除多个购物车数据

        ids.map((e) => {
          data.map((v, i) => {
            if (e == v.productData.id) {
              data.splice(i, 1);
            }
          });
        });
      }
      localStorage.setItem("goods_data", JSON.stringify(data));
    },

    //删除单个购物袋
    removeOneShopbag(item, index) {
      this.removeShopbag(item.productData.id);

      this.shopbagData.splice(index, 1);
    },

    //删除多个购物袋
    removeMoreShopbag() {
      //查找选择购物袋
      let goods_ids = [];
      this.shopbagData.map((v) => {
        if (v.isCheck) {
          goods_ids.push(v.productData.id);
        }
      });

      this.removeShopbag(goods_ids);

      for (let i = this.shopbagData.length - 1; i >= 0; i--) {
        if (this.shopbagData[i].isCheck) {
          this.shopbagData.splice(i, 1);
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
.compeleted {
  padding-right: 177px;
}
</style>
