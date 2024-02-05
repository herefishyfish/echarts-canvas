import { Canvas } from "@nativescript/canvas";
import { HTMLCanvasElement as NSHTMLCanvasElement } from "@nativescript/canvas-polyfill/DOM/HTMLCanvasElement";
import * as zrender from "zrender";
import {
  LoadEventData,
  Observable,
  Screen,
  StackLayout,
} from "@nativescript/core";
import { init, EChartsOption, graphic, util } from "echarts";
import { data } from "./data/life-expectancy-table";

// echarts.setPlatformAPI({
//   createCanvas() {
//     return document.createElement("canvas");
//   },
// });

export class HelloWorldModel extends Observable {
  private _counter: number;
  private _message: string;

  constructor() {
    super();

    // Initialize default values.
    this._counter = 42;
    this.updateMessage();
  }

  get message(): string {
    return this._message;
  }

  set message(value: string) {
    if (this._message !== value) {
      this._message = value;
      this.notifyPropertyChange("message", value);
    }
  }

  onTap() {
    this._counter--;
    this.updateMessage();
  }

  zRenderCanvasReady(args: LoadEventData) {
    const canvas = args.object as Canvas;

    const zr = zrender.init(canvas as any);

    var circle = new zrender.Circle({
      shape: {
        cx: 150,
        cy: 50,
        r: 40,
      },
      style: {
        fill: "none",
        stroke: "#F00",
      },
    });
    zr.add(circle);

    zr.on(
      "mousemove",
      function (e) {
        console.log("click", e);
      },
      this
    );
  }

  canvasReady(args: LoadEventData) {
    console.log("canvasReady");
    const canvas = args.object as Canvas;
    // canvas.ignorePixelScaling = true;
    // canvas.ignoreTouchEvents = false;
    // console.log(_canvas)

    // const ctx = _canvas.getContext("2d", {});
    // ctx.fillStyle = "";
    // ctx.fillRect(0, 0, 150, 75);

    // return;

    const chart = init(canvas as unknown as HTMLCanvasElement);
    let option: EChartsOption;

    option = {
      graphic: {
        elements: [
          {
            type: "text",
            left: "center",
            top: "center",
            style: {
              text: "NativeScript ECharts",
              fontSize: 38,
              // fontWeight: "bold",
              lineDash: [0, 200],
              lineDashOffset: 0,
              fill: "#2e2e2e",
              stroke: "#5470c6",
              lineWidth: 2,
            },
            keyframeAnimation: {
              duration: 5000,
              loop: true,
              keyframes: [
                {
                  percent: 0.5,
                  style: {
                    fill: "#2e2e2e",
                    lineDashOffset: 200,
                    lineDash: [200, 0],
                  },
                },
                {
                  percent: 1,
                  style: {
                    fill: "#5470c6",
                  },
                },
              ],
            },
          },
        ],
      },
    };

    chart.setOption(option);
  }

  canvasReady5(args: LoadEventData) {
    console.log("canvasReady");
    const canvas = args.object as Canvas;
    // canvas.ignorePixelScaling = true;

    const chart = init(canvas as any, "dark");
    let option: EChartsOption;

    const symbolSize = 20;
    const data: any = [
      [40, -10],
      [-30, -5],
      [-76.5, 20],
      [-63.5, 40],
      [-22.1, 50],
    ];
    option = {
      title: {
        text: "Try Dragging these Points",
        left: "center",
      },
      tooltip: {
        triggerOn: "none",
        formatter: function (params) {
          return (
            "<StackLayout>" +
            "<Label>X: 123</Label>" +
            // params.data[0].toFixed(2) +
            // // '<br>Y: ' +
            // params.data[1].toFixed(2) +
            "</StackLayout>"
          );
        },
      },
      grid: {
        top: "8%",
        bottom: "12%",
      },
      xAxis: {
        min: -100,
        max: 70,
        type: "value",
        axisLine: { onZero: false },
      },
      yAxis: {
        min: -30,
        max: 60,
        type: "value",
        axisLine: { onZero: false },
      },
      dataZoom: [
        {
          type: "slider",
          xAxisIndex: 0,
          filterMode: "none",
        },
        {
          type: "slider",
          yAxisIndex: 0,
          filterMode: "none",
        },
        {
          type: "inside",
          xAxisIndex: 0,
          filterMode: "none",
        },
        {
          type: "inside",
          yAxisIndex: 0,
          filterMode: "none",
        },
      ],
      series: [
        {
          id: "a",
          type: "line",
          smooth: true,
          symbolSize: symbolSize,
          data: data,
        },
      ],
    };
    setTimeout(function () {
      // Add shadow circles (which is not visible) to enable drag.
      chart.setOption({
        graphic: data.map(function (item, dataIndex) {
          return {
            type: "circle",
            position: chart.convertToPixel("grid", item),
            shape: {
              cx: 0,
              cy: 0,
              r: symbolSize / 2,
            },
            invisible: true,
            draggable: true,
            ondrag: function (dx, dy) {
              onPointDragging(dataIndex, [this.x, this.y]);
            },
            onmousemove: function () {
              showTooltip(dataIndex);
            },
            onmouseout: function () {
              // console.log("onmouseout");
              hideTooltip(dataIndex);
            },
            ontouchstart: function () {
              // console.log("ontouchstart");
              showTooltip(dataIndex);
            },
            z: 100,
          };
        }),
      });
    }, 0);
    window.addEventListener("resize", updatePosition);
    chart.on("dataZoom", updatePosition);
    // chart.on("mousedown", function (params) {
    //   console.log("mousemove");
    // });
    function updatePosition() {
      chart.setOption({
        graphic: data.map(function (item, dataIndex) {
          return {
            position: chart.convertToPixel("grid", item),
          };
        }),
      });
    }
    function showTooltip(dataIndex) {
      chart.dispatchAction({
        type: "showTip",
        seriesIndex: 0,
        dataIndex: dataIndex,
      });
    }
    function hideTooltip(dataIndex) {
      chart.dispatchAction({
        type: "hideTip",
      });
    }
    function onPointDragging(dataIndex, pos) {
      data[dataIndex] = chart.convertFromPixel("grid" as any, pos);
      // Update data
      chart.setOption({
        series: [
          {
            id: "a",
            data: data,
          },
        ],
      });
    }

    chart.setOption(option);
  }

  canvasReady2(args) {
    const canvas = args.object as Canvas;
    // canvas.ignorePixelScaling = true;

    const chart = init(canvas as unknown as HTMLCanvasElement);
    let option: EChartsOption;

    option = {
      darkMode: true,
      tooltip: {
        trigger: "item",
      },
      legend: {
        top: "5%",
        left: "center",
      },
      series: [
        {
          name: "Access From",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: false,
            position: "center",
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 40,
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: false,
          },
          data: [
            { value: 1048, name: "Search Engine" },
            { value: 735, name: "Direct" },
            { value: 550, name: "Email" },
            { value: 484, name: "Union Ads" },
            { value: 300, name: "Video Ads" },
          ],
        },
      ],
    };

    chart.setOption(option);
  }

  canvasReady7(args) {
    const canvas = args.object as Canvas;
    canvas.ignorePixelScaling = true;

    const chart = init(canvas as unknown as HTMLCanvasElement, "", {
      useDirtyRect: true,
    });

    const schema = [
      { name: "AQIindex", index: 1, text: "AQI" },
      { name: "PM25", index: 2, text: "PM 2.5" },
      { name: "PM10", index: 3, text: "PM 10" },
      { name: "CO", index: 4, text: "CO" },
      { name: "NO2", index: 5, text: "NO₂" },
      { name: "SO2", index: 6, text: "SO₂" },
      { name: "Rank", index: 7, text: "Rank" },
    ];
    const rawData = [
      [55, 9, 56, 0.46, 18, 6, "Good", "Beijing"],
      [25, 11, 21, 0.65, 34, 9, "Excellent", "Beijing"],
      [56, 7, 63, 0.3, 14, 5, "Good", "Beijing"],
      [33, 7, 29, 0.33, 16, 6, "Excellent", "Beijing"],
      [42, 24, 44, 0.76, 40, 16, "Excellent", "Beijing"],
      [82, 58, 90, 1.77, 68, 33, "Good", "Beijing"],
      [74, 49, 77, 1.46, 48, 27, "Good", "Beijing"],
      [78, 55, 80, 1.29, 59, 29, "Good", "Beijing"],
      [267, 216, 280, 4.8, 108, 64, "Severe", "Beijing"],
      [185, 127, 216, 2.52, 61, 27, "Moderate", "Beijing"],
      [39, 19, 38, 0.57, 31, 15, "Excellent", "Beijing"],
      [41, 11, 40, 0.43, 21, 7, "Excellent", "Beijing"],
      [64, 38, 74, 1.04, 46, 22, "Good", "Beijing"],
      [108, 79, 120, 1.7, 75, 41, "Mild", "Beijing"],
      [108, 63, 116, 1.48, 44, 26, "Mild", "Beijing"],
      [33, 6, 29, 0.34, 13, 5, "Excellent", "Beijing"],
      [94, 66, 110, 1.54, 62, 31, "Good", "Beijing"],
      [186, 142, 192, 3.88, 93, 79, "Moderate", "Beijing"],
      [57, 31, 54, 0.96, 32, 14, "Good", "Beijing"],
      [22, 8, 17, 0.48, 23, 10, "Excellent", "Beijing"],
      [39, 15, 36, 0.61, 29, 13, "Excellent", "Beijing"],
      [94, 69, 114, 2.08, 73, 39, "Good", "Beijing"],
      [99, 73, 110, 2.43, 76, 48, "Good", "Beijing"],
      [31, 12, 30, 0.5, 32, 16, "Excellent", "Beijing"],
      [42, 27, 43, 1, 53, 22, "Excellent", "Beijing"],
      [154, 117, 157, 3.05, 92, 58, "Moderate", "Beijing"],
      [234, 185, 230, 4.09, 123, 69, "Severe", "Beijing"],
      [160, 120, 186, 2.77, 91, 50, "Moderate", "Beijing"],
      [134, 96, 165, 2.76, 83, 41, "Mild", "Beijing"],
      [52, 24, 60, 1.03, 50, 21, "Good", "Beijing"],
      [46, 5, 49, 0.28, 10, 6, "Excellent", "Beijing"],
      [26, 37, 27, 1.163, 27, 13, "Excellent", "Guangzhou"],
      [85, 62, 71, 1.195, 60, 8, "Good", "Guangzhou"],
      [78, 38, 74, 1.363, 37, 7, "Good", "Guangzhou"],
      [21, 21, 36, 0.634, 40, 9, "Excellent", "Guangzhou"],
      [41, 42, 46, 0.915, 81, 13, "Excellent", "Guangzhou"],
      [56, 52, 69, 1.067, 92, 16, "Good", "Guangzhou"],
      [64, 30, 28, 0.924, 51, 2, "Good", "Guangzhou"],
      [55, 48, 74, 1.236, 75, 26, "Good", "Guangzhou"],
      [76, 85, 113, 1.237, 114, 27, "Good", "Guangzhou"],
      [91, 81, 104, 1.041, 56, 40, "Good", "Guangzhou"],
      [84, 39, 60, 0.964, 25, 11, "Good", "Guangzhou"],
      [64, 51, 101, 0.862, 58, 23, "Good", "Guangzhou"],
      [70, 69, 120, 1.198, 65, 36, "Good", "Guangzhou"],
      [77, 105, 178, 2.549, 64, 16, "Good", "Guangzhou"],
      [109, 68, 87, 0.996, 74, 29, "Mild", "Guangzhou"],
      [73, 68, 97, 0.905, 51, 34, "Good", "Guangzhou"],
      [54, 27, 47, 0.592, 53, 12, "Good", "Guangzhou"],
      [51, 61, 97, 0.811, 65, 19, "Good", "Guangzhou"],
      [91, 71, 121, 1.374, 43, 18, "Good", "Guangzhou"],
      [73, 102, 182, 2.787, 44, 19, "Good", "Guangzhou"],
      [73, 50, 76, 0.717, 31, 20, "Good", "Guangzhou"],
      [84, 94, 140, 2.238, 68, 18, "Good", "Guangzhou"],
      [93, 77, 104, 1.165, 53, 7, "Good", "Guangzhou"],
      [99, 130, 227, 3.97, 55, 15, "Good", "Guangzhou"],
      [146, 84, 139, 1.094, 40, 17, "Mild", "Guangzhou"],
      [113, 108, 137, 1.481, 48, 15, "Mild", "Guangzhou"],
      [81, 48, 62, 1.619, 26, 3, "Good", "Guangzhou"],
      [56, 48, 68, 1.336, 37, 9, "Good", "Guangzhou"],
      [82, 92, 174, 3.29, 0, 13, "Good", "Guangzhou"],
      [106, 116, 188, 3.628, 101, 16, "Mild", "Guangzhou"],
      [118, 50, 0, 1.383, 76, 11, "Mild", "Guangzhou"],
      [91, 45, 125, 0.82, 34, 23, "Good", "Shanghai"],
      [65, 27, 78, 0.86, 45, 29, "Good", "Shanghai"],
      [83, 60, 84, 1.09, 73, 27, "Good", "Shanghai"],
      [109, 81, 121, 1.28, 68, 51, "Mild", "Shanghai"],
      [106, 77, 114, 1.07, 55, 51, "Mild", "Shanghai"],
      [109, 81, 121, 1.28, 68, 51, "Mild", "Shanghai"],
      [106, 77, 114, 1.07, 55, 51, "Mild", "Shanghai"],
      [89, 65, 78, 0.86, 51, 26, "Good", "Shanghai"],
      [53, 33, 47, 0.64, 50, 17, "Good", "Shanghai"],
      [80, 55, 80, 1.01, 75, 24, "Good", "Shanghai"],
      [117, 81, 124, 1.03, 45, 24, "Mild", "Shanghai"],
      [99, 71, 142, 1.1, 62, 42, "Good", "Shanghai"],
      [95, 69, 130, 1.28, 74, 50, "Good", "Shanghai"],
      [116, 87, 131, 1.47, 84, 40, "Mild", "Shanghai"],
      [108, 80, 121, 1.3, 85, 37, "Mild", "Shanghai"],
      [134, 83, 167, 1.16, 57, 43, "Mild", "Shanghai"],
      [79, 43, 107, 1.05, 59, 37, "Good", "Shanghai"],
      [71, 46, 89, 0.86, 64, 25, "Good", "Shanghai"],
      [97, 71, 113, 1.17, 88, 31, "Good", "Shanghai"],
      [84, 57, 91, 0.85, 55, 31, "Good", "Shanghai"],
      [87, 63, 101, 0.9, 56, 41, "Good", "Shanghai"],
      [104, 77, 119, 1.09, 73, 48, "Mild", "Shanghai"],
      [87, 62, 100, 1, 72, 28, "Good", "Shanghai"],
      [168, 128, 172, 1.49, 97, 56, "Moderate", "Shanghai"],
      [65, 45, 51, 0.74, 39, 17, "Good", "Shanghai"],
      [39, 24, 38, 0.61, 47, 17, "Excellent", "Shanghai"],
      [39, 24, 39, 0.59, 50, 19, "Excellent", "Shanghai"],
      [93, 68, 96, 1.05, 79, 29, "Good", "Shanghai"],
      [188, 143, 197, 1.66, 99, 51, "Moderate", "Shanghai"],
      [174, 131, 174, 1.55, 108, 50, "Moderate", "Shanghai"],
      [187, 143, 201, 1.39, 89, 53, "Moderate", "Shanghai"],
    ];
    const CATEGORY_DIM_COUNT = 6;
    const GAP = 2;
    const BASE_LEFT = 5;
    const BASE_TOP = 10;
    // const GRID_WIDTH = 220;
    // const GRID_HEIGHT = 220;
    const GRID_WIDTH = (100 - BASE_LEFT - GAP) / CATEGORY_DIM_COUNT - GAP;
    const GRID_HEIGHT = (100 - BASE_TOP - GAP) / CATEGORY_DIM_COUNT - GAP;
    const CATEGORY_DIM = 7;
    const SYMBOL_SIZE = 4;
    function retrieveScatterData(data, dimX, dimY) {
      let result = [];
      for (let i = 0; i < data.length; i++) {
        let item = [data[i][dimX], data[i][dimY]];
        item[CATEGORY_DIM] = data[i][CATEGORY_DIM];
        result.push(item);
      }
      return result;
    }
    function generateGrids() {
      let index = 0;
      const grid = [];
      const xAxis = [];
      const yAxis = [];
      const series = [];
      for (let i = 0; i < CATEGORY_DIM_COUNT; i++) {
        for (let j = 0; j < CATEGORY_DIM_COUNT; j++) {
          if (CATEGORY_DIM_COUNT - i + j >= CATEGORY_DIM_COUNT) {
            continue;
          }
          grid.push({
            left: BASE_LEFT + i * (GRID_WIDTH + GAP) + "%",
            top: BASE_TOP + j * (GRID_HEIGHT + GAP) + "%",
            width: GRID_WIDTH + "%",
            height: GRID_HEIGHT + "%",
          });
          xAxis.push({
            splitNumber: 3,
            position: "top",
            axisLine: {
              show: j === 0,
              onZero: false,
            },
            axisTick: {
              show: j === 0,
              inside: true,
            },
            axisLabel: {
              show: j === 0,
            },
            type: "value",
            gridIndex: index,
            scale: true,
          });
          yAxis.push({
            splitNumber: 3,
            position: "right",
            axisLine: {
              show: i === CATEGORY_DIM_COUNT - 1,
              onZero: false,
            },
            axisTick: {
              show: i === CATEGORY_DIM_COUNT - 1,
              inside: true,
            },
            axisLabel: {
              show: i === CATEGORY_DIM_COUNT - 1,
            },
            type: "value",
            gridIndex: index,
            scale: true,
          });
          series.push({
            type: "scatter",
            symbolSize: SYMBOL_SIZE,
            xAxisIndex: index,
            yAxisIndex: index,
            data: retrieveScatterData(rawData, i, j),
          });
          index++;
        }
      }
      return {
        grid,
        xAxis,
        yAxis,
        series,
      };
    }
    const gridOption = generateGrids();
    const option = {
      animation: false,
      brush: {
        brushLink: "all",
        xAxisIndex: gridOption.xAxis.map(function (_, idx) {
          return idx;
        }),
        yAxisIndex: gridOption.yAxis.map(function (_, idx) {
          return idx;
        }),
        inBrush: {
          opacity: 1,
        },
      },
      visualMap: {
        type: "piecewise",
        categories: ["Beijing", "Shanghai", "Guangzhou"],
        dimension: CATEGORY_DIM,
        orient: "horizontal",
        top: 0,
        left: "center",
        inRange: {
          color: ["#51689b", "#ce5c5c", "#fbc357"],
        },
        outOfRange: {
          color: "#ddd",
        },
        seriesIndex: gridOption.series.map(function (_, idx) {
          return idx;
        }),
      },
      tooltip: {
        trigger: "item",
      },
      parallelAxis: [
        { dim: 0, name: schema[0].text },
        { dim: 1, name: schema[1].text },
        { dim: 2, name: schema[2].text },
        { dim: 3, name: schema[3].text },
        { dim: 4, name: schema[4].text },
        { dim: 5, name: schema[5].text },
        {
          dim: 6,
          name: schema[6].text,
          type: "category",
          data: ["Excellent", "Good", "Mild", "Moderate", "Severe", "Serious"],
        },
      ],
      parallel: {
        bottom: "5%",
        left: "2%",
        height: "30%",
        width: "55%",
        parallelAxisDefault: {
          type: "value",
          name: "AQI index",
          nameLocation: "end",
          nameGap: 20,
          splitNumber: 3,
          nameTextStyle: {
            fontSize: 14,
          },
          axisLine: {
            lineStyle: {
              color: "#555",
            },
          },
          axisTick: {
            lineStyle: {
              color: "#555",
            },
          },
          splitLine: {
            show: false,
          },
          axisLabel: {
            color: "#555",
          },
        },
      },
      xAxis: gridOption.xAxis,
      yAxis: gridOption.yAxis,
      grid: gridOption.grid,
      series: [
        {
          name: "parallel",
          type: "parallel",
          smooth: true,
          lineStyle: {
            width: 1,
            opacity: 0.3,
          },
          data: rawData,
        },
        ...gridOption.series,
      ],
    };

    chart.setOption(option);
  }

  canvasReady6(args) {
    const canvas = args.object as Canvas;
    canvas.ignorePixelScaling = true;

    const chart = init(canvas as unknown as HTMLCanvasElement);

    let option: any;
    let base = +new Date(1968, 9, 3);
    let oneDay = 24 * 3600 * 1000;
    let date = [];
    let data = [Math.random() * 300];
    for (let i = 1; i < 20000; i++) {
      var now = new Date((base += oneDay));
      date.push(
        [now.getFullYear(), now.getMonth() + 1, now.getDate()].join("/")
      );
      data.push(Math.round((Math.random() - 0.5) * 20 + data[i - 1]));
    }
    option = {
      tooltip: {
        trigger: "axis",
        position: function (pt) {
          return [pt[0], "10%"];
        },
      },
      title: {
        left: "center",
        text: "Large Area Chart",
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: date,
      },
      yAxis: {
        type: "value",
        boundaryGap: [0, "100%"],
      },
      dataZoom: [
        {
          type: "inside",
          start: 0,
          end: 10,
        },
        {
          start: 0,
          end: 10,
        },
      ],
      series: [
        {
          name: "Fake Data",
          type: "line",
          symbol: "none",
          sampling: "lttb",
          itemStyle: {
            color: "rgb(255, 70, 131)",
          },
          areaStyle: {
            color: new graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: "rgb(255, 158, 68)",
              },
              {
                offset: 1,
                color: "rgb(255, 70, 131)",
              },
            ]),
          },
          data: data,
        },
      ],
    };

    chart.setOption(option);
  }

  canvasReady3(args) {
    const canvas = args.object as Canvas;
    // canvas.ignorePixelScaling = true;
    // canvas.upscaleProperty = false;
    const chart = init(canvas as unknown as HTMLCanvasElement);

    let option: any;

    // prettier-ignore
    const femaleData = [[161.2, 51.6], [167.5, 59.0], [159.5, 49.2], [157.0, 63.0], [155.8, 53.6],
      [170.0, 59.0], [159.1, 47.6], [166.0, 69.8], [176.2, 66.8], [160.2, 75.2],
      [172.5, 55.2], [170.9, 54.2], [172.9, 62.5], [153.4, 42.0], [160.0, 50.0],
      [147.2, 49.8], [168.2, 49.2], [175.0, 73.2], [157.0, 47.8], [167.6, 68.8],
      [159.5, 50.6], [175.0, 82.5], [166.8, 57.2], [176.5, 87.8], [170.2, 72.8],
      [174.0, 54.5], [173.0, 59.8], [179.9, 67.3], [170.5, 67.8], [160.0, 47.0],
      [154.4, 46.2], [162.0, 55.0], [176.5, 83.0], [160.0, 54.4], [152.0, 45.8],
      [162.1, 53.6], [170.0, 73.2], [160.2, 52.1], [161.3, 67.9], [166.4, 56.6],
      [168.9, 62.3], [163.8, 58.5], [167.6, 54.5], [160.0, 50.2], [161.3, 60.3],
      [167.6, 58.3], [165.1, 56.2], [160.0, 50.2], [170.0, 72.9], [157.5, 59.8],
      [167.6, 61.0], [160.7, 69.1], [163.2, 55.9], [152.4, 46.5], [157.5, 54.3],
      [168.3, 54.8], [180.3, 60.7], [165.5, 60.0], [165.0, 62.0], [164.5, 60.3],
      [156.0, 52.7], [160.0, 74.3], [163.0, 62.0], [165.7, 73.1], [161.0, 80.0],
      [162.0, 54.7], [166.0, 53.2], [174.0, 75.7], [172.7, 61.1], [167.6, 55.7],
      [151.1, 48.7], [164.5, 52.3], [163.5, 50.0], [152.0, 59.3], [169.0, 62.5],
      [164.0, 55.7], [161.2, 54.8], [155.0, 45.9], [170.0, 70.6], [176.2, 67.2],
      [170.0, 69.4], [162.5, 58.2], [170.3, 64.8], [164.1, 71.6], [169.5, 52.8],
      [163.2, 59.8], [154.5, 49.0], [159.8, 50.0], [173.2, 69.2], [170.0, 55.9],
      [161.4, 63.4], [169.0, 58.2], [166.2, 58.6], [159.4, 45.7], [162.5, 52.2],
      [159.0, 48.6], [162.8, 57.8], [159.0, 55.6], [179.8, 66.8], [162.9, 59.4],
      [161.0, 53.6], [151.1, 73.2], [168.2, 53.4], [168.9, 69.0], [173.2, 58.4],
      [171.8, 56.2], [178.0, 70.6], [164.3, 59.8], [163.0, 72.0], [168.5, 65.2],
      [166.8, 56.6], [172.7, 105.2], [163.5, 51.8], [169.4, 63.4], [167.8, 59.0],
      [159.5, 47.6], [167.6, 63.0], [161.2, 55.2], [160.0, 45.0], [163.2, 54.0],
      [162.2, 50.2], [161.3, 60.2], [149.5, 44.8], [157.5, 58.8], [163.2, 56.4],
      [172.7, 62.0], [155.0, 49.2], [156.5, 67.2], [164.0, 53.8], [160.9, 54.4],
      [162.8, 58.0], [167.0, 59.8], [160.0, 54.8], [160.0, 43.2], [168.9, 60.5],
      [158.2, 46.4], [156.0, 64.4], [160.0, 48.8], [167.1, 62.2], [158.0, 55.5],
      [167.6, 57.8], [156.0, 54.6], [162.1, 59.2], [173.4, 52.7], [159.8, 53.2],
      [170.5, 64.5], [159.2, 51.8], [157.5, 56.0], [161.3, 63.6], [162.6, 63.2],
      [160.0, 59.5], [168.9, 56.8], [165.1, 64.1], [162.6, 50.0], [165.1, 72.3],
      [166.4, 55.0], [160.0, 55.9], [152.4, 60.4], [170.2, 69.1], [162.6, 84.5],
      [170.2, 55.9], [158.8, 55.5], [172.7, 69.5], [167.6, 76.4], [162.6, 61.4],
      [167.6, 65.9], [156.2, 58.6], [175.2, 66.8], [172.1, 56.6], [162.6, 58.6],
      [160.0, 55.9], [165.1, 59.1], [182.9, 81.8], [166.4, 70.7], [165.1, 56.8],
      [177.8, 60.0], [165.1, 58.2], [175.3, 72.7], [154.9, 54.1], [158.8, 49.1],
      [172.7, 75.9], [168.9, 55.0], [161.3, 57.3], [167.6, 55.0], [165.1, 65.5],
      [175.3, 65.5], [157.5, 48.6], [163.8, 58.6], [167.6, 63.6], [165.1, 55.2],
      [165.1, 62.7], [168.9, 56.6], [162.6, 53.9], [164.5, 63.2], [176.5, 73.6],
      [168.9, 62.0], [175.3, 63.6], [159.4, 53.2], [160.0, 53.4], [170.2, 55.0],
      [162.6, 70.5], [167.6, 54.5], [162.6, 54.5], [160.7, 55.9], [160.0, 59.0],
      [157.5, 63.6], [162.6, 54.5], [152.4, 47.3], [170.2, 67.7], [165.1, 80.9],
      [172.7, 70.5], [165.1, 60.9], [170.2, 63.6], [170.2, 54.5], [170.2, 59.1],
      [161.3, 70.5], [167.6, 52.7], [167.6, 62.7], [165.1, 86.3], [162.6, 66.4],
      [152.4, 67.3], [168.9, 63.0], [170.2, 73.6], [175.2, 62.3], [175.2, 57.7],
      [160.0, 55.4], [165.1, 104.1], [174.0, 55.5], [170.2, 77.3], [160.0, 80.5],
      [167.6, 64.5], [167.6, 72.3], [167.6, 61.4], [154.9, 58.2], [162.6, 81.8],
      [175.3, 63.6], [171.4, 53.4], [157.5, 54.5], [165.1, 53.6], [160.0, 60.0],
      [174.0, 73.6], [162.6, 61.4], [174.0, 55.5], [162.6, 63.6], [161.3, 60.9],
      [156.2, 60.0], [149.9, 46.8], [169.5, 57.3], [160.0, 64.1], [175.3, 63.6],
      [169.5, 67.3], [160.0, 75.5], [172.7, 68.2], [162.6, 61.4], [157.5, 76.8],
      [176.5, 71.8], [164.4, 55.5], [160.7, 48.6], [174.0, 66.4], [163.8, 67.3]
    ];
    // prettier-ignore
    const maleDeta = [[174.0, 65.6], [175.3, 71.8], [193.5, 80.7], [186.5, 72.6], [187.2, 78.8],
      [181.5, 74.8], [184.0, 86.4], [184.5, 78.4], [175.0, 62.0], [184.0, 81.6],
      [180.0, 76.6], [177.8, 83.6], [192.0, 90.0], [176.0, 74.6], [174.0, 71.0],
      [184.0, 79.6], [192.7, 93.8], [171.5, 70.0], [173.0, 72.4], [176.0, 85.9],
      [176.0, 78.8], [180.5, 77.8], [172.7, 66.2], [176.0, 86.4], [173.5, 81.8],
      [178.0, 89.6], [180.3, 82.8], [180.3, 76.4], [164.5, 63.2], [173.0, 60.9],
      [183.5, 74.8], [175.5, 70.0], [188.0, 72.4], [189.2, 84.1], [172.8, 69.1],
      [170.0, 59.5], [182.0, 67.2], [170.0, 61.3], [177.8, 68.6], [184.2, 80.1],
      [186.7, 87.8], [171.4, 84.7], [172.7, 73.4], [175.3, 72.1], [180.3, 82.6],
      [182.9, 88.7], [188.0, 84.1], [177.2, 94.1], [172.1, 74.9], [167.0, 59.1],
      [169.5, 75.6], [174.0, 86.2], [172.7, 75.3], [182.2, 87.1], [164.1, 55.2],
      [163.0, 57.0], [171.5, 61.4], [184.2, 76.8], [174.0, 86.8], [174.0, 72.2],
      [177.0, 71.6], [186.0, 84.8], [167.0, 68.2], [171.8, 66.1], [182.0, 72.0],
      [167.0, 64.6], [177.8, 74.8], [164.5, 70.0], [192.0, 101.6], [175.5, 63.2],
      [171.2, 79.1], [181.6, 78.9], [167.4, 67.7], [181.1, 66.0], [177.0, 68.2],
      [174.5, 63.9], [177.5, 72.0], [170.5, 56.8], [182.4, 74.5], [197.1, 90.9],
      [180.1, 93.0], [175.5, 80.9], [180.6, 72.7], [184.4, 68.0], [175.5, 70.9],
      [180.6, 72.5], [177.0, 72.5], [177.1, 83.4], [181.6, 75.5], [176.5, 73.0],
      [175.0, 70.2], [174.0, 73.4], [165.1, 70.5], [177.0, 68.9], [192.0, 102.3],
      [176.5, 68.4], [169.4, 65.9], [182.1, 75.7], [179.8, 84.5], [175.3, 87.7],
      [184.9, 86.4], [177.3, 73.2], [167.4, 53.9], [178.1, 72.0], [168.9, 55.5],
      [157.2, 58.4], [180.3, 83.2], [170.2, 72.7], [177.8, 64.1], [172.7, 72.3],
      [165.1, 65.0], [186.7, 86.4], [165.1, 65.0], [174.0, 88.6], [175.3, 84.1],
      [185.4, 66.8], [177.8, 75.5], [180.3, 93.2], [180.3, 82.7], [177.8, 58.0],
      [177.8, 79.5], [177.8, 78.6], [177.8, 71.8], [177.8, 116.4], [163.8, 72.2],
      [188.0, 83.6], [198.1, 85.5], [175.3, 90.9], [166.4, 85.9], [190.5, 89.1],
      [166.4, 75.0], [177.8, 77.7], [179.7, 86.4], [172.7, 90.9], [190.5, 73.6],
      [185.4, 76.4], [168.9, 69.1], [167.6, 84.5], [175.3, 64.5], [170.2, 69.1],
      [190.5, 108.6], [177.8, 86.4], [190.5, 80.9], [177.8, 87.7], [184.2, 94.5],
      [176.5, 80.2], [177.8, 72.0], [180.3, 71.4], [171.4, 72.7], [172.7, 84.1],
      [172.7, 76.8], [177.8, 63.6], [177.8, 80.9], [182.9, 80.9], [170.2, 85.5],
      [167.6, 68.6], [175.3, 67.7], [165.1, 66.4], [185.4, 102.3], [181.6, 70.5],
      [172.7, 95.9], [190.5, 84.1], [179.1, 87.3], [175.3, 71.8], [170.2, 65.9],
      [193.0, 95.9], [171.4, 91.4], [177.8, 81.8], [177.8, 96.8], [167.6, 69.1],
      [167.6, 82.7], [180.3, 75.5], [182.9, 79.5], [176.5, 73.6], [186.7, 91.8],
      [188.0, 84.1], [188.0, 85.9], [177.8, 81.8], [174.0, 82.5], [177.8, 80.5],
      [171.4, 70.0], [185.4, 81.8], [185.4, 84.1], [188.0, 90.5], [188.0, 91.4],
      [182.9, 89.1], [176.5, 85.0], [175.3, 69.1], [175.3, 73.6], [188.0, 80.5],
      [188.0, 82.7], [175.3, 86.4], [170.5, 67.7], [179.1, 92.7], [177.8, 93.6],
      [175.3, 70.9], [182.9, 75.0], [170.8, 93.2], [188.0, 93.2], [180.3, 77.7],
      [177.8, 61.4], [185.4, 94.1], [168.9, 75.0], [185.4, 83.6], [180.3, 85.5],
      [174.0, 73.9], [167.6, 66.8], [182.9, 87.3], [160.0, 72.3], [180.3, 88.6],
      [167.6, 75.5], [186.7, 101.4], [175.3, 91.1], [175.3, 67.3], [175.9, 77.7],
      [175.3, 81.8], [179.1, 75.5], [181.6, 84.5], [177.8, 76.6], [182.9, 85.0],
      [177.8, 102.5], [184.2, 77.3], [179.1, 71.8], [176.5, 87.9], [188.0, 94.3],
      [174.0, 70.9], [167.6, 64.5], [170.2, 77.3], [167.6, 72.3], [188.0, 87.3],
      [174.0, 80.0], [176.5, 82.3], [180.3, 73.6], [167.6, 74.1], [188.0, 85.9],
      [180.3, 73.2], [167.6, 76.3], [183.0, 65.9], [183.0, 90.9], [179.1, 89.1],
      [170.2, 62.3], [177.8, 82.7], [179.1, 79.1], [190.5, 98.2], [177.8, 84.1],
      [180.3, 83.2], [180.3, 83.2]
    ];
    function calculateAverage(data, dim) {
      let total = 0;
      for (var i = 0; i < data.length; i++) {
        total += data[i][dim];
      }
      return (total /= data.length);
    }
    const scatterOption = (option = {
      xAxis: {
        scale: true,
      },
      yAxis: {
        scale: true,
      },
      series: [
        {
          type: "scatter",
          id: "female",
          dataGroupId: "female",
          universalTransition: {
            enabled: true,
            delay: function (idx, count) {
              return Math.random() * 800;
            },
          },
          data: femaleData,
        },
        {
          type: "scatter",
          id: "male",
          dataGroupId: "male",
          universalTransition: {
            enabled: true,
            delay: function (idx, count) {
              return Math.random() * 800;
            },
          },
          data: maleDeta,
        },
      ],
    });
    const barOption = {
      xAxis: {
        type: "category",
        data: ["Female", "Male"],
      },
      yAxis: {},
      series: [
        {
          type: "bar",
          id: "total",
          data: [
            {
              value: calculateAverage(maleDeta, 0),
              groupId: "male",
            },
            {
              value: calculateAverage(femaleData, 0),
              groupId: "female",
            },
          ],
          universalTransition: {
            enabled: true,
            seriesKey: ["female", "male"],
            delay: function (idx, count) {
              return Math.random() * 400;
            },
          },
        },
      ],
    };
    let currentOption: any = scatterOption;
    setInterval(function () {
      currentOption =
        currentOption === scatterOption ? barOption : scatterOption;
      chart.setOption(currentOption, true);
    }, 2000);
    chart.setOption(option);
  }

  canvasReady4(args) {
    const canvas = args.object as Canvas;
    // canvas.ignorePixelScaling = true;
    // canvas.upscaleProperty = false;
    const ctx = canvas.getContext("2d", {});

    // swap between dips and pixels to see the difference
    const dips = Screen.mainScreen.scale;
    const pixels = 1;

    // draw a rectangle
    ctx.fillStyle = "red";
    ctx.fillRect(10, 10, 100, 100);

    // draw a circle
    ctx.fillStyle = "blue";
    ctx.beginPath();
    ctx.arc(160 * dips, 60 * dips, 50 * dips, 0, Math.PI * 2);
    ctx.fill();
  }

  canvasReady8(args) {
    console.log('canvas ready 8!')
    const canvas = args.object as Canvas;
    // canvas.ignorePixelScaling = true;
    canvas.upscaleProperty = false;
    const chart = init(canvas as unknown as HTMLCanvasElement);
    
    function setData(_rawData) {
      // console.log(_rawData);
      // var countries = ['Australia', 'Canada', 'China', 'Cuba', 'Finland', 'France', 'Germany', 'Iceland', 'India', 'Japan', 'North Korea', 'South Korea', 'New Zealand', 'Norway', 'Poland', 'Russia', 'Turkey', 'United Kingdom', 'United States'];
      const countries = [
        "Finland",
        "Australia",
        "France",
        "Germany",
        "Iceland",
        "Norway",
        "Poland",
        "Russia",
        "United Kingdom",
      ];
      const datasetWithFilters = [];
      const seriesList = [];
      util.each(countries, function (country) {
        var datasetId = "dataset_" + country;
        datasetWithFilters.push({
          id: datasetId,
          fromDatasetId: "dataset_raw",
          transform: {
            type: "filter",
            config: {
              and: [
                { dimension: "Year", gte: 1950 },
                { dimension: "Country", "=": country },
              ],
            },
          },
        });
        seriesList.push({
          type: "line",
          datasetId: datasetId,
          showSymbol: false,
          name: country,
          endLabel: {
            show: true,
            formatter: function (params) {
              return params.value[3] + ": " + params.value[0];
            },
          },
          labelLayout: {
            moveOverlap: "shiftY",
          },
          emphasis: {
            focus: "series",
          },
          encode: {
            x: "Year",
            y: "Income",
            label: ["Country", "Income"],
            itemName: "Year",
            tooltip: ["Income"],
          },
        });
      });
      const option = {
        animationDuration: 10000,
        dataset: [
          {
            id: "dataset_raw",
            source: _rawData,
          },
          ...datasetWithFilters,
        ],
        title: {
          text: "Income of Germany and France since 1950",
        },
        tooltip: {
          order: "valueDesc",
          trigger: "axis",
        },
        xAxis: {
          type: "category",
          nameLocation: "middle",
        },
        yAxis: {
          name: "Income",
        },
        grid: {
          right: 140,
        },
        series: seriesList,
      };
      chart.setOption(option);
    }

    setData(data);
  }

  private updateMessage() {
    if (this._counter <= 0) {
      this.message =
        "Hoorraaay! You unlocked the NativeScript clicker achievement!";
    } else {
      this.message = `${this._counter} taps left`;
    }
  }
}
