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

    <div class="product" v-if="shopbagData.length>0">
      <van-swipe-cell :disabled="!isEdit" v-for="(item,index) in shopbagData" :key="index">
        <van-cell :border="false">
          <div class="clearfix cell-box">
            <div class="fl check">
              <van-checkbox
                v-model="item.isCheck"
                icon-size="20px"
                checked-color="#e02e24"
                @change="simpleSelect"
              ></van-checkbox>
            </div>
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
          <van-button square color="#e02e24" text="删除" @click="removeOneShopbag(item,index)" />
        </template>
      </van-swipe-cell>
      <div>
        <van-submit-bar
          v-show="!isEdit"
          :price="total"
          button-text="结算"
          button-color="linear-gradient(to right, rgb(224 71 36 / 58%) , #e02e24)"
          @submit="commit"
        >
          <van-checkbox
            @click="allSelect"
            v-model="allCheck"
            icon-size="20px"
            checked-color="#e02e24"
          >全选</van-checkbox>
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
          >全选</van-checkbox>
        </van-submit-bar>
      </div>
    </div>
    <div v-else>
      <van-empty description="购物车空空如也,去逛一逛!">
        <van-button round color="#e02e24" class="bottom-button" @click="goMenu">去逛一逛</van-button>
      </van-empty>
    </div>
  </div>
</template>

<script>
import "../../assets/less/shopbag.less";
import { utils } from "../../assets/js/utils";
export default {
  data() {
    return {
      isEdit: false,
      allCheck: false,
      shopbagData: [],
      total: 0,
      count: 0,
      editImg: {
        edited: require("../../assets/images/edited.png"),
        edit: require("../../assets/images/edit.png"),
      },
    };
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
      }else{
        next()
      }
  },
  methods: {
    //提交订单
    commit() {
      //查找需要购买的商品，goods_id
      let goods_data = [];
      this.shopbagData.map((v) => {
        if (v.isCheck) {
          goods_data.push({goods_id:v.goods_id,count:v.count});
        }
      });
      
      // 携带参数跳转路由到pay页面
      let datas = JSON.parse(localStorage.getItem("goods_id_car"));

      this.$router.push({ name: "Pay", query: {goods_data:goods_data}  });
    },
    goMenu() {
      this.$router.push({ name: "Menu" });
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
      let datas = JSON.parse(localStorage.getItem("goods_id_car"));
      // 去重
      for(let i=0;i<datas.length;i++){
        for(let j=i+1;j<datas.length;j++){
          if(datas[i].goods_id == datas[j].goods_id ){
            if(datas[i].count > datas[j].count){
               datas.splice(j,1)
              j--;
            }else if(datas[i].count <= datas[j].count){
               datas.splice(i,1)
              j--;
            }
           
          }
        }
      }

      //数组倒序
      // let datas1 = [];
      // let j=0;
      // for(let i = datas.length - 1;i>=0;i--){
      //   datas1[j] = datas[i];
      //   j++;
      // }
      // datas = datas1;

      let badges = JSON.parse(localStorage.getItem("badges"));
      //购物车总数
      let counts = 0;
      datas.map(v=>{
        counts += v.count
      })
      localStorage.setItem("badges",JSON.stringify(counts))
      localStorage.setItem("goods_id_car",JSON.stringify(datas))
      
      let goods_id_data = '';
      datas.map(v=>{ 
        
        goods_id_data += v.goods_id+','
      })
      
      
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
          goods_ids: goods_id_data,
        },
      })
        .then((response) => {
          this.$toast.clear();
          let data = JSON.parse(response.data.showapi_res_body.ret_body);

          // 修改数据
          data.map((v) => {
            v.min_group_price = v.min_group_price / 100;
          });
          this.shopbagData = data;
          for(let i=0;i< this.shopbagData.length;i++){
              this.shopbagData[i].count = datas[i].count
          }
          
          
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    //计算总金额
    sum() {
      // 每次调用重新赋零
      this.total = 0;
      this.shopbagData.map((v) => {
        if (v.isCheck) {
          this.total +=  v.count*v.min_group_price;
        }
      });

      this.total *= 100;
      
    },
    //全选
    allSelect() {
      this.shopbagData.map((v) => {
        v.isCheck = this.allCheck;
        
      });
      this.sum();
    },
    //单选
    simpleSelect() {
      this.sum();
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
      this.sum();
      this.shopbagData.count = item.count;
      let datas = JSON.parse(localStorage.getItem("goods_id_car"))
      datas.map(v=>{
        if(item.goods_id == v.goods_id){
          v.count = item.count;
          return;
        }
      })

      localStorage.setItem("goods_id_car",JSON.stringify(datas))

    },

    //删除购物袋数据
    removeShopbag(id) {
      let data = JSON.parse(localStorage.getItem("goods_id_car"));
      
      if (typeof id == "string" || typeof id == "number") {
        let indexs = (data || []).findIndex((item) => item === id);

        data.splice(indexs, 1);

        localStorage.setItem("goods_id_car", JSON.stringify(data));

        
      } else {
        id.map((v) => {
          let indexs = (data || []).findIndex((item) => item === v);

          data.splice(indexs, 1);

          localStorage.setItem("goods_id_car", JSON.stringify(data));

          
        });
      }
    },

    //单个删除购物袋
    removeOneShopbag(item, index) {
      
      this.removeShopbag(item.goods_id);

      this.shopbagData.splice(index, 1);

      this.sum();
    },

    //删除多个购物袋
    removeMoreShopbag() {
      //查找选择购物袋
      let goods_ids = [];
      this.shopbagData.map((v) => {
        if (v.isCheck) {
          goods_ids.push(v.goods_id);
        }
      });

      this.removeShopbag(goods_ids);

      for (let i = this.shopbagData.length - 1; i >= 0; i--) {
        if (this.shopbagData[i].isCheck) {
          this.shopbagData.splice(i, 1);
        }
      }

      this.sum();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>