<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.proj_name" placeholder="Project" size="small" style="width: 90px;padding:2px" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.subsys" placeholder="Sub_sys" size="small" style="width: 90px;padding:2px" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.topmodule" placeholder="TOP_Module" clearable class="filter-item" size="small" style="width: 132px;padding:2px" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.tag" placeholder="TAG" clearable class="filter-item" size="small" style="width: 130px;padding:2px" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.owner" placeholder="Owner" clearable class="filter-item" size="small" style="width: 130px;padding:2px" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.submitter" placeholder="Submitter" clearable class="filter-item" size="small" style="width: 130px; padding:2px" @keyup.enter.native="handleFilter" />
      <el-date-picker v-model="listQuery.start" style="width: 210px;margin-left: 10px;padding:8px" type="datetime" placeholder="StartDate" value-format="yyyy-MM-dd HH:mm" size="small" :default-time="'00:00'" />
      -
      <el-date-picker v-model="listQuery.end" style="width: 210px;padding:8px" type="datetime" placeholder="EndDate" value-format="yyyy-MM-dd HH:mm" size="small" :default-time="'23:59'" />
      <el-button v-waves class="filter-item" style="margin-left: 10px;padding:8px" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
      <el-button v-waves :loading="downloadLoading" style="margin-left: 10px;padding:8px" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        Export
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      height="800"
      fit
      highlight-current-row
      style="width: 100%;"
      :cell-class-name="addClass"
      :header-cell-style="tableHeaderColor"
      :header-row-style="{height:'10px'}"
      :row-style="{height:'10px'}"
      :cell-style="addClass"
      @sort-change="sortChange"
    >
      <el-table-column label="Date" prop="timestamp" sortable="custom" width="135px" align="center" :class-name="getSortClassdate('timestamp')">
        <template slot-scope="{row}">
          <span>{{ row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Project" min-width="95px" align="center">
        <template slot-scope="{row}">
          <span style="float:left">{{ row.proj_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Sub_sys" width="100px" align="center">
        <template slot-scope="{row}">
          <span style="float:left">{{ row.subsys }}</span>
        </template>
      </el-table-column>
      <el-table-column label="TOP_Module" min-width="150px" align="center">
        <template slot-scope="{row}">
          <span style="float:left">{{ row.topmodule }}</span>
        </template>
      </el-table-column>
      <el-table-column label="TAG" width="246px" align="center">
        <template slot-scope="{row}">
          <span style="float:left">{{ row.tag }}</span>
        </template>
      </el-table-column>
      <el-table-column label="FileList" header-align="center" align="center" width="50px" style="width: 10%;margin-top: 20px">
        <el-table-column label="Dup" header-align="center" align="center" width="51px">
          <template slot-scope="{row}">
            <span>{{ row.filelist_dup }}</span>
          </template>
        </el-table-column>
        <el-table-column label="P0" header-align="center" align="center" width="51px">
          <template slot-scope="{row}">
            <span>{{ row.filelist_p0 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="P1" header-align="center" align="center" width="51px">
          <template slot-scope="{row}">
            <span>{{ row.filelist_p1 }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="IUS" width="51px" align="center">
        <el-table-column label="Com" header-align="center" align="center" width="55px">
          <template slot-scope="{row}">
            <span>{{ row.ius_error }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="DefineChk" header-align="center" align="center" width="50px" style="width: 10%;margin-top: 20px">
        <el-table-column label="Red" header-align="center" align="center" width="51px">
          <template slot-scope="{row}">
            <span>{{ row.define_chk_red }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Gro" header-align="center" align="center" width="51px">
          <template slot-scope="{row}">
            <span>{{ row.define_chk_gro }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Lat" header-align="center" align="center" width="51px">
          <template slot-scope="{row}">
            <span>{{ row.define_chk_lat }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="ParamsChk" header-align="center" align="center" width="50px" style="width: 10%;margin-top: 20px">
        <el-table-column label="Fat" header-align="center" align="center" width="46px">
          <template slot-scope="{row}">
            <span>{{ row.params_chk_fat }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Err" header-align="center" align="center" width="46px">
          <template slot-scope="{row}">
            <span>{{ row.params_chk_err }}</span>
          </template>
        </el-table-column>
        <el-table-column label="War" header-align="center" align="center" width="51px">
          <template slot-scope="{row}">
            <span>{{ row.params_chk_war }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="SpyLint" header-align="center" align="center" width="50px" style="width: 10%;margin-top: 20px">
        <el-table-column label="Bui" header-align="center" align="center" width="46px">
          <template slot-scope="{row}">
            <span>{{ row.spylint_bui }}</span>
          </template>
        </el-table-column>
        <el-table-column label="P0" header-align="center" align="center" width="43px">
          <template slot-scope="{row}">
            <span>{{ row.spylint_p0 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="P1" header-align="center" align="center" width="43px">
          <template slot-scope="{row}">
            <span>{{ row.spylint_p1 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="P2" header-align="center" align="center" width="43px">
          <template slot-scope="{row}">
            <span>{{ row.spylint_p2 }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="Lop" width="50px" align="center">
        <el-table-column label="Com" header-align="center" align="center" width="55px">
          <template slot-scope="{row}">
            <span>{{ row.lop_com }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="SpySdc" header-align="center" align="center" width="50px" style="width: 10%;margin-top: 20px">
        <el-table-column label="Bui" header-align="center" align="left" width="46px">
          <template slot-scope="{row}">
            <span>{{ row.spysdc_bui }}</span>
          </template>
        </el-table-column>
        <el-table-column label="P0" header-align="center" align="center" width="43px">
          <template slot-scope="{row}">
            <span>{{ row.spysdc_p0 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="P1" header-align="center" align="center" width="43px">
          <template slot-scope="{row}">
            <span>{{ row.spysdc_p1 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="P2" header-align="center" align="center" width="43px">
          <template slot-scope="{row}">
            <span>{{ row.spysdc_p2 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="UCr" header-align="center" align="center" width="50px">
          <template slot-scope="{row}">
            <span>{{ row.spysdc_ucr }}</span>
          </template>
        </el-table-column>
        <el-table-column label="UCi" header-align="center" align="center" width="50px">
          <template slot-scope="{row}">
            <span>{{ row.spysdc_uci }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="SpyCdc" header-align="center" align="center" width="50px" style="width: 10%;margin-top: 20px">
        <el-table-column label="Bui" header-align="center" align="center" width="46px">
          <template slot-scope="{row}">
            <span>{{ row.spycdc_bui }}</span>
          </template>
        </el-table-column>
        <el-table-column label="P0" header-align="center" align="center" width="43px">
          <template slot-scope="{row}">
            <span>{{ row.spycdc_p0 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="P1" header-align="center" align="center" width="43px">
          <template slot-scope="{row}">
            <span>{{ row.spycdc_p1 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="P2" header-align="center" align="center" width="43px">
          <template slot-scope="{row}">
            <span>{{ row.spycdc_p2 }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="SpyDft" header-align="center" align="center" width="50px" style="width: 10%;margin-top: 20px">
        <el-table-column label="Bui" header-align="center" align="left" width="46px">
          <template slot-scope="{row}">
            <span>{{ row.spydft_bui }}</span>
          </template>
        </el-table-column>
        <el-table-column label="P0" header-align="center" align="center" width="43px">
          <template slot-scope="{row}">
            <span>{{ row.spydft_p0 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="P1" header-align="center" align="center" width="43px">
          <template slot-scope="{row}">
            <span>{{ row.spydft_p1 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="P2" header-align="center" align="center" width="43px">
          <template slot-scope="{row}">
            <span>{{ row.spydft_p2 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Fau" header-align="center" align="center" width="61px">
          <template slot-scope="{row}">
            <span>{{ row.spydft_fau }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="CLP" header-align="center" align="center" width="50px" style="width: 10%;margin-top: 20px">
        <el-table-column label="P0" header-align="center" align="center" width="43px">
          <template slot-scope="{row}">
            <span>{{ row.clp_p0 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="P1" header-align="center" align="center" width="43px">
          <template slot-scope="{row}">
            <span>{{ row.clp_p1 }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="ETC" header-align="center" align="center" width="50px" style="width: 10%;margin-top: 20px">
        <el-table-column label="Err" header-align="center" align="center" width="45px">
          <template slot-scope="{row}">
            <span>{{ row.etc_err }}</span>
          </template>
        </el-table-column>
        <el-table-column label="War" header-align="center" align="center" width="51px">
          <template slot-scope="{row}">
            <span>{{ row.etc_war }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="ERC" header-align="center" align="center" width="50px" style="width: 10%;margin-top: 20px">
        <el-table-column label="Cod" header-align="center" align="center" width="51px">
          <template slot-scope="{row}">
            <span>{{ row.erc_cod }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Doc" header-align="center" align="center" width="51px">
          <template slot-scope="{row}">
            <span>{{ row.erc_doc }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="MTBF" header-align="center" align="center" width="50px" style="width: 10%;margin-top: 20px">
        <el-table-column label="Dat" header-align="center" align="center" width="51px">
          <template slot-scope="{row}">
            <span>{{ row.mtbf_dat }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Res" header-align="center" align="center" width="51px">
          <template slot-scope="{row}">
            <span>{{ row.mtbf_res }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Pos" header-align="center" align="center" width="51px">
          <template slot-scope="{row}">
            <span>{{ row.mtbf_pos }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="Latest_Goodcode" width="246px" align="center">
        <template slot-scope="{row}">
          <span style="float:left">{{ row.lat_tag }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Owner" width="130px" align="center">
        <template slot-scope="{row}">
          <span style="float:left">{{ row.owner }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Submitter" width="130px" align="center">
        <template slot-scope="{row}">
          <span style="float:left">{{ row.submitter }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<style>
.el-table__body tr.current-row>td {
  background-color: #d0d0d0 !important
}
</style>

<script>
import { fetchList, fetchPv, createRegr, updateRegr } from '@/api/regression'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

console.log('Time : 06-08 fetchList is :', fetchList)

export default {
  name: 'RegrDB',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      showed_data: null,
      total: 0,
      listLoading: true,
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
        sort: '+id',
        start: '',
        end: ''
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    sortChange(data) {
      const { prop, order } = data
      console.log('Time:06_17: sort data', data)
      if (prop === 'id') {
        this.sortByID(order)
      }
      if (prop === 'timestamp') {
        this.sortByDate(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    sortByDate(order) {
      if (order === 'ascending') {
        this.listQuery.timestamp = '+id'
      } else {
        this.listQuery.timestamp = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        proj_name: '',
        status: 'published',
        type: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createRegr(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateRegr(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['Date', 'Project', 'Sub_sys', 'TOP_Module', 'TAG', 'FileList_dup', 'FileList_p0', 'Filelist_p1', 'IUS_err', 'DefineChk_red', 'DefineChk_gro', 'DefineChk_lat', 'Params_chk_Fat', 'Params_chk_err', 'Params_chk_war',
          'SpyLint_bui', 'SpyLint_p0', 'SpyLint_p1', 'SpyLint_p2', 'Lop_com', 'SpySdc_bui', 'SpySdc_p0', 'SpySdc_p1', 'SpySdc_p2', 'SpySdc_ucr', 'SpySdc_uci', 'SpyCdc_bui', 'SpyCdc_p0', 'SpyCdc_p1', 'SpyCdc_p2', 'SpyDft_bui', 'SpyDft_p0',
          'SpyDft_p1', 'SpyDft_p2', 'SpyDft_Fau', 'CLP_p0', 'CLP_p1', 'ETC_err', 'ETC_war', 'ERC_cod', 'ERC_doc', 'MTBF_dat', 'MTBF_res', 'MTBF_pos', 'Latest_Goodcode', 'Owner']
        const filterVal = ['timestamp', 'proj_name', 'subsys', 'topmodule', 'tag', 'filelist_dup', 'filelist_p0', 'filelist_p1', 'ius_err', 'define_chk_red', 'define_chk_gro', 'define_chk_lat', 'params_chk_fat', 'params_chk_err', 'params_chk_war',
          'spylint_bui', 'spylint_p0', 'spylint_p1', 'spylint_p2', 'lop_com', 'spysdc_bui', 'spysdc_p1', 'spysdc_p2', 'spysdc_ucr', 'spysdc_uci', 'spysdc_bui', 'spycdc_bui', 'spycdc_p0', 'spycdc_p1', 'spycdc_p2', 'spydft_bui', 'spydft_p0',
          'spydft_p1', 'spydft_p2', 'spydft_fau', 'clp_p0', 'clp_p1', 'etc_err', 'etc_war', 'erc_cod', 'erc_doc', 'mtbf_dat', 'mtbf_res', 'mtbf_pos', 'lat_tag', 'owner']
        const data = this.formatJson(filterVal)
        console.log('Time:06-10: excel data is:', data)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'Regression_Results'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        console.log('Time:06-09: this.list is :', this.list)
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    },
    getSortClassdate: function(key) {
      const sort = this.listQuery.timestamp
      return sort === `+${key}` ? 'ascending' : 'descending'
    },
    // 修改table header的背景颜色
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return 'background-color: #2d96ff;color: #000000;font-weight:20;padding:2px;'
      }
      if (rowIndex === 1) {
        return 'background-color: #d6c70c;color: #000000;font-weight:10;padding:2px;'
      }
    },
    // 修改cell的背景颜色
    addClass({ row, column, rowIndex, columnIndex }) {
      if (columnIndex >= 0 && columnIndex <= 3) {
        return 'padding:0px;'
      }
      if (columnIndex === 44 || columnIndex === 45 || columnIndex === 46) {
        return 'padding:0px;'
      }
      if (columnIndex === 4) {
        if (row.tag !== row.lat_tag) {
          return 'background-color: red; padding:0px; color: white'
        } else {
          return 'padding:0px; color: black'
        }
      }
      if (columnIndex === 5) {
        if (row.filelist_dup === '0') {
          return 'background-color: green; padding:0px; color: white'
        } else if (row.filelist_dup <= 10) {
          return 'background-color: #dddd00; padding:0px; color: black'
        } else if (row.filelist_dup > 10) {
          return 'background-color: #fb79f4; padding:0px; color: white'
        } else if (row.filelist_dup === 'SE') {
          return 'background-color: red; padding:0px; color: white'
        } else if (row.filelist_dup === 'NA') {
          return 'background-color: gray; padding:0px; color: white'
        }
      }
      if (columnIndex === 6) {
        if (row.filelist_p0 === '0') {
          return 'background-color: green; padding:0px; color: white'
        } else if (row.filelist_p0 <= 10) {
          return 'background-color: #dddd00; padding:0px; color: black'
        } else if (row.filelist_p0 > 10) {
          return 'background-color: #fb79f4; padding:0px; color: white'
        } else if (row.filelist_p0 === 'SE') {
          return 'background-color: red; padding:0px; color: white'
        } else if (row.filelist_p0 === 'NA') {
          return 'background-color: gray; padding:0px; color: white'
        }
      }
      if (columnIndex === 7) {
        if (row.filelist_p1 === '0') {
          return 'background-color: green; padding:0px; color: white'
        } else if (row.filelist_p1 <= 10) {
          return 'background-color: #dddd00; padding:0px; color: black'
        } else if (row.filelist_p1 > 10) {
          return 'background-color: #fb79f4; padding:0px; color: white'
        } else if (row.filelist_p1 === 'SE') {
          return 'background-color: red; padding:0px; color: white'
        } else if (row.filelist_p1 === 'NA') {
          return 'background-color: gray; padding:0px; color: white'
        }
      }
      if (columnIndex === 8) {
        if (row.ius_error === '0') {
          return 'background-color: green; padding:0px; color: white'
        } else if (row.ius_error <= 10) {
          return 'background-color: #dddd00; padding:0px; color: black'
        } else if (row.ius_error > 10) {
          return 'background-color: #fb79f4; padding:0px; color: white'
        } else if (row.ius_error === 'SE') {
          return 'background-color: red; padding:0px; color: white'
        } else if (row.ius_error === 'NA') {
          return 'background-color: gray; padding:0px; color: white'
        }
      }
      if (columnIndex === 9) {
        if (row.define_chk_red === '0') {
          return 'background-color: green; padding:0px; color: white'
        } else if (row.define_chk_red <= 10) {
          return 'background-color: #dddd00; padding:0px; color: black'
        } else if (row.define_chk_red > 10) {
          return 'background-color: #fb79f4; padding:0px; color: white'
        } else if (row.define_chk_red === 'SE') {
          return 'background-color: red; padding:0px; color: white'
        } else if (row.define_chk_red === 'NA') {
          return 'background-color: gray; padding:0px; color: white'
        }
      }
      if (columnIndex === 10) {
        if (row.define_chk_gro === '0') {
          return 'background-color: green; padding:0px; color: white'
        } else if (row.define_chk_gro <= 10) {
          return 'background-color: #dddd00; padding:0px; color: black'
        } else if (row.define_chk_gro > 10) {
          return 'background-color: #fb79f4; padding:0px; color: white'
        } else if (row.define_chk_gro === 'SE') {
          return 'background-color: red; padding:0px; color: white'
        } else if (row.define_chk_gro === 'NA') {
          return 'background-color: gray; padding:0px; color: white'
        }
      }
      if (columnIndex === 11) {
        if (row.define_chk_lat === '0') {
          return 'background-color: green; padding:0px; color: white'
        } else if (row.define_chk_lat <= 10) {
          return 'background-color: #dddd00; padding:0px; color: black'
        } else if (row.define_chk_lat > 10) {
          return 'background-color: #fb79f4; padding:0px; color: white'
        } else if (row.define_chk_lat === 'SE') {
          return 'background-color: red; padding:0px; color: white'
        } else if (row.define_chk_lat === 'NA') {
          return 'background-color: gray; padding:0px; color: white'
        }
      }
      if (columnIndex === 12) {
        if (row.params_chk_fat === '0') {
          return 'background-color: green; padding:0px; color: white'
        } else if (row.params_chk_fat <= 10) {
          return 'background-color: #dddd00; padding:0px; color: black'
        } else if (row.params_chk_fat > 10) {
          return 'background-color: #fb79f4; padding:0px; color: white'
        } else if (row.params_chk_fat === 'SE') {
          return 'background-color: red; padding:0px; color: white'
        } else if (row.params_chk_fat === 'NA') {
          return 'background-color: gray; padding:0px; color: white'
        }
      }
      if (columnIndex === 13) {
        if (row.params_chk_err === '0') {
          return 'background-color: green; padding:0px; color: white'
        } else if (row.params_chk_err <= 10) {
          return 'background-color: #dddd00; padding:0px; color: black'
        } else if (row.params_chk_err > 10) {
          return 'background-color: #fb79f4; padding:0px; color: white'
        } else if (row.params_chk_err === 'SE') {
          return 'background-color: red; padding:0px; color: white'
        } else if (row.params_chk_err === 'NA') {
          return 'background-color: gray; padding:0px; color: white'
        }
      }
      if (columnIndex === 14) {
        if (row.params_chk_war === '0') {
          return 'background-color: green; padding:0px; color: white'
        } else if (row.params_chk_war <= 10) {
          return 'background-color: #dddd00; padding:0px; color: black'
        } else if (row.params_chk_war > 10) {
          return 'background-color: #fb79f4; padding:0px; color: white'
        } else if (row.params_chk_war === 'SE') {
          return 'background-color: red; padding:0px; color: white'
        } else if (row.params_chk_war === 'NA') {
          return 'background-color: gray; padding:0px; color: white'
        }
      }
      if (columnIndex === 15) {
        if (row.spylint_bui === '0') {
          return 'background-color: green; padding:0px; color: white'
        } else if (row.spylint_bui <= 10) {
          return 'background-color: #dddd00; padding:0px; color: black'
        } else if (row.spylint_bui > 10) {
          return 'background-color: #fb79f4; padding:0px; color: white'
        } else if (row.spylint_bui === 'SE') {
          return 'background-color: red; padding:0px; color: white'
        } else if (row.spylint_bui === 'NA') {
          return 'background-color: gray; padding:0px; color: white'
        }
      }
      if (columnIndex === 16) {
        if (row.spylint_p0 === '0') {
          return 'background-color: green; padding:0px; color: white'
        } else if (row.spylint_p0 <= 10) {
          return 'background-color: #dddd00; padding:0px; color: black'
        } else if (row.spylint_p0 > 10) {
          return 'background-color: #fb79f4; padding:0px; color: white'
        } else if (row.spylint_p0 === 'SE') {
          return 'background-color: red; padding:0px; color: white'
        } else if (row.spylint_p0 === 'NA') {
          return 'background-color: gray; padding:0px; color: white'
        }
      }
      if (columnIndex === 17) {
        if (row.spylint_p1 === '0') {
          return 'background-color: green; padding:0px; color: white'
        } else if (row.spylint_p1 <= 10) {
          return 'background-color: #dddd00; padding:0px; color: black'
        } else if (row.spylint_p1 > 10) {
          return 'background-color: #fb79f4; padding:0px; color: white'
        } else if (row.spylint_p1 === 'SE') {
          return 'background-color: red; padding:0px; color: white'
        } else if (row.spylint_p1 === 'NA') {
          return 'background-color: gray; padding:0px; color: white'
        }
      }
      if (columnIndex === 18) {
        if (row.spylint_p2 === '0') {
          return 'background-color: green; padding:0px; color: white'
        } else if (row.spylint_p2 <= 10) {
          return 'background-color: #dddd00; padding:0px; color: black'
        } else if (row.spylint_p2 > 10) {
          return 'background-color: #fb79f4; padding:0px; color: white'
        } else if (row.spylint_p2 === 'SE') {
          return 'background-color: red; padding:0px; color: white'
        } else if (row.spylint_p2 === 'NA') {
          return 'background-color: gray; padding:0px; color: white'
        }
      }
      if (columnIndex === 19) {
        if (row.lop_com === '0') {
          return 'background-color: green; padding:0px; color: white'
        } else if (row.lop_com <= 10) {
          return 'background-color: #dddd00; padding:0px; color: black'
        } else if (row.lop_com > 10) {
          return 'background-color: #fb79f4; padding:0px; color: white'
        } else if (row.lop_com === 'SE') {
          return 'background-color: red; padding:0px; color: white'
        } else if (row.lop_com === 'NA') {
          return 'background-color: gray; padding:0px; color: white'
        }
      }
      if (columnIndex === 20) {
        if (row.spysdc_bui === '0') {
          return 'background-color: green; padding:0px; color: white'
        } else if (row.spysdc_bui <= 10) {
          return 'background-color: #dddd00; padding:0px; color: black'
        } else if (row.spysdc_bui > 10) {
          return 'background-color: #fb79f4; padding:0px; color: white'
        } else if (row.spysdc_bui === 'SE') {
          return 'background-color: red; padding:0px; color: white'
        } else if (row.spysdc_bui === 'NA') {
          return 'background-color: gray; padding:0px; color: white'
        }
      }
      if (columnIndex === 21) {
        if (row.spysdc_p0 === '0') {
          return 'background-color: green; padding:0px; color: white'
        } else if (row.spysdc_p0 <= 10) {
          return 'background-color: #dddd00; padding:0px; color: black'
        } else if (row.spysdc_p0 > 10) {
          return 'background-color: #fb79f4; padding:0px; color: white'
        } else if (row.spysdc_p0 === 'SE') {
          return 'background-color: red; padding:0px; color: white'
        } else if (row.spysdc_p0 === 'NA') {
          return 'background-color: gray; padding:0px; color: white'
        }
      }
      if (columnIndex === 22) {
        if (row.spysdc_p1 === '0') {
          return 'background-color: green; padding:0px; color: white'
        } else if (row.spysdc_p1 <= 10) {
          return 'background-color: #dddd00; padding:0px; color: black'
        } else if (row.spysdc_p1 > 10) {
          return 'background-color: #fb79f4; padding:0px; color: white'
        } else if (row.spysdc_p1 === 'SE') {
          return 'background-color: red; padding:0px; color: white'
        } else if (row.spysdc_p1 === 'NA') {
          return 'background-color: gray; padding:0px; color: white'
        }
      }
      if (columnIndex === 23) {
        if (row.spysdc_p2 === '0') {
          return 'background-color: green; padding:0px; color: white'
        } else if (row.spysdc_p2 <= 10) {
          return 'background-color: #dddd00; padding:0px; color: black'
        } else if (row.spysdc_p2 > 10) {
          return 'background-color: #fb79f4; padding:0px; color: white'
        } else if (row.spysdc_p2 === 'SE') {
          return 'background-color: red; padding:0px; color: white'
        } else if (row.spysdc_p2 === 'NA') {
          return 'background-color: gray; padding:0px; color: white'
        }
      }
      if (columnIndex === 24) {
        if (row.spysdc_ucr === '0') {
          return 'background-color: green; padding:0px; color: white'
        } else if (row.spysdc_ucr <= 10) {
          return 'background-color: #dddd00; padding:0px; color: black'
        } else if (row.spysdc_ucr > 10) {
          return 'background-color: #fb79f4; padding:0px; color: white'
        } else if (row.spysdc_ucr === 'SE') {
          return 'background-color: red; padding:0px; color: white'
        } else if (row.spysdc_ucr === 'NA') {
          return 'background-color: gray; padding:0px; color: white'
        }
      }
      if (columnIndex === 25) {
        if (row.spysdc_uci === '0') {
          return 'background-color: green; padding:0px; color: white'
        } else if (row.spysdc_uci <= 10) {
          return 'background-color: #dddd00; padding:0px; color: black'
        } else if (row.spysdc_uci > 10) {
          return 'background-color: #fb79f4; padding:0px; color: white'
        } else if (row.spysdc_uci === 'SE') {
          return 'background-color: red; padding:0px; color: white'
        } else if (row.spysdc_uci === 'NA') {
          return 'background-color: gray; padding:0px; color: white'
        }
      }
      if (columnIndex === 26) {
        if (row.spycdc_bui === '0') {
          return 'background-color: green; padding:0px; color: white'
        } else if (row.spycdc_bui <= 10) {
          return 'background-color: #dddd00; padding:0px; color: black'
        } else if (row.spycdc_bui > 10) {
          return 'background-color: #fb79f4; padding:0px; color: white'
        } else if (row.spycdc_bui === 'SE') {
          return 'background-color: red; padding:0px; color: white'
        } else if (row.spycdc_bui === 'NA') {
          return 'background-color: gray; padding:0px; color: white'
        }
      }
      if (columnIndex === 27) {
        if (row.spycdc_p0 === '0') {
          return 'background-color: green; padding:0px; color: white'
        } else if (row.spycdc_p0 <= 10) {
          return 'background-color: #dddd00; padding:0px; color: black'
        } else if (row.spycdc_p0 > 10) {
          return 'background-color: #fb79f4; padding:0px; color: white'
        } else if (row.spycdc_p0 === 'SE') {
          return 'background-color: red; padding:0px; color: white'
        } else if (row.spycdc_p0 === 'NA') {
          return 'background-color: gray; padding:0px; color: white'
        }
      }
      if (columnIndex === 28) {
        if (row.spycdc_p1 === '0') {
          return 'background-color: green; padding:0px; color: white'
        } else if (row.spycdc_p1 <= 10) {
          return 'background-color: #dddd00; padding:0px; color: black'
        } else if (row.spycdc_p1 > 10) {
          return 'background-color: #fb79f4; padding:0px; color: white'
        } else if (row.spycdc_p1 === 'SE') {
          return 'background-color: red; padding:0px; color: white'
        } else if (row.spycdc_p1 === 'NA') {
          return 'background-color: gray; padding:0px; color: white'
        }
      }
      if (columnIndex === 29) {
        if (row.spycdc_p2 === '0') {
          return 'background-color: green; padding:0px; color: white'
        } else if (row.spycdc_p2 <= 10) {
          return 'background-color: #dddd00; padding:0px; color: black'
        } else if (row.spycdc_p2 > 10) {
          return 'background-color: #fb79f4; padding:0px; color: white'
        } else if (row.spycdc_p2 === 'SE') {
          return 'background-color: red; padding:0px; color: white'
        } else if (row.spycdc_p2 === 'NA') {
          return 'background-color: gray; padding:0px; color: white'
        }
      }
      if (columnIndex === 30) {
        if (row.spydft_bui === '0') {
          return 'background-color: green; padding:0px; color: white'
        } else if (row.spydft_bui <= 10) {
          return 'background-color: #dddd00; padding:0px; color: black'
        } else if (row.spydft_bui > 10) {
          return 'background-color: #fb79f4; padding:0px; color: white'
        } else if (row.spydft_bui === 'SE') {
          return 'background-color: red; padding:0px; color: white'
        } else if (row.spydft_bui === 'NA') {
          return 'background-color: gray; padding:0px; color: white'
        }
      }
      if (columnIndex === 31) {
        if (row.spydft_p0 === '0') {
          return 'background-color: green; padding:0px; color: white'
        } else if (row.spydft_p0 <= 10) {
          return 'background-color: #dddd00; padding:0px; color: black'
        } else if (row.spydft_p0 > 10) {
          return 'background-color: #fb79f4; padding:0px; color: white'
        } else if (row.spydft_p0 === 'SE') {
          return 'background-color: red; padding:0px; color: white'
        } else if (row.spydft_p0 === 'NA') {
          return 'background-color: gray; padding:0px; color: white'
        }
      }
      if (columnIndex === 32) {
        if (row.spydft_p1 === '0') {
          return 'background-color: green; padding:0px; color: white'
        } else if (row.spydft_p1 <= 10) {
          return 'background-color: #dddd00; padding:0px; color: black'
        } else if (row.spydft_p1 > 10) {
          return 'background-color: #fb79f4; padding:0px; color: white'
        } else if (row.spydft_p1 === 'SE') {
          return 'background-color: red; padding:0px; color: white'
        } else if (row.spydft_p1 === 'NA') {
          return 'background-color: gray; padding:0px; color: white'
        }
      }
      if (columnIndex === 33) {
        if (row.spydft_p2 === '0') {
          return 'background-color: green; padding:0px; color: white'
        } else if (row.spydft_p2 <= 10) {
          return 'background-color: #dddd00; padding:0px; color: black'
        } else if (row.spydft_p2 > 10) {
          return 'background-color: #fb79f4; padding:0px; color: white'
        } else if (row.spydft_p2 === 'SE') {
          return 'background-color: red; padding:0px; color: white'
        } else if (row.spydft_p2 === 'NA') {
          return 'background-color: gray; padding:0px; color: white'
        }
      }
      if (columnIndex === 34) {
        if (row.spydft_fau.replace('%', '') >= 90) {
          return 'background-color: green; padding:0px; color: white'
        } else if (row.spydft_fau.replace('%', '') < 90) {
          return 'background-color: #fb79f4; padding:0px; color: white'
        } else if (row.spydft_fau === 'SE') {
          return 'background-color: red; padding:0px; color: white'
        } else if (row.spydft_fau === 'NA') {
          return 'background-color: gray; padding:0px; color: white'
        }
      }
      if (columnIndex === 35) {
        if (row.clp_p0 === '0') {
          return 'background-color: green; padding:0px; color: white'
        } else if (row.clp_p0 <= 10) {
          return 'background-color: #dddd00; padding:0px; color: black'
        } else if (row.clp_p0 > 10) {
          return 'background-color: #fb79f4; padding:0px; color: white'
        } else if (row.clp_p0 === 'SE') {
          return 'background-color: red; padding:0px; color: white'
        } else if (row.clp_p0 === 'NA') {
          return 'background-color: gray; padding:0px; color: white'
        }
      }
      if (columnIndex === 36) {
        if (row.clp_p1 === '0') {
          return 'background-color: green; padding:0px; color: white'
        } else if (row.clp_p1 <= 10) {
          return 'background-color: #dddd00; padding:0px; color: black'
        } else if (row.clp_p1 > 10) {
          return 'background-color: #fb79f4; padding:0px; color: white'
        } else if (row.clp_p1 === 'SE') {
          return 'background-color: red; padding:0px; color: white'
        } else if (row.clp_p1 === 'NA') {
          return 'background-color: gray; padding:0px; color: white'
        }
      }
      if (columnIndex === 37) {
        if (row.etc_err === '0') {
          return 'background-color: green; padding:0px; color: white'
        } else if (row.etc_err <= 10) {
          return 'background-color: #dddd00; padding:0px; color: black'
        } else if (row.etc_err > 10) {
          return 'background-color: #fb79f4; padding:0px; color: white'
        } else if (row.etc_err === 'SE') {
          return 'background-color: red; padding:0px; color: white'
        } else if (row.etc_err === 'NA') {
          return 'background-color: gray; padding:0px; color: white'
        }
      }
      if (columnIndex === 38) {
        if (row.etc_war === '0') {
          return 'background-color: green; padding:0px; color: white'
        } else if (row.etc_war <= 10) {
          return 'background-color: #dddd00; padding:0px; color: black'
        } else if (row.etc_war > 10) {
          return 'background-color: #fb79f4; padding:0px; color: white'
        } else if (row.etc_war === 'SE') {
          return 'background-color: red; padding:0px; color: white'
        } else if (row.etc_war === 'NA') {
          return 'background-color: gray; padding:0px; color: white'
        }
      }
      if (columnIndex === 39) {
        if (row.erc_cod === '0') {
          return 'background-color: green; padding:0px; color: white'
        } else if (row.erc_cod <= 10) {
          return 'background-color: #dddd00; padding:0px; color: black'
        } else if (row.erc_cod > 10) {
          return 'background-color: #fb79f4; padding:0px; color: white'
        } else if (row.erc_cod === 'SE') {
          return 'background-color: red; padding:0px; color: white'
        } else if (row.erc_cod === 'NA') {
          return 'background-color: gray; padding:0px; color: white'
        }
      }
      if (columnIndex === 40) {
        if (row.erc_doc === '0') {
          return 'background-color: green; padding:0px; color: white'
        } else if (row.erc_doc <= 10) {
          return 'background-color: #dddd00; padding:0px; color: black'
        } else if (row.erc_doc > 10) {
          return 'background-color: #fb79f4; padding:0px; color: white'
        } else if (row.erc_doc === 'SE') {
          return 'background-color: red; padding:0px; color: white'
        } else if (row.erc_doc === 'NA') {
          return 'background-color: gray; padding:0px; color: white'
        }
      }
      if (columnIndex === 41) {
        if (row.mtbf_dat === '0') {
          return 'background-color: green; padding:0px; color: white'
        } else if (row.mtbf_dat <= 10) {
          return 'background-color: #dddd00; padding:0px; color: black'
        } else if (row.mtbf_dat > 10) {
          return 'background-color: #fb79f4; padding:0px; color: white'
        } else if (row.mtbf_dat === 'SE') {
          return 'background-color: red; padding:0px; color: white'
        } else if (row.mtbf_dat === 'NA') {
          return 'background-color: gray; padding:0px; color: white'
        }
      }
      if (columnIndex === 42) {
        if (row.mtbf_res === '0') {
          return 'background-color: green; padding:0px; color: white'
        } else if (row.mtbf_res <= 10) {
          return 'background-color: #dddd00; padding:0px; color: black'
        } else if (row.mtbf_res > 10) {
          return 'background-color: #fb79f4; padding:0px; color: white'
        } else if (row.mtbf_res === 'SE') {
          return 'background-color: red; padding:0px; color: white'
        } else if (row.mtbf_res === 'NA') {
          return 'background-color: gray; padding:0px; color: white'
        }
      }
      if (columnIndex === 43) {
        if (row.mtbf_pos === '0') {
          return 'background-color: green; padding:0px; color: white'
        } else if (row.mtbf_pos <= 10) {
          return 'background-color: #dddd00; padding:0px; color: black'
        } else if (row.mtbf_pos > 10) {
          return 'background-color: #fb79f4; padding:0px; color: white'
        } else if (row.mtbf_pos === 'SE') {
          return 'background-color: red; padding:0px; color: white'
        } else if (row.mtbf_pos === 'NA') {
          return 'background-color: gray; padding:0px; color: white'
        }
      }
    }
  }
}
</script>
