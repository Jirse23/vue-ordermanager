<template>
  <div>
    <!-- 1. echarts容器 -->
    <div id="firstecharts" style="width: 800px; height: 500px"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { echarts_totaldata } from "@/api/apis";

export default {
  mounted() {
    let mcharts = echarts.init(document.querySelector("#firstecharts"));

    //通过接口发送数据
    echarts_totaldata().then((res) => {
      // 2. 创建配置对象
      let option = {
        title: {
          text: "数据统计",
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: ["金额数据", "订单数据"], //顶部描述值
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: res.data.xAxis,
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "金额数据",
            type: "line",
            stack: "总量",
            data: res.data.amountData,
          },
          {
            name: "订单数据",
            type: "line",
            stack: "总量",
            data: res.data.orderData,
          },
        ],
      };
      // 3. 使用echarts实例对象， 关联数据配置对象， 创建表格
      mcharts.setOption(option);
    });
  },
};
</script>

<style lang="less" scoped>
</style>