<template>
  <div id="echartsPie"></div>
</template>

<script setup lang="ts">
import { getCurrentInstance, onMounted } from "vue";
let app = getCurrentInstance()?.appContext.config.globalProperties.$echarts;
let appR = getCurrentInstance();

//数据处理
function echartsPie() {
  console.log("pie");
  appR?.appContext.config.globalProperties.$axios
    .get("http://127.0.0.1:7001/device/getPie")
    .then((res: any) => {
      echartsPieShow(res.data.data);
    });
}

function echartsPieShow(payload: any) {
  console.log(payload, "payload");

  let myCharts = app.init(document.getElementById("echartsPie"));
  let option = {
    // backgroundColor: "#1c1c1e",
    color: ["#EAEA26", "#906BF9", "#FE5656", "#01E17E", "#3DD1F9", "#FFAD05"],
    // title: {
    //   text: "设备数据",
    //   left: "60",
    //   top: 0,
    //   textAlign: "center",
    //   textStyle: {
    //     color: "#fff",
    //     fontSize: 14,
    //     fontWeight: 0,
    //   },
    // },
    grid: {
      left: -100,
      top: 50,
      bottom: 10,
      right: 10,
      containLabel: true,
    },
    tooltip: {
      trigger: "item",
      formatter: "{b} : {c} ({d}%)",
    },
    legend: {
      type: "scroll",
      orient: "vartical",
      // x: "right",
      top: "center",
      right: "15",
      // bottom: "0%",
      itemWidth: 16,
      itemHeight: 8,
      itemGap: 16,
      textStyle: {
        color: "#A3E2F4",
        fontSize: 12,
        fontWeight: 0,
      },
      data: payload.name,
    },
    polar: {},
    angleAxis: {
      interval: 1,
      type: "category",
      data: [],
      z: 10,
      axisLine: {
        show: false,
        lineStyle: {
          color: "#0B4A6B",
          width: 1,
          type: "solid",
        },
      },
      axisLabel: {
        interval: 0,
        show: true,
        color: "#0B4A6B",
        margin: 8,
        fontSize: 16,
      },
    },
    radiusAxis: {
      min: 40,
      max: 120,
      interval: 20,
      axisLine: {
        show: false,
        lineStyle: {
          color: "#0B3E5E",
          width: 1,
          type: "solid",
        },
      },
      axisLabel: {
        formatter: "{value} %",
        show: false,
        padding: [0, 0, 20, 0],
        color: "#0B3E5E",
        fontSize: 16,
      },
      splitLine: {
        lineStyle: {
          color: "#0B3E5E",
          width: 2,
          type: "solid",
        },
      },
    },
    calculable: true,
    series: [
      {
        type: "pie",
        radius: ["5%", "10%"],
        hoverAnimation: false,
        labelLine: {
          normal: {
            show: false,
            length: 30,
            length2: 55,
          },
          emphasis: {
            show: false,
          },
        },
        data: [
          {
            name: "",
            value: 0,
            itemStyle: {
              normal: {
                color: "#0B4A6B",
              },
            },
          },
        ],
      },
      {
        type: "pie",
        radius: ["90%", "95%"],
        hoverAnimation: false,
        labelLine: {
          normal: {
            show: false,
            length: 30,
            length2: 55,
          },
          emphasis: {
            show: false,
          },
        },
        name: "",
        data: [
          {
            name: "",
            value: 0,
            itemStyle: {
              normal: {
                color: "#0B4A6B",
              },
            },
          },
        ],
      },
      {
        stack: "a",
        type: "pie",
        radius: ["20%", "80%"],
        roseType: "area",
        zlevel: 10,
        label: {
          normal: {
            show: true,
            formatter: "{c}",
            textStyle: {
              fontSize: 12,
            },
            position: "outside",
          },
          emphasis: {
            show: true,
          },
        },

        data: payload.info,
      },
    ],
  };
  myCharts.setOption(option);
  window.addEventListener("resize", function () {
    myCharts.resize();
  });
}
onMounted(() => {
  echartsPie();
});
</script>

<style scoped>
#echartsPie {
  height: 40vh;
  width: 100%;
  padding-top: 200px;
}
</style>