<template>
  <div class="dashboard-editor-container">
    <github-corner class="github-corner" />

    <panel-group @handleSetLineChartData="handleSetLineChartData" />

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData" />
    </el-row>

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="8">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">
        <transaction-table />
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
        <todo-list />
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
        <box-card />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import GithubCorner from '@/components/GithubCorner'
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import RaddarChart from './components/RaddarChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
import TransactionTable from './components/TransactionTable'
import TodoList from './components/TodoList'
import BoxCard from './components/BoxCard'
import { fetchData } from '@/api/chart'
import { parseTime } from '@/utils'
console.log('Time:06-24 regdb flag1', fetchData)

// json 类
function Json(sys_name, date, p0_p1_num) {
  this.subsys_name = sys_name
  this.date = date
  this.p0_p1_num = p0_p1_num
}
// 字典 Dictionary类
function Dictionary() {
  this.add = add
  this.datastore = []
  this.find = find
  this.remove = remove
  this.showAll = showAll
  this.count = count
  this.clear = clear
}
function add(key, value) {
  this.datastore[key] = value
}
function find(key) {
  return this.datastore[key]
}
function remove(key) {
  delete this.datastore[key]
}
function showAll() {
  var str = ''
  for (var key in this.datastore) {
    str += key + ' -> ' + this.datastore[key] + '; '
  }
  console.log('Time:06-28 show datastore', str)
}
function count() {
  /* var ss = Object.keys(this.datastore).length;
  console.log("ssss  "+ss);
  return Object.keys(this.datastore).length;*/
  /**/
  var n = 0
  for (var key in Object.keys(this.datastore)) {
    ++n
  }
  console.log(n, key)
  return n
}
function clear() {
  for (var key in this.datastore) {
    delete this.datastore[key]
  }
}
var lineChartData = {
  LINT: {
    XData: [100, 50, 10, 80, 50, 80, 100],
    YData: [120, 82, 91, 154, 162, 140, 145],
    test_data: []
  },
  messages: {
    P0Data: [200, 192, 120, 144, 160, 130, 140],
    P1Data: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    P0Data: [80, 100, 121, 104, 105, 90, 100],
    P1Data: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    P0Data: [130, 140, 141, 142, 145, 150, 160],
    P1Data: [120, 82, 91, 154, 162, 140, 130]
  }
}

export default {
  name: 'DashboardAdmin',
  components: {
    GithubCorner,
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart,
    TransactionTable,
    TodoList,
    BoxCard
  },
  data() {
    return {
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
      },
      lineChartData: lineChartData.LINT
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      fetchData(this.listQuery).then(response => {
        this.list = response.data.items
        console.log('Time:06-24 list', this.list)
        this.total = response.data.total
        for (let key = 0; key < this.list.length; key++) {
          this.lint_data[key] = parseInt(this.list[key].spylint_p0) + parseInt(this.list[key].spylint_p1)
          this.lint_date[key] = parseTime(this.list[key].timestamp, '{y}-{m}-{d} {h}:{i}')
          // console.log('Time:06-24 indexof', this.lint_sys.indexOf(this.list[key].subsys))
          // console.log('Time:06-28 sub_sys', this.list[key].subsys)
          if (this.lint_sys.indexOf(this.list[key].subsys) === -1) {
            this.lint_sys[this.sys_num] = this.list[key].subsys
            this.sys_num++
          }
        }
        // 0624 fix here for yuele
        var sub_sys_lint = new Dictionary()
        var lint_json_list = []
        for (let i = 0; i < (this.lint_sys.length); i++) {
          var lint_json = new Json()
          var temp_date_list = []
          var temp_p0_p1_list = []
          var index_num = 0
          for (let k = 0; k < this.list.length; k++) {
            if (this.lint_sys[i] === this.list[k].subsys) {
              // var lint_json = new Json()
              // console.log('Time:0628 i=, k=', i, k)
              temp_date_list[index_num] = parseTime(this.list[k].timestamp, '{y}-{m}-{d} {h}:{i}')
              temp_p0_p1_list[index_num] = parseInt(this.list[k].spylint_p0) + parseInt(this.list[k].spylint_p1)
              index_num++
              // console.log('Time:06-28,date ,p0 , list[]', temp_date_list, temp_p0_p1_list, k)
              sub_sys_lint.add('ap_sys', 'date')
              // sub_sys_lint.showAll()
            }
          }
          lint_json.subsys_name = this.lint_sys[i]
          lint_json.date = temp_date_list
          lint_json.p0_p1_num = temp_p0_p1_list
          lint_json_list[i] = lint_json
          lineChartData.LINT.test_data[i] = lint_json
          console.log('Time:06-28 lint_json_flag1', lint_json_list)
        }
        // lineChartData.LINT.P0Data = this.lint_data
        // lineChartData.LINT.P1Data = this.lint_date
        lineChartData.LINT.subsys_list = this.lint_sys
        console.log('Time:06-24 lint_data', this.lint_data, this.lint_date)
        console.log('Time:06-28 lint_data', lineChartData.LINT.XData)
        console.log('Time:06-28 lint_test_data flag1', lineChartData.LINT)

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },

    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
