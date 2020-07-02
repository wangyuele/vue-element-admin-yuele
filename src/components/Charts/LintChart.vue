<template>
  <div :id="id" :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'

import { fetchData } from '@/api/lint_chart'
/*
import { parseTime } from '@/utils'

// json 类 trans_data
function Json(sys_name, date, p0_p1_num) {
  this.subsys_name = sys_name
  this.date = date
  this.p0_p1_num = p0_p1_num
} */

// added by yuele for test
const _data = [
  { 'Time Serie': '2020-06-01', 'ap_sys': '10', 'wcn_sys': '15', 'aud_cp_sys': '36', 'gpu_sys': '41', 'mm__sys': '62', 'wtl_cp_sys': '80', 'pub_sys': '190', 'top': '300' },
  { 'Time Serie': '2020-06-02', 'ap_sys': '20', 'wcn_sys': '16', 'aud_cp_sys': '30', 'gpu_sys': '42', 'mm__sys': '65', 'wtl_cp_sys': '81', 'pub_sys': '180', 'top': '310' },
  { 'Time Serie': '2020-06-03', 'ap_sys': '10', 'wcn_sys': '17', 'aud_cp_sys': '31', 'gpu_sys': '43', 'mm__sys': '66', 'wtl_cp_sys': '82', 'pub_sys': '170', 'top': '320' },
  { 'Time Serie': '2020-06-04', 'ap_sys': '14', 'wcn_sys': '18', 'aud_cp_sys': '32', 'gpu_sys': '45', 'mm__sys': '67', 'wtl_cp_sys': '83', 'pub_sys': '160', 'top': '330' },
  { 'Time Serie': '2020-06-05', 'ap_sys': '16', 'wcn_sys': '19', 'aud_cp_sys': '33', 'gpu_sys': '47', 'mm__sys': '70', 'wtl_cp_sys': '84', 'pub_sys': '150', 'top': '340' },
  { 'Time Serie': '2020-06-06', 'ap_sys': '18', 'wcn_sys': '12', 'aud_cp_sys': '34', 'gpu_sys': '49', 'mm__sys': '78', 'wtl_cp_sys': '85', 'pub_sys': '140', 'top': '350' },
  { 'Time Serie': '2020-06-07', 'ap_sys': '19', 'wcn_sys': '11', 'aud_cp_sys': '35', 'gpu_sys': '50', 'mm__sys': '80', 'wtl_cp_sys': '86', 'pub_sys': '140', 'top': '360' },
  { 'Time Serie': '2020-06-08', 'ap_sys': '30', 'wcn_sys': '10', 'aud_cp_sys': '36', 'gpu_sys': '56', 'mm__sys': '85', 'wtl_cp_sys': '87', 'pub_sys': '135', 'top': '370' },
  { 'Time Serie': '2020-06-09', 'ap_sys': '40', 'wcn_sys': '17', 'aud_cp_sys': '37', 'gpu_sys': '70', 'mm__sys': '90', 'wtl_cp_sys': '88', 'pub_sys': '120', 'top': '380' }
]

const sysMap = {
  'ap_sys': {
    'text': 'ap_sys',
    'color': 'rgb(61, 234, 211)'
  },
  'wcn_sys': {
    'text': 'wcn_sys',
    'color': 'rgb(70, 234, 211)'
  },
  'aud_cp_sys': {
    'text': 'aud_cp_sys',
    'color': 'rgb(75, 197, 224)'
  },
  'gpu_sys': {
    'text': 'gpu_sys',
    'color': 'rgb(157, 75, 224)'
  },
  'mm__sys': {
    'text': 'mm__sys',
    'color': 'rgb(222, 75, 224)'
  },
  'wtl_cp_sys': {
    'text': 'wtl_cp_sys',
    'color': 'rgb(224, 75, 132)'
  },
  'pub_sys': {
    'text': 'pub_sys',
    'color': 'rgb(241, 198, 88)'
  },
  'top': {
    'text': 'top',
    'color': 'rgb(78, 175, 162)'
  }
}

let timeRange = ['2020-05-03', '2020-07-05']
const _seriesData = []
const xAxisData = []
const _dataObj = {}
let legendData = []
let _lengedMax = 0
let chart = null
console.log('Time:06-29,timeRange', timeRange, _lengedMax)

initData()
function initData() {
  _data.forEach((item, index) => {
    console.log('Time:06-30,item,index', item, index)
    xAxisData.push(item['Time Serie'])
    Object.keys(item).forEach(sys => {
      if (sys !== 'Time Serie') {
        if (index === 0) {
          _dataObj[sys] = {
            name: sysMap[sys].text,
            type: 'line',
            data: [+item[sys]],
            symbol: 'none',
            markPoint: {
              data: [
                { type: 'max', name: '最大值' }
                // {type: 'min', name: '最小值'}
              ]
            },
            markLine: {
              data: [
                { type: 'average', name: '平均值' }
              ],
              lineStyle: {
                color: sysMap[sys].color,
                opacity: 0.3
              }
            },
            lineStyle: {
              color: sysMap[sys].color,
              width: 2,
              smooth: true,
              shadowBlur: {
                shadowColor: 'rgba(255, 255, 255, 0.5)',
                shadowBlur: 10
              }
            }
          }
        } else {
          _dataObj[sys].data.push(+item[sys])
        }
      }
    })
  })
  Object.keys(_dataObj).forEach(sys => {
    _seriesData.push(_dataObj[sys])
  })
}
console.log('Time:06-30,_seriesData', _seriesData)

var option = {
  backgroundColor: '#000',
  title: [{
    text: 'Sub_sys LINT(P0+P1)',
    textStyle: {
      fontSize: 25,
      fontWeight: 'normal',
      color: '#fff'
    }
  }, {
    text: 'Sub_sys',
    right: 0,
    textAlign: 'center',
    textStyle: {
      fontSize: 25,
      fontWeight: 'normal',
      color: '#fff'
    }
  }],
  grid: {
    right: 230,
    left: 100
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    orient: 'vertical',
    top: '6%',
    x: 'right',
    itemGap: 20,
    selected: {
      'ap_sys': false
    },
    itemWidth: 130,
    itemHeight: 15,
    textStyle: {
      fontWeight: 'normal',
      color: '#fff'
    },
    data: legendData
  },
  color: [
    'rgb(61, 234, 211)',
    'rgb(75, 197, 224)',
    'rgb(157, 75, 224)',
    'rgb(222, 75, 224)',
    'rgb(224, 75, 132)',
    'rgb(75, 224, 126)',
    'rgb(218, 224, 75)',
    'rgb(224, 204, 75)',
    'rgb(142, 139, 180)',
    'rgb(61, 235, 197)',
    'rgb(147, 212, 184)',
    'rgb(253, 213, 110)',
    'rgb(255, 243, 185)',
    'rgb(123, 193, 251)',
    'rgb(254, 219, 206)',
    'rgb(254, 220, 230)',
    'rgb(253, 133, 164)',
    'rgb(230, 46, 42)',
    'rgb(230, 221, 177)',
    'rgb(165, 179, 138)',
    'rgb(78, 175, 162)',
    'rgb(241, 198, 88)'
  ],
  dataZoom: [
    {
      show: true,
      realtime: true,
      start: 0,
      end: 100,
      textStyle: {
        color: '#65abe7'
      }
    },
    {
      type: 'inside'

    }
  ],
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: xAxisData,
    splitArea: {
      show: true,
      areaStyle: {
        color: ['rgba(250,250,250,0)', 'rgba(30,144,255,0.2)']
      }
    },
    axisLine: {
      lineStyle: {
        color: '#3f64b5'
      }
    },
    axisTick: {
      lineStyle: {
        color: '#3f64b5'
      }
    },
    axisLabel: {
      color: '#3f64b5'
    }
  },
  yAxis: {
    type: 'value',
    axisLine: {
      lineStyle: {
        color: '#3f64b5'
      }
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: 'rgba(255,255,255,0.1)'
      }
    },
    axisTick: {
      lineStyle: {
        color: '#3f64b5'
      }
    },
    axisLabel: {
      color: '#3f64b5'
    }
  },
  series: _seriesData
}

function createdLegendData() {
  legendData = []
  const _newDataObj = {}
  const _startTime = Date.parse(timeRange[0])
  const _endTime = Date.parse(timeRange[1])
  _data.forEach((item, index) => {
    const _currentTime = Date.parse(item['Time Serie'])
    console.log('Tiem:06-30: _currentTime', _currentTime)
    if (_startTime <= _currentTime && _currentTime <= _endTime) {
      Object.keys(item).forEach(country => {
        if (country !== 'Time Serie') {
          if (!_newDataObj[country]) {
            _newDataObj[country] = {
              name: sysMap[country].text,
              _name: country,
              data: [+item[country] || 0]
            }
          } else {
            _newDataObj[country].data.push(+item[country] || 0)
          }
        }
      })
    }
  })
  console.log('Tiem:07-01: _newDataObj', _newDataObj)
  const maxWidth = 1000
  let newData = []
  Object.keys(_newDataObj).forEach(country => {
    const _max = Math.max.apply(null, _newDataObj[country].data)
    newData.push({
      name: _newDataObj[country].name,
      max: _max,
      _name: country

    })
    if (_lengedMax < _max) _lengedMax = _max
  })
  newData = newData.sort(function(a, b) {
    return a.max - b.max
  })
  newData.forEach(item => {
    const _num = Math.log10(Math.round(item.max))
    const _max = Math.log10(Math.round(_lengedMax))
    const _numWidth = Math.round(_num / _max * maxWidth)
    const _dataWidth = _numWidth > 20 ? _numWidth : 20
    item.textStyle = {
      color: sysMap[item._name].color
    }
    item.icon = `image://data:image/svg+xml,` +
        `%3Csvg xmlns='http://www.w3.org/2000/svg'%3E` +
            `%3Cpath d='M0 260h${_dataWidth}v270H0z' fill='${sysMap[item._name].color}'/%3E` +
            `%3Cpath fill='rgba(0, 0,0,0)' d='M${_dataWidth} 60h${maxWidth - _dataWidth}v100H100z'/%3E` +
            `%3Ctext x='${_dataWidth}' y='0' style='color: red' %3E${item.max}%3C/text%3E` +
        `%3C/svg%3E`// `path://M10 60 H ${_a / _max * maxWidth} V 70 H 10 Z`
    legendData.push(item)
  })
}

function updateLegend() {
  setTimeout(function() {
    createdLegendData()
    chart.setOption({
      legend: {
        data: legendData
      }
    })
  }, 100)
}
updateLegend()

setTimeout(function() {
  // eslint-disable-next-line no-undef
  chart.setOption({
    dataZoom: [{
      start: 80,
      end: 100
    }]
  })
}, 1000)

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '200px'
    },
    height: {
      type: String,
      default: '200px'
    }
  },
  data() {
    return {
      chart: null,
      list: null,
      lint_data: [],
      lint_date: [],
      lint_sys: [],
      sys_num: 0,
      listQuery: {
        page: 1,
        limit: 30,
        importance: undefined,
        proj_name: undefined,
        type: undefined,
        subsys: undefined,
        topmodule: undefined,
        tag: undefined,
        owner: undefined,
        submitter: undefined,
        timestamp: '+id',
        sort: '+id'
      }
    }
  },
  created() {
    this.getData()
  },
  mounted() {
    this.initChart()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    // get the data from mock
    getData() {
      fetchData(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.list.forEach((item, index) => {
          console.log('Time:07-01 item,index', item, index)
          // xAxisData.push(item['Time Serie'])
          Object.keys(item).forEach(country => {
            console.log('Time:07-01 key', country)
            if (country !== 'Time Serie') {
              if (index === 0) {
                _dataObj[country] = {
                  name: sysMap[country].text,
                  type: 'line',
                  data: [+item[country]],
                  symbol: 'none'
                }
              } else {
                _dataObj[country].data.push(+item[country])
              }
            }
          })
        })
        /*
        for (let key = 0; key < this.list.length; key++) {
          this.lint_data[key] = parseInt(this.list[key].spylint_p0) + parseInt(this.list[key].spylint_p1)
          this.lint_date[key] = parseTime(this.list[key].timestamp, '{y}-{m}-{d} {h}:{i}')
          if (this.lint_sys.indexOf(this.list[key].subsys) === -1) {
            this.lint_sys[this.sys_num] = this.list[key].subsys
            this.sys_num++
          }
        } */

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    initChart() {
      console.log('Time:07-02: this.id', this.id)
      chart = echarts.init(document.getElementById(this.id))
      // setOption
      chart.setOption({
        backgroundColor: '#344b58',
        title: option.title,
        tooltip: option.tooltip,
        grid: option.grid,
        legend: option.legend,
        calculable: true,
        xAxis: option.xAxis,
        yAxis: option.yAxis,
        dataZoom: option.dataZoom,
        series: option.series
      })
      console.log('Time:07-01: this.chart.on >>>', chart)
      console.log('Time:07-01: optin.xAxis[0] >>>', option.xAxis)
      // dynamic the legend
      chart.on('datazoom', function(params) {
        console.log('Time:06-30 params', params, chart)
        var xAxis = chart.getModel().option.xAxis[0]
        console.log('Time:07-01 xAxis', xAxis)
        var startTime = xAxis.data[xAxis.rangeStart]
        var endTime = xAxis.data[xAxis.rangeEnd]
        timeRange = [startTime, endTime]
        console.log('Time:07-01 timeRange,', timeRange)
        updateLegend()
      })
    }
  }
}
</script>
