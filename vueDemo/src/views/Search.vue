<template>
  <div class="search">
    <div class="search-box">
      <div class="icon">
        <van-icon size="22px" class="fl icon" name="arrow-left" @click="back" />
      </div>
      <van-search
        class="fl"
        input-align="center"
        placeholder="请输入商品名称"
        fixded
        shape="round"
        show-action
        @input="inputValue"
        v-model="keyword"
      >
        <template #action>
          <div @click="getSearch(0)">搜索</div>
        </template>
      </van-search>
    </div>
    <div v-if="!isActive" class="search-history">
      <div class="history-box">
        <div class="clearfix">
          <div class="fl history-title">搜索历史</div>
          <img class="fr" @click="delHistory" src="../assets/images/del.png" alt />
        </div>
        <van-tag
          round
          color="#fff"
          size="large"
          type="primary"
          v-for="(item,index) in historyData"
          :key="index"
          @click="searchHistory(item)"
        >{{item}}</van-tag>
      </div>
    </div>
    <div ref="text" v-show="isActive" class="sort">
      <div class="sort-box">
        <div class="sort-item">
          <van-dropdown-menu active-color="#e02e24">
            <van-dropdown-item v-model="value" :options="option" @change="toggle" />
          </van-dropdown-menu>
        </div>
        <div class="sort-item" @click="toggleSale" ref="list">销量</div>

        <div class="sort-item">
          <img
            @click="toggleLayout"
            :src="gongge ? require('../assets/images/gongge.png') : require('../assets/images/liebiao.png')"
            alt
          />
          <span class="screen" is-link @click="showPopup">筛选</span>
          <van-popup v-model="show" position="top" :style="{ height: '30%' }">
            <div class="screen-title">价格区间(元)</div>
            <div class="screen-box">
              <van-field input-align="center" v-model="minPrice" placeholder="最低价" />
              <div class="line"></div>
              <van-field input-align="center" v-model="maxPrice" placeholder="最高价" />
            </div>
            <div class="btn">
              <van-button @click="reset" class="bnt-text" color="#fff">重置</van-button>
              <van-button @click="complete" color="#e02e24">完成</van-button>
            </div>
          </van-popup>
        </div>
      </div>
    </div>

    <div v-if="isActive">
      <div v-if="gongge" class="banner">
        <div class="fl tab-item" v-for="(v, i) in searchData" :key="i" @click="goDetail(v)">
          <img class="auto-img" @load="goodsListItemImg" v-lazy="loading ? require('../assets/images/loading.gif') : v.goods_image_url" />
          <div class="title">{{v.goods_name}}</div>
          <div class="detail clearfix">
            <div class="fl price">
              <span class="money">￥</span>
              {{v.min_group_price}}
            </div>
            <div class="fl saled">已拼{{v.sales_tip}}件</div>
          </div>
        </div>
      </div>

      <div v-if="liebiao" class="banner-liebiao">
        <div class="banner-list clearfix" v-for="(v,index) in searchData" :key="index" @click="goDetail(v)">
          <div class="list-box">
            <img class="fl auto-img" @load="goodsListItemImg" v-lazy="loading ? require('../assets/images/loading.gif') : v.goods_image_url" alt />
            <div class="fl list-info">
              <div class="list-text">
                <div class="goods_name">{{v.goods_name}}</div>
                <div class="price-info clearfix">
                  <div class="fl price">
                    <span class="money">￥</span>
                    {{v.min_group_price}}
                  </div>
                  <div class="fl saled">已拼{{v.sales_tip}}件</div>
                </div>
                <div class="mall-name">{{v.mall_name}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/less/search.less";
export default {
  data() {
    return {
      keyword: "",
      loading: true,
      searchData: [],
      arrHistory: [],
      value: 0,
      isActive: false,
      gongge: true,
      liebiao: false,
      show: false,
      minPrice: "",
      maxPrice: "",
      option: [
        { text: "综合", value: 0 },
        { text: "评分", value: 1 },
        { text: "价格降序", value: 3 },
        { text: "价格升序", value: 4 },
      ],
      historyData: [],
    };
  },
  

  created() {
    
    if (this.$route.query.str) {
      this.keyword = JSON.parse(this.$route.query.str);
      this.getSearch(0);
      this.isActive = true;
    }
    //从本地获取搜索历史数据
    this.historyData = JSON.parse(localStorage.getItem("historyData"));
  },

  methods: {
     goodsListItemImg(){
      console.log("图片加载完成")
      this.loading = false;
    },
    back() {
      this.$router.go(-1);
    },

    goDetail(v) {
      this.$router.push({ name: "Detail", query: { goods: v.goods_id } });
    },

    //清除搜索历史
    delHistory() {
      this.historyData = [];
      localStorage.removeItem("historyData");
    },

    //历史搜索
    searchHistory(item) {
      this.isActive = true;

      this.keyword = item;
      this.getSearch(0);
    },

    showPopup() {
      this.show = true;
    },
    reset() {
      this.minPrice = "";
      this.maxPrice = "";
    },
    complete() {
      this.show = false;
      if (
        this.maxPrice == "" ||
        this.minPrice == "" ||
        this.minPrice >= this.maxPrice
      ) {
        return;
      }
      this.getSearch(this.value);
      
    },

    //切换排序类型
    toggle() {
      this.$refs.list.style.color = "#222";
      this.getSearch(this.value);
    },
    toggleSale() {
      this.value = 0;
      this.$refs.list.style.color = "#e02e24";
      this.getSearch(2);
    },

    //切换商品排列布局方式
    toggleLayout() {
      if (this.gongge) {
        this.gongge = false;
        this.liebiao = true;
      } else {
        this.gongge = true;
        this.liebiao = false;
      }
    },

    inputValue() {
      
      if (this.keyword !== "") {
        this.isActive = true;
      } else {
        this.isActive = false;
        this.searchData = [];
      }
    },
    //搜索商品
    getSearch(value) {
      //添加历史记录
      //判断本地是否有数据
      let isData = JSON.parse(localStorage.getItem("historyData"))
      if(isData == null){
        //存储json数据
        let data = []
        localStorage.setItem("historyData", JSON.stringify(data));
      }

      //当需要添加、更新数据，获取本地json、解析、编辑，再放回本地
      let datas = JSON.parse(localStorage.getItem("historyData"))
      datas.unshift(this.keyword)
      
      
      localStorage.setItem("historyData",JSON.stringify(datas))

     
      //从本地获取搜索历史数据
      this.historyData = JSON.parse(localStorage.getItem("historyData"));
      
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });
      this.axios({
        method: "GET", //请求的方式  get/post
        url: "/2260-10",
        params: {
          showapi_appid: this.showapi_appid,
          showapi_sign: this.secret,
          keyword: this.keyword,
          sort: value,
          start_price: this.minPrice,
          end_price: this.maxPrice,
        },
      })
        .then((response) => {
          this.$toast.clear();
          let data = JSON.parse(response.data.showapi_res_body.ret_body);

          

          //修改数据
          data.goods_list.map((v) => {
            v.min_group_price = (v.min_group_price / 100).toFixed(2);
          });
          this.searchData = data.goods_list;
          
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