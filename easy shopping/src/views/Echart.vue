<template>
  <div id="chart">
    <van-nav-bar
      title="我的一年花销"
      left-arrow
      @click-left="onClickLeft"
    />
    <div id="myChart" :style="{width: '355px', height: '300px'}"></div>
  </div>
</template>

<script>
export default {
  name: "hello",
  data() {
    return {
      data: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
    };
  },
  created() {
    let dataArr = JSON.parse(localStorage.getItem("Expenses"));
    for (let i = 0; i < dataArr.length; i++) {
      for (let j = i + 1; j < dataArr.length; j++) {
        if (dataArr[i].time == dataArr[j].time) {
          dataArr[i].money = dataArr[i].money + dataArr[j].money;
          dataArr.splice(j, 1);
          j--;
        }
      }
    }

    dataArr.map((v) => {
      this.data[v.time - 1] = Math.round(v.money);
    });

     
  },
  mounted() {
    this.drawLine();
  },
  methods: {
      onClickLeft(){
          this.$router.go(-1)
      },
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("myChart"));
      // 绘制图表
      myChart.setOption({
        title: { text: "我的花销" },
        tooltip: {},
        xAxis: {
          data: [
            "一月",
            "二月",
            "三月",
            "四月",
            "五月",
            "六月",
            "七月",
            "八月",
            "九月",
            "十月",
            "十一月",
            "十二月",
          ],
        },
        yAxis: {},
        series: [
          {
            name: "花销(元)",
            type: "bar",
            data: this.data,
          },
        ],
      });
    },
  },
};
</script>

<style lang="less" >
#chart{
    background: #fff;
    height: 100%;
    #myChart {
        top: 50px;
        left: 20px;
    }
    .van-nav-bar{
        height: 66px;
    }
    .van-icon{
        color: #e02e24;
        font-weight: bold;
        font-size: 0.53333rem;
    }
}
</style>