<template>
  <div class="search">
    <div class="search-box">
      <div class="icon">
        <van-icon
          size="22px"
          class="fl icons"
          name="arrow-left"
          @click="back"
        />
      </div>
      <van-search
        input-align="center"
        placeholder="请输入商品名称"
        fixded
        shape="round"
        show-action
        @input="inputValue"
        v-model="keyword"
      >
        <template #action>
          <div @click="getSearch()">搜索</div>
        </template>
      </van-search>
    </div>
    <div v-if="!isActive" class="search-history">
      <div class="history-box">
        <div class="clearfix">
          <div class="fl history-title">搜索历史</div>
          <img
            class="fr"
            @click="delHistory"
            src="../assets/images/del.png"
            alt
          />
        </div>
        <van-tag
          round
          color="#fff"
          size="large"
          type="primary"
          v-for="(item, index) in historyData"
          :key="index"
          @click="searchHistory(item)"
          >{{ item }}</van-tag
        >
      </div>
    </div>
    <div v-if="hasData">
      <div v-show="isActive" class="sort">
        <div class="sort-box">
          <div class="sort-item">
            <van-dropdown-menu ref="menus" active-color="#e02e24">
              <van-dropdown-item
                v-model="value"
                :options="option"
                @change="toggle"
              />
            </van-dropdown-menu>
          </div>
          <div
            class="sort-item"
            @click="toggleSale"
            :style="{ color: slaeColor }"
          >
            销量
          </div>

          <div class="sort-item">
            <img
              @click="toggleLayout"
              :src="
                gongge
                  ? require('../assets/images/gongge.png')
                  : require('../assets/images/liebiao.png')
              "
              alt
            />
            <span class="screen" is-link @click="showPopup">筛选</span>
            <van-popup v-model="show" position="top" :style="{ height: '30%' }">
              <div class="screen-title">价格区间(元)</div>
              <div class="screen-box">
                <input
                  type="number"
                  class="minPrice"
                  placeholder="最低价"
                  v-model="minPrice"
                  onkeyup="this.value= this.value.match(/\d+(\.\d{0,2})?/) ? this.value.match(/\d+(\.\d{0,2})?/)[0] : ''"
                />
                <div class="line"></div>
                <input
                  type="number"
                  class="maxPrice"
                  placeholder="最高价"
                  v-model="maxPrice"
                  onkeyup="this.value= this.value.match(/\d+(\.\d{0,2})?/) ? this.value.match(/\d+(\.\d{0,2})?/)[0] : ''"
                />
              </div>
              <div class="btn">
                <van-button @click="reset" class="bnt-text">重置</van-button>
                <van-button @click="complete" color="#e02e24">完成</van-button>
              </div>
            </van-popup>
          </div>
        </div>
      </div>
      <div v-if="isActive">
        <div v-if="gongge" class="banner">
          <div
            class="fl tab-item"
            v-for="(v, i) in searchData"
            :key="i"
            @click="goDetail(v)"
          >
            <img
              class="auto-img"
              @load="goodsListItemImg"
              v-lazy="
                loading
                  ? require('../assets/images/loading.gif')
                  : handleUrl(v.goods_image_url)
              "
            />
            <div class="title">{{ v.goods_name }}</div>
            <div class="detail clearfix">
              <div class="fl price">
                <span class="money">￥</span>
                {{ v.price }}
              </div>
              <div class="fl saled">已售{{ v.sales_tip }}件</div>
            </div>
            <div class="comment">
              {{ v.comment_count }}条评价&nbsp;{{ v.favorable_rate }}%好评
            </div>
          </div>
        </div>

        <div v-if="liebiao" class="banner-liebiao">
          <div
            class="banner-list clearfix"
            v-for="(v, index) in searchData"
            :key="index"
            @click="goDetail(v)"
          >
            <div class="list-box">
              <img
                class="fl auto-img"
                @load="goodsListItemImg"
                v-lazy="
                  loading
                    ? require('../assets/images/loading.gif')
                    : handleUrl(v.goods_image_url)
                "
                alt
              />
              <div class="fl list-info">
                <div class="list-text">
                  <div class="goods_name">{{ v.goods_name }}</div>
                  <div class="price-info clearfix">
                    <div class="fl price">
                      <span class="money">￥</span>
                      {{ v.price }}
                    </div>
                    <div class="fl saled">已售{{ v.sales_tip }}件</div>
                  </div>
                  <div class="mall-name">{{ v.mall_name }}</div>
                  <div class="comment">
                    {{ v.comment_count }}条评价&nbsp;{{ v.favorable_rate }}%好评
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!hasData">
      <div class="van-empty">
        <div class="van-empty__image">
          <img
            src="https://fastly.jsdelivr.net/npm/@vant/assets/custom-empty-image.png"
          />
        </div>
        <p class="van-empty__description">啊额，没有找到相关的商品！</p>
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
        { text: "价格降序", value: 2 },
        { text: "价格升序", value: 3 },
      ],
      historyData: [],
      slaeColor: "#323233",
      hasData: true,
    };
  },

  created() {
    if (this.$route.query.value) {
      this.keyword = this.$route.query.value;
      this.isActive = true;
      this.getSearch();
    }
    //从本地获取搜索历史数据
    this.historyData = JSON.parse(localStorage.getItem("historyData"));
  },

  methods: {
    goHome() {
      this.$router.push({ name: "Home" });
    },
    handleUrl(url) {
      return require("@/static/" + url);
    },
    goodsListItemImg() {
      this.loading = false;
    },
    back() {
      this.$router.go(-1);
    },

    goDetail(v) {
      this.$router.push({ name: "Detail", query: { goods_id: v.id } });
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
      this.getSearch();
    },

    showPopup() {
      this.show = true;
    },
    reset() {
      this.minPrice = "";
      this.maxPrice = "";
    },
    //价格筛选
    filters() {
      this.searchData = this.searchData.filter(
        (e) => e.price >= this.minPrice && e.price <= this.maxPrice
      );
    },
    complete() {
      if (
        (this.minPrice === "" && this.maxPrice === "") ||
        this.minPrice > this.maxPrice
      ) {
        return;
      }
      this.getSearch("filter")
      this.show = false;
    },

    //切换排序类型
    toggle() {
      this.slaeColor = "#323233";
      this.$refs.menus.$refs.bar.children[0].children[0].style.color =
        "#e02e24";
      switch (this.value) {
        case 0:
          this.getSearch();
          break;
        case 1:
          //商品评分由高到低排序
          this.searchData = this.searchData.sort((a, b) => {
            return b.favorable_rate - a.favorable_rate;
          });
          break;
        case 2:
          //价格降序
          this.searchData = this.searchData.sort((a, b) => {
            return b.price - a.price;
          });

          break;
        case 3:
          //价格升序
          this.searchData = this.searchData.sort((a, b) => {
            return a.price - b.price;
          });

          break;
      }
    },
    //按销量排序
    toggleSale() {
      this.value = 0;
      this.slaeColor = "#e02e24";
      this.$refs.menus.$refs.bar.children[0].children[0].style.color =
        "#323233";
      this.searchData = this.searchData.sort((a, b) => {
        return b.sales_tip - a.sales_tip;
      });
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
      if (!this.keyword) {
        return;
      }
      //添加历史记录
      //判断本地是否有数据
      let isData = JSON.parse(localStorage.getItem("historyData"));
      if (isData == null) {
        //存储json数据
        let data = [];
        localStorage.setItem("historyData", JSON.stringify(data));
      }

      //当需要添加、更新数据，获取本地json、解析、编辑，再放回本地
      let datas = JSON.parse(localStorage.getItem("historyData"));

      datas.unshift(this.keyword);
      //数组去重
      datas = [...new Set(datas)];

      localStorage.setItem("historyData", JSON.stringify(datas));

      //从本地获取搜索历史数据
      this.historyData = JSON.parse(localStorage.getItem("historyData"));
      // this.historyData = [...new Set(this.historyData)]

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });
      this.axios({
        method: "GET",
        url: "/queryByName",
        params: {
          keyword: this.keyword,
        },
      })
        .then((response) => {
          this.$toast.clear();
          this.searchData = response.data.result;
          if (this.searchData.length == 0) {
            this.hasData = false;
            return;
          }
          this.hasData = true;
          //综合排序分：价格*(-0.1)+销量*0.6+好评率*0.5
          this.searchData.forEach((v) => {
            v.weighted_average_score =
              v.price * 0.1 * -1 + v.sales_tip * 0.6 + v.favorable_rate * 0.5;
          });

          this.searchData = this.searchData.sort((a, b) => {
            return b.weighted_average_score - a.weighted_average_score;
          });

          //价格筛选
          console.log(value)
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },
  },
};
</script>

<style lang="less">
.icons {
  line-height: 55px;
}
.van-tag {
  background: #ebedf0;
  color: #646566;
  margin: 5px;
}
.van-dropdown-menu__bar {
  box-shadow: none;
  height: 39px;
}
.screen-box input {
  border: none;
  text-align: center;
  background: #f6f6f6;
  border-radius: 20px;
  width: 100px;
  height: 25px;
}
.screen-box {
  position: relative;
}
.minPrice {
  position: absolute;
  left: 43px;
}
.maxPrice {
  position: absolute;
  right: 43px;
}
.btn {
  margin-top: 110px;
}
.van-empty__image {
  margin-top: 50px;
}
</style>
