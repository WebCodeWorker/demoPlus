<template>
  <div class="menu">
    <div class="title">分类</div>
    <div class="search-box">
      <van-search
        input-align="center"
        placeholder="请输入商品名称"
        fixded
        shape="round"
        @click="search"
      ></van-search>
    </div>
    <div class="banner">
      <van-tree-select
        height="140vw"
        :items="items"
        :main-active-index.sync="active"
      >
        <template #content>
          <ul>
            <li v-for="(item, index) in items[active].children" :key="index" @click="goMeunDetail(item.catName)">
              <img :src="item.backImg" />
              <span>{{item.catName}}</span>
            </li>
          </ul>
        </template>
      </van-tree-select>
    </div>
  </div>
</template>

<script>
import "../../assets/less/menu.less";
export default {
  data() {
    return {
      types: [],
      product: [],
      isActive: false,
      active: 0,
      items: [
        {
          text: "手机数码",
          children: [
            {
              backImg:
                "https://img10.360buyimg.com/focus/s140x140_jfs/t11503/241/2246064496/4783/cea2850e/5a169216N0701c7f1.jpg",

              catName:"手机"
            },
            {
              backImg:
                "https://img12.360buyimg.com/focus/s140x140_jfs/t18055/312/1342501458/9462/4699ed8a/5ac48672N11cf61fe.jpg",

              catName:"数据线"
            },
             {
              backImg:
                "https://img11.360buyimg.com/focus/s140x140_jfs/t17548/288/1331085893/6458/52545456/5ac486c6N0c8a93dc.jpg",

              catName:"手机贴膜"
            },
            {
                backImg:
                  "https://m.360buyimg.com/n2/jfs/t1/130927/35/4485/194202/5f0ec040Ea97208b8/0eae5c7b0b297997.jpg",
                catName: "蓝牙耳机",
                 
              },
          ],
        },
        {
          text: "电脑办公",
          children: [
            {
              backImg:
                "https://img13.360buyimg.com/focus/s140x140_jfs/t11071/195/2462134264/9117/cd0688bf/5a17ba79N18b9f3d4.png",
              catName: "轻薄本"
            },
            {
              backImg:
                "https://img30.360buyimg.com/focus/s140x140_jfs/t11155/36/2330310765/10690/eb6754c3/5a17ba96N49561fea.png",
              catName: "游戏本"
            },
            {
              backImg:
                "https://img30.360buyimg.com/focus/s140x140_jfs/t13798/322/988648789/3644/1adc5615/5a17ba6dNafc95373.jpg",
              catName: "曲屏显示器"
            },
            {
              backImg:
                "https://img30.360buyimg.com/focus/s140x140_jfs/t13747/317/982291236/6659/4945536d/5a17b996Nba3bed32.jpg",
              catName: "台式机"
            },
            {
              backImg:
                "https://img20.360buyimg.com/focus/s140x140_jfs/t11881/31/2355374158/3676/22da94de/5a16a5f0Nc6b32dda.jpg",
              catName: "鼠标"
            },
          ],
        },
        {
          text:"男装",
          children: [
            {
              backImg:
                "https://img12.360buyimg.com/focus/s140x140_jfs/t19312/140/1294064569/4871/1c61d372/5ac47812N52823c3e.jpg",

              catName:"T恤男"
            },
            {
              backImg:
                "https://img20.360buyimg.com/focus/s140x140_jfs/t17890/31/1269777779/2792/917e13d0/5ac47830N63e76af2.jpg",

              catName:"风衣"
            },{
              backImg:
                "https://img20.360buyimg.com/focus/s140x140_jfs/t17758/181/1301850814/2848/ad32e7c9/5ac47845N7374a31d.jpg",

              catName:"休闲裤男"
            },{
              backImg:
                "https://img12.360buyimg.com/focus/s140x140_jfs/t18178/146/1276054928/1890/fb1b74a3/5ac47c3aNc82719bc.jpg",

              catName:"九分裤"
            },{
              backImg:
                "https://img20.360buyimg.com/focus/s140x140_jfs/t17446/329/1299424934/7837/3fbdc405/5ac47c4eNd42efb7b.jpg",

              catName:"短裤"
            },
          ]
        },
        {
          text:"女装",
          children: [
            {
              backImg:
                "//img20.360buyimg.com/focus/s140x140_jfs/t19471/233/655303672/4619/b23fea4b/5a9fb684Ne1ec9fe8.jpg",

              catName:"长袖T恤"
            },
            {
              backImg:
                "https://img13.360buyimg.com/focus/s140x140_jfs/t11743/349/2137116517/2398/f40a88e0/5a126bd7N20bbe151.jpg",

              catName:"裤子"
            },
            {
              backImg:
                "https://img10.360buyimg.com/focus/s140x140_jfs/t11791/249/2180710603/1984/b8d02ddf/5a128463Nce1ae193.jpg",

              catName:"连衣裙"
            },
          ]
        },{
          text:"男鞋",
          children: [
            {
              backImg:
                "https://img13.360buyimg.com/focus/s140x140_jfs/t13318/275/759603762/2622/2e47bbbf/5a139565N882a63c6.jpg",

              catName:"板鞋"
            },
            {
              backImg:
                "https://img12.360buyimg.com/focus/s140x140_jfs/t11089/341/2234800375/3425/8950afe8/5a139577N054caadb.jpg",

              catName:"皮鞋"
            },
          ]
        },{
          text:"女鞋",
          children: [
            {
              backImg:
                "https://img30.360buyimg.com/focus/s140x140_jfs/t14266/155/2486125485/7190/2fce9b89/5aa64105N88a4830d.jpg",

              catName:"凉鞋"
            },
            {
              backImg:
                "https://img10.360buyimg.com/focus/s140x140_jfs/t14149/102/2685329591/4506/b16d41d0/5aa640f0N2a7e6946.jpg",

              catName:"高跟鞋"
            },
            {
              backImg:
                "https://img10.360buyimg.com/focus/s140x140_jfs/t14479/130/2495570153/2643/aeaf37c6/5aa640e5N831531ee.jpg",

              catName:"帆布鞋"
            },
          ]
        },{
          text:"家具",
          children: [
            {
              backImg:
                "https://img10.360buyimg.com/focus/s140x140_jfs/t11716/42/2660333348/7433/6b0f6f36/5a1eb085N58db3383.jpg",

              catName:"沙发"
            },
            {
              backImg:
                "https://img13.360buyimg.com/focus/s140x140_jfs/t15607/21/158814849/2693/bb37a5b8/5a28e0cbN142a133d.jpg",

              catName:"边桌/茶几"
            },
            {
              backImg:
                "https://img12.360buyimg.com/focus/s140x140_jfs/t13420/348/1835686003/1802/94b7dd2a/5a28e0b2N6f74d6e0.jpg",

              catName:"电视柜"
            },
          ]
        },
        {
          text:"美妆护肤",
          children: [
            {
              backImg:
                "https://img14.360buyimg.com/focus/s140x140_jfs/t1/91206/20/13565/9379/5e5f262bE45790537/0373287c48fa2317.jpg",

              catName:"明星同款面膜"
            },
            {
              backImg:
                "https://img13.360buyimg.com/focus/s140x140_jfs/t21634/217/114542271/9364/cbd83d13/5afd3c4bNc8d91bef.jpg",

              catName:"女士香水"
            },
            {
              backImg:
                "https://img14.360buyimg.com/focus/s140x140_jfs/t19390/1/2506793243/6166/d775fccd/5afd3c46N0888d2dc.jpg",

              catName:"男士香水"
            },
             {
              backImg:
                "https://img10.360buyimg.com/focus/s140x140_jfs/t17503/252/2512889132/27294/443c2fac/5afd3c33N4a033cfa.jpg",

              catName:"口红"
            },
          ]
        },
        {
          text:"零食",
          children: [
            {
              backImg:
                "https://img30.360buyimg.com/focus/s140x140_jfs/t11431/77/1274462175/4200/a52ec5cc/59ffd6e2N287c043d.jpg",

              catName:"休闲零食"
            },
            {
              backImg:
                "https://img20.360buyimg.com/focus/s140x140_jfs/t11461/336/1331406760/15773/60c49ab7/59ffd6d0Ncb29412d.png",

              catName:"坚果炒货"
            },
            {
              backImg:
                "https://img11.360buyimg.com/focus/s140x140_jfs/t11275/128/1281544342/3341/64f437e/59ffd6fbN047718c7.jpg",

              catName:"蜜饯果干"
            },
            {
              backImg:
                "https://img11.360buyimg.com/focus/s140x140_jfs/t11749/28/952474396/2583/64b85652/59fc31b6N4feb7d84.jpg",

              catName:"肉干肉脯"
            },
          ]
        },
      ],
    };
  },
  methods: {
    search() {
      this.$router.push({ name: "Search" });
    },
    goMeunDetail(value) {
      this.$router.push({ name: "Search", query: { value } });
    },
  },
};
</script>

<style lang="less" scoped></style>
