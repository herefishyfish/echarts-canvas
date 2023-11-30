import { Canvas } from '@nativescript/canvas'
import { LoadEventData, Observable } from '@nativescript/core'
import * as echarts from 'echarts'

export class HelloWorldModel extends Observable {
  private _counter: number
  private _message: string

  constructor() {
    super()

    // Initialize default values.
    this._counter = 42
    this.updateMessage()
  }

  get message(): string {
    return this._message
  }

  set message(value: string) {
    if (this._message !== value) {
      this._message = value
      this.notifyPropertyChange('message', value)
    }
  }

  onTap() {
    this._counter--
    this.updateMessage()
  }

  canvasReady(args) {
    console.log('canvasReady');
    const canvas = args.object as HTMLCanvasElement;

    const chart = echarts.init(canvas as any);

    const options = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      legend: {
        // TODO: fix legend spacing
        top: '10%',
        orient: 'vertical',
        data:['Sales', 'profits']
      },
      xAxis: {
        axisLabel: {
          show: true
        },
        data: ['shirt','cardign','chiffon shirt','pants','heels','socks'],
      },
      yAxis: {
        axisLabel: {
          // TODO: Same issues here
          show: true
        }
      },
      series: [{
        name: 'Sales',
        type: 'bar',
        data: [8, 20, 36, 10, 14, 20]
      },{
        name: 'profits',
        type: 'line',
        smooth: true,
        // TODO: fix symbol spacing probably related to legend spacing issue (Viewport Scaling issue?)
        showSymbol: true,
        data: [8, 20, 36, 10, 14, 20]
      }],
      grid: {
        top: '9%',
        left: '3%',
        right: '10%',
        bottom: '10%',
        containLabel: true
      }
    };

    chart.setOption(options as echarts.EChartOption);
  }

  private updateMessage() {
    if (this._counter <= 0) {
      this.message = 'Hoorraaay! You unlocked the NativeScript clicker achievement!'
    } else {
      this.message = `${this._counter} taps left`
    }
  }
}
