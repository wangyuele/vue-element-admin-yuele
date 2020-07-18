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

      <el-button v-waves type="primary" style="margin-left: 10px;padding:8px" icon="el-icon-search" @click="dialogVisible = true">
        LintChart
      </el-button>

      <el-dialog
        title="Chart"
        :visible.sync="dialogVisible"
        width="60%"
        top="10vh"
        :before-close="handleClose"
        append-to-body
        center
        @open="open()"
        @change="change_chart()"
      >
        <el-select v-model="value" placeholder="请选择" @change="change_chart(value)">
          <el-option
            v-for="item in check_item"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-form :inline="true" size="max" label-width="100px">
          <el-row :gutter="180">
            <el-col :xs="500" :sm="500" :md="500" :lg="500">
              <el-form-item v-if="ShownLINT" label="Lint Chart">
                <div :id="id" :class="className" :style="{height:height,width:width}" />
              </el-form-item>
              <el-form-item v-if="ShownCDC" label="CDC Chart">
                <div :id="id" :class="className" :style="{height:height,width:width}" />
              </el-form-item>
              <el-form-item v-if="ShownDFT" label="DFT Chart">
                <div :id="id" :class="className" :style="{height:height,width:width}" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="22" style="text-align:right;padding:0px;margin-right: 10px">
              <el-button type="primary" size="small">确定</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-dialog>
    </div>

    <el-table
      ref="multipleTable"
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
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="40" />
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

// insert chart
import echarts from 'echarts'
// import resize from './mixins/resize'
// added by yuele for test
// cdc test data
var _data = [
  { 'Time Serie': '2020-07-01', 'ap_sys': '10', 'wcn_sys': '15', 'aud_cp_sys': '36', 'gpu_sys': '41', 'mm__sys': '62', 'wtl_cp_sys': '80', 'pub_sys': '190', 'top': '300' },
  { 'Time Serie': '2020-07-02', 'ap_sys': '20', 'wcn_sys': '16', 'aud_cp_sys': '30', 'gpu_sys': '42', 'mm__sys': '65', 'wtl_cp_sys': '81', 'pub_sys': '180', 'top': '310' },
  { 'Time Serie': '2020-07-03', 'ap_sys': '10', 'wcn_sys': '17', 'aud_cp_sys': '31', 'gpu_sys': '43', 'mm__sys': '66', 'wtl_cp_sys': '82', 'pub_sys': '170', 'top': '320' },
  { 'Time Serie': '2020-07-04', 'ap_sys': '14', 'wcn_sys': '18', 'aud_cp_sys': '32', 'gpu_sys': '45', 'mm__sys': '67', 'wtl_cp_sys': '83', 'pub_sys': '160', 'top': '330' },
  { 'Time Serie': '2020-07-05', 'ap_sys': '16', 'wcn_sys': '19', 'aud_cp_sys': '33', 'gpu_sys': '47', 'mm__sys': '70', 'wtl_cp_sys': '84', 'pub_sys': '150', 'top': '340' },
  { 'Time Serie': '2020-07-06', 'ap_sys': '18', 'wcn_sys': '12', 'aud_cp_sys': '34', 'gpu_sys': '49', 'mm__sys': '78', 'wtl_cp_sys': '85', 'pub_sys': '140', 'top': '350' },
  { 'Time Serie': '2020-07-07', 'ap_sys': '19', 'wcn_sys': '11', 'aud_cp_sys': '35', 'gpu_sys': '50', 'mm__sys': '80', 'wtl_cp_sys': '86', 'pub_sys': '140', 'top': '360' },
  { 'Time Serie': '2020-07-08', 'ap_sys': '30', 'wcn_sys': '10', 'aud_cp_sys': '36', 'gpu_sys': '56', 'mm__sys': '85', 'wtl_cp_sys': '87', 'pub_sys': '135', 'top': '370' },
  { 'Time Serie': '2020-07-09', 'ap_sys': '40', 'wcn_sys': '17', 'aud_cp_sys': '37', 'gpu_sys': '70', 'mm__sys': '90', 'wtl_cp_sys': '88', 'pub_sys': '120', 'top': '380' }
]
/*
var sysMap = {
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
} */

var _data1 = [
  { 'Time Serie': '2020-06-01', 'ai_sys_ai_top_pwr_wrap': '12', 'ap_sys_ap_top_pwr_wrap': '15', 'audio_sys_aud_cp_pwr_wrap': '36', 'gpu_sys_gpu_top_pwr_wrap': '41', 'ipa_sys_ipa_sys_pwr_wrap': '62', 'phy_cp_sys_nr_cp_pwr_wrap': '80', 'ps_cp_sys_ps_cp_pwr_wrap': '190', 'pub_cp_sys_pub_cp_pwr_wrap': '300' },
  { 'Time Serie': '2020-06-02', 'ai_sys_ai_top_pwr_wrap': '20', 'ap_sys_ap_top_pwr_wrap': '16', 'audio_sys_aud_cp_pwr_wrap': '30', 'gpu_sys_gpu_top_pwr_wrap': '42', 'ipa_sys_ipa_sys_pwr_wrap': '65', 'phy_cp_sys_nr_cp_pwr_wrap': '81', 'ps_cp_sys_ps_cp_pwr_wrap': '180', 'pub_cp_sys_pub_cp_pwr_wrap': '310' },
  { 'Time Serie': '2020-06-03', 'ai_sys_ai_top_pwr_wrap': '10', 'ap_sys_ap_top_pwr_wrap': '17', 'audio_sys_aud_cp_pwr_wrap': '31', 'gpu_sys_gpu_top_pwr_wrap': '43', 'ipa_sys_ipa_sys_pwr_wrap': '66', 'phy_cp_sys_nr_cp_pwr_wrap': '82', 'ps_cp_sys_ps_cp_pwr_wrap': '170', 'pub_cp_sys_pub_cp_pwr_wrap': '320' },
  { 'Time Serie': '2020-06-04', 'ai_sys_ai_top_pwr_wrap': '14', 'ap_sys_ap_top_pwr_wrap': '18', 'audio_sys_aud_cp_pwr_wrap': '32', 'gpu_sys_gpu_top_pwr_wrap': '45', 'ipa_sys_ipa_sys_pwr_wrap': '67', 'phy_cp_sys_nr_cp_pwr_wrap': '83', 'ps_cp_sys_ps_cp_pwr_wrap': '160', 'pub_cp_sys_pub_cp_pwr_wrap': '330' },
  { 'Time Serie': '2020-06-05', 'ai_sys_ai_top_pwr_wrap': '16', 'ap_sys_ap_top_pwr_wrap': '19', 'audio_sys_aud_cp_pwr_wrap': '33', 'gpu_sys_gpu_top_pwr_wrap': '47', 'ipa_sys_ipa_sys_pwr_wrap': '70', 'phy_cp_sys_nr_cp_pwr_wrap': '84', 'ps_cp_sys_ps_cp_pwr_wrap': '150', 'pub_cp_sys_pub_cp_pwr_wrap': '340' },
  { 'Time Serie': '2020-06-06', 'ai_sys_ai_top_pwr_wrap': '18', 'ap_sys_ap_top_pwr_wrap': '12', 'audio_sys_aud_cp_pwr_wrap': '34', 'gpu_sys_gpu_top_pwr_wrap': '49', 'ipa_sys_ipa_sys_pwr_wrap': '78', 'phy_cp_sys_nr_cp_pwr_wrap': '85', 'ps_cp_sys_ps_cp_pwr_wrap': '140', 'pub_cp_sys_pub_cp_pwr_wrap': '350' },
  { 'Time Serie': '2020-06-07', 'ai_sys_ai_top_pwr_wrap': '19', 'ap_sys_ap_top_pwr_wrap': '11', 'audio_sys_aud_cp_pwr_wrap': '35', 'gpu_sys_gpu_top_pwr_wrap': '50', 'ipa_sys_ipa_sys_pwr_wrap': '80', 'phy_cp_sys_nr_cp_pwr_wrap': '86', 'ps_cp_sys_ps_cp_pwr_wrap': '140', 'pub_cp_sys_pub_cp_pwr_wrap': '360' },
  { 'Time Serie': '2020-06-08', 'ai_sys_ai_top_pwr_wrap': '30', 'ap_sys_ap_top_pwr_wrap': '10', 'audio_sys_aud_cp_pwr_wrap': '36', 'gpu_sys_gpu_top_pwr_wrap': '56', 'ipa_sys_ipa_sys_pwr_wrap': '85', 'phy_cp_sys_nr_cp_pwr_wrap': '87', 'ps_cp_sys_ps_cp_pwr_wrap': '135', 'pub_cp_sys_pub_cp_pwr_wrap': '370' },
  { 'Time Serie': '2020-06-09', 'ai_sys_ai_top_pwr_wrap': '40', 'ap_sys_ap_top_pwr_wrap': '17', 'audio_sys_aud_cp_pwr_wrap': '37', 'gpu_sys_gpu_top_pwr_wrap': '70', 'ipa_sys_ipa_sys_pwr_wrap': '90', 'phy_cp_sys_nr_cp_pwr_wrap': '88', 'ps_cp_sys_ps_cp_pwr_wrap': '120', 'pub_cp_sys_pub_cp_pwr_wrap': '380' }
]

const sysMap1 = {
  'ai_sys_ai_top_pwr_wrap': {
    'text': 'ai_sys_ai_top_pwr_wrap',
    'color': 'rgb(61, 234, 211)'
  },
  'ap_sys_ap_top_pwr_wrap': {
    'text': 'ap_sys_ap_top_pwr_wrap',
    'color': 'rgb(70, 234, 211)'
  },
  'audio_sys_aud_cp_pwr_wrap': {
    'text': 'audio_sys_aud_cp_pwr_wrap',
    'color': 'rgb(75, 197, 224)'
  },
  'gpu_sys_gpu_top_pwr_wrap': {
    'text': 'gpu_sys_gpu_top_pwr_wrap',
    'color': 'rgb(157, 75, 224)'
  },
  'ipa_sys_ipa_sys_pwr_wrap': {
    'text': 'ipa_sys_ipa_sys_pwr_wrap',
    'color': 'rgb(222, 75, 224)'
  },
  'phy_cp_sys_nr_cp_pwr_wrap': {
    'text': 'phy_cp_sys_nr_cp_pwr_wrap',
    'color': 'rgb(224, 75, 132)'
  },
  'ps_cp_sys_ps_cp_pwr_wrap': {
    'text': 'ps_cp_sys_ps_cp_pwr_wrap',
    'color': 'rgb(241, 198, 88)'
  },
  'pub_cp_sys_pub_cp_pwr_wrap': {
    'text': 'pub_cp_sys_pub_cp_pwr_wrap',
    'color': 'rgb(78, 175, 162)'
  }
}

let timeRange = ['2020-06-01', '2020-06-20']
// const _seriesData = []
// const xAxisData = []
// const _dataObj = {}
let legendData = []
let _lengedMax = 0
let chart = null
/*
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
  console.log('Tiem:07-03: _newDataObj', _newDataObj)
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
    console.log('Time:07-03 funcs updateLegend, legendData', legendData)
    chart.setOption({
      legend: {
        data: legendData
      }
    })
  }, 100)
}
updateLegend()
console.log('Time:07-03 Legend flag1', legendData)
*/
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
  // mixins: [resize],
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
      default: '1100px' // echart's width
    },
    height: {
      type: String,
      default: '600px' // echart's height
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
      downloadLoading: false,
      dialogVisible: false,
      // 弹框选择
      value: 'lint_data',
      check_item: [{
        value: 'lint_data',
        label: 'LINT'
      }, {
        value: 'cdc_data',
        label: 'CDC'
      }, {
        value: 'dft_data',
        label: 'DFT'
      }],
      ShownLINT: true,
      ShownCDC: false,
      ShownDFT: false,
      chart_type: 'LINT',
      multipleSelection: []
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    this.$nextTick(function() {
      this.initChart(this.chart_type)
    })
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
    initChart(chart_type) {
      // ************ Data port ***************
      // _data = this.chart_data_set(this.list,chart_type)
      // ************ Data port ***************
      _data = _data1 // test data
      // ************ Data port ***************
      console.log('Time:07-18 chart_type >>>', chart_type, _data, _data1)
      var option = this.initData_test(_data)
      console.log('Time:07-18 option', option)
      console.log('Time:07-03 Legend flag2', legendData)
      chart = echarts.init(document.getElementById(this.id))
      // setOption
      if (chart_type === 'LINT') {
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
      } else if (chart_type === 'CDC') {
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
      } else {
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
      }
      // dynamic the legend
      chart.on('datazoom', function(params) {
        console.log('Time:06-30 params', params, chart)
        var xAxis = chart.getModel().option.xAxis[0]
        console.log('Time:07-03 xAxis', xAxis)
        var startTime = xAxis.data[xAxis.rangeStart]
        var endTime = xAxis.data[xAxis.rangeEnd]
        timeRange = [startTime, endTime]
        console.log('Time:07-01 timeRange,', timeRange)
        // updateLegend()
      })
    },
    chart_data_set(page_data, chart_type) {
      var list_num = page_data.length
      var chart_page_data = []
      // var chart_page_data_tmp = []
      var chart_tmp = []
      var date_list = []
      var date_tmp = ''
      var sys_top = ''
      var data_num = 0
      var time_arry = []
      // date_list.push('2020')
      console.log('Time:07-15 list , list_num>>>', page_data, list_num)
      page_data.forEach((item, index) => {
        date_tmp = parseTime(item.timestamp, '{y}-{m}-{d} {h}:{i}').substring(0, 10)
        sys_top = item.subsys + '_' + item.topmodule
        if (date_list.indexOf(date_tmp) < 0) {
          date_list.push(item)
        }
        if (chart_type === 'LINT') {
          chart_tmp.push({
            'Time_Serie': date_tmp,
            [sys_top]: (item.spylint_p0 === 'NA' || item.spylint_p0 === 'SE') ? item.spylint_p0 : (parseInt(item.spylint_p0) + parseInt(item.spylint_p1)).toString()
          })
        } else if (chart_type === 'CDC') {
          chart_tmp.push({
            'Time_Serie': date_tmp,
            [sys_top]: (item.spycdc_p0 === 'NA' || item.spycdc_p0 === 'SE') ? item.spycdc_p0 : (parseInt(item.spycdc_p0) + parseInt(item.spycdc_p1)).toString()
          })
        } else {
          chart_tmp.push({
            'Time_Serie': date_tmp,
            [sys_top]: (item.spydft_p0 === 'NA' || item.spydft_p0 === 'SE') ? item.spydft_p0 : (parseInt(item.spydft_p0) + parseInt(item.spydft_p1)).toString()
          })
        }
        // console.log('Time:07-15 item, index, date_list >>>', item, index, date_list, date_tmp)
        // console.log('Time:07-15 date_tmp >>>', date_tmp)
        console.log('Time:07-15 chart_page_data >>>', chart_tmp, _data)
      })

      chart_tmp.forEach((time, sys) => {
        if (data_num === 0) {
          chart_page_data.push(time)
          data_num += 1
        } else {
          var chart_page_data_tmp = []
          chart_page_data_tmp = chart_page_data
          var chart_page_data_num = chart_page_data_tmp.length
          chart_page_data_tmp.forEach((item, index) => {
            // time_arry = []
            if (time_arry.indexOf(item.Time_Serie) < 0) {
              time_arry.push(item.Time_Serie)
            }
            if (index === (chart_page_data_num - 1)) {
              console.log('Time:07-17 time_arry', time_arry)
            }
          })
          var index_num = (time_arry).indexOf(time.Time_Serie)
          if (index_num >= 0) {
            var page_data_tmp = chart_page_data[index_num]
            var series_len = Object.keys(page_data_tmp).length
            console.log('Time:07-17: page_data_tmp', page_data_tmp, series_len)
            var sys_name = Object.keys(time)[1]
            var sys_index_num = (Object.keys(page_data_tmp)[1]).indexOf(sys_name)
            console.log('Time:07-17: sys_index_num', sys_index_num, sys_name)
            if (sys_index_num < 0) {
              var key_tmp = Object.keys(time)[1]
              var key_value = time[key_tmp]
              chart_page_data[index_num][key_tmp] = key_value
            }
          }
          if (index_num < 0) {
            chart_page_data.push(time)
          }
        }
        console.log('Time:07-15 chart_page_data >>>', chart_page_data)
      })
      return chart_page_data
    },
    initData_test(data) {
      console.log('Time:07-18 initData_test, data,', data, sysMap1)
      var xAxisData = []
      var _dataObj = {}
      var _seriesData = []
      var legendData = []
      data.forEach((item, index) => {
        console.log('Time:07-18,item,index', item, index)
        xAxisData.push(item['Time Serie'])
        Object.keys(item).forEach(sys => {
          if (sys !== 'Time Serie') {
            if (index === 0) {
              _dataObj[sys] = {
                name: sysMap1[sys].text,
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
                    color: sysMap1[sys].color,
                    opacity: 0.3
                  }
                },
                lineStyle: {
                  color: sysMap1[sys].color,
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
      console.log('Time：07-18 xAxisData', xAxisData)
      // create Lenda
      legendData = this.createdLegendData(data)
      console.log('Time:07-18 legendData', legendData)

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
      console.log('Time:07-18 seriesData flag1', _seriesData)
      return option
    },
    createdLegendData(data) {
      console.log('Time:07-18 createdLegendData')
      legendData = []
      const _newDataObj = {}
      const _startTime = Date.parse(timeRange[0])
      const _endTime = Date.parse(timeRange[1])
      data.forEach((item, index) => {
        const _currentTime = Date.parse(item['Time Serie'])
        console.log('Tiem:07-18: _currentTime', _currentTime)
        if (_startTime <= _currentTime && _currentTime <= _endTime) {
          Object.keys(item).forEach(country => {
            if (country !== 'Time Serie') {
              if (!_newDataObj[country]) {
                _newDataObj[country] = {
                  name: sysMap1[country].text,
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
      console.log('Tiem:07-18: _newDataObj', _newDataObj)
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
          color: sysMap1[item._name].color
        }
        item.icon = `image://data:image/svg+xml,` +
            `%3Csvg xmlns='http://www.w3.org/2000/svg'%3E` +
                `%3Cpath d='M0 260h${_dataWidth}v270H0z' fill='${sysMap1[item._name].color}'/%3E` +
                `%3Cpath fill='rgba(0, 0,0,0)' d='M${_dataWidth} 60h${maxWidth - _dataWidth}v100H100z'/%3E` +
                `%3Ctext x='${_dataWidth}' y='0' style='color: red' %3E${item.max}%3C/text%3E` +
            `%3C/svg%3E`// `path://M10 60 H ${_a / _max * maxWidth} V 70 H 10 Z`
        legendData.push(item)
      })
      console.log('Time:07-18 legendData', legendData)
      return legendData
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
    // multipleselection
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
          console.log('Time:07-02 multipleTable >>>', this.$refs.multipleTable.toggleRowSelection(row))
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      console.log('Time:07-02 multipleSelection', this.multipleSelection)
    },
    // 弹框
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    // 弹框后
    open() {
      this.$nextTick(function() {
      //  执行echarts方法
        console.log('Time:07-03 initnewchart')
        this.initChart(this.chart_type)
      })
    },
    // chart change
    change_chart(item) {
      if (item === 'lint_data') {
        this.ShownLINT = true
        this.ShownCDC = false
        this.ShownDFT = false
        console.log('Time:07-06 LINTnewchart')
        this.$nextTick(function() {
          // 执行echarts方法
          console.log('Time:07-06 initnewchart')
          this.initChart('LINT')
        })
      } else if (item === 'cdc_data') {
        this.ShownLINT = false
        this.ShownCDC = true
        this.ShownDFT = false
        console.log('Time:07-06 CDCnewchart')
        this.$nextTick(function() {
          // 执行echarts方法
          console.log('Time:07-06 initnewchart')
          this.initChart('CDC')
        })
      } else {
        this.ShownLINT = false
        this.ShownCDC = false
        this.ShownDFT = true
        console.log('Time:07-06 CDCnewchart')
        this.$nextTick(function() {
          // 执行echarts方法
          console.log('Time:07-06 initnewchart')
          this.initChart('DFT')
        })
      }
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
      if (columnIndex >= 0 && columnIndex <= 4) {
        return 'padding:0px;'
      }
      if (columnIndex === 45 || columnIndex === 46 || columnIndex === 47) {
        return 'padding:0px;'
      }
      if (columnIndex === 5) {
        if (row.tag !== row.lat_tag) {
          return 'background-color: red; padding:0px; color: white'
        } else {
          return 'padding:0px; color: black'
        }
      }
      if (columnIndex === 6) {
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
      if (columnIndex === 7) {
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
      if (columnIndex === 8) {
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
      if (columnIndex === 9) {
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
      if (columnIndex === 10) {
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
      if (columnIndex === 11) {
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
      if (columnIndex === 12) {
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
      if (columnIndex === 13) {
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
      if (columnIndex === 14) {
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
      if (columnIndex === 15) {
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
      if (columnIndex === 16) {
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
      if (columnIndex === 17) {
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
      if (columnIndex === 18) {
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
      if (columnIndex === 19) {
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
      if (columnIndex === 20) {
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
      if (columnIndex === 21) {
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
      if (columnIndex === 22) {
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
      if (columnIndex === 23) {
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
      if (columnIndex === 24) {
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
      if (columnIndex === 25) {
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
      if (columnIndex === 26) {
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
      if (columnIndex === 27) {
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
      if (columnIndex === 28) {
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
      if (columnIndex === 29) {
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
      if (columnIndex === 30) {
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
      if (columnIndex === 31) {
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
      if (columnIndex === 32) {
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
      if (columnIndex === 33) {
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
      if (columnIndex === 34) {
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
      if (columnIndex === 35) {
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
      if (columnIndex === 36) {
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
      if (columnIndex === 37) {
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
      if (columnIndex === 38) {
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
      if (columnIndex === 39) {
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
      if (columnIndex === 40) {
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
      if (columnIndex === 41) {
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
      if (columnIndex === 42) {
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
      if (columnIndex === 43) {
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
      if (columnIndex === 44) {
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
