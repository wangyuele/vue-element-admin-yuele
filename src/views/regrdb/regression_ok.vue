<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.proj_name" placeholder="Project" style="width: 90px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.subsys" placeholder="Sub_sys" style="width: 90px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.topmodule" placeholder="TOP_Module" clearable class="filter-item" style="width: 132px" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.tag" placeholder="TAG" clearable class="filter-item" style="width: 130px" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.owner" placeholder="Owner" clearable class="filter-item" style="width: 130px" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        Add
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        Export
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      height="700"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      :cell-class-name="addClass"
      :header-cell-style="tableHeaderColor"
      :header-row-style="{height:'20px'}"
      :row-style="{height:'20px'}"
      :cell-style="{padding:'0px'}"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="60" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Date" width="140px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Project" min-width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.proj_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Sub_sys" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.subsys }}</span>
        </template>
      </el-table-column>
      <el-table-column label="TOP_Module" min-width="160px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.topmodule }}</span>
        </template>
      </el-table-column>
      <el-table-column label="TAG" width="250px" align="center">
        <template slot-scope="{row}">
          <el-tag v-if="row.tag!==row.lat_tag" type="danger" color="red" effect="dark" size="small">{{ row.tag }}</el-tag>
          <span v-if="row.tag===row.lat_tag">{{ row.tag }}</span>
        </template>
      </el-table-column>
      <el-table-column label="FileList" header-align="center" align="center" width="50px" style="width: 10%;margin-top: 20px">
        <el-table-column label="Dup" header-align="center" align="left" width="55px">
          <template slot-scope="{row}">
            <el-tag v-if="row.filelist_dup==='0'" type="success" color="green" effect="dark" size="small">{{ row.filelist_dup }}</el-tag>
            <el-tag v-else-if="row.filelist_dup<=10" type="warning" effect="dark" size="small">{{ row.filelist_dup }}</el-tag>
            <el-tag v-else-if="row.filelist_dup>10" type="danger" effect="dark" size="small">{{ row.filelist_dup }}</el-tag>
            <el-tag v-else-if="row.filelist_dup==='NA'" type="info" effect="dark" size="small">{{ row.filelist_dup }}</el-tag>
            <el-tag v-else color="red" type="danger" effect="dark" size="small">{{ row.filelist_dup }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="P0" header-align="center" align="center" width="55px">
          <template slot-scope="{row}">
            <el-tag v-if="row.filelist_p0==='0'" type="success" color="green" effect="dark" size="small">{{ row.filelist_p0 }}</el-tag>
            <el-tag v-else-if="row.filelist_p0<=10" type="warning" effect="dark" size="small">{{ row.filelist_p0 }}</el-tag>
            <el-tag v-else-if="row.filelist_p0>10" type="danger" effect="dark" size="small">{{ row.filelist_p0 }}</el-tag>
            <el-tag v-else-if="row.filelist_p0==='NA'" type="info" effect="dark" size="small">{{ row.filelist_p0 }}</el-tag>
            <el-tag v-else type="danger" color="pink" effect="light" size="small">{{ row.filelist_p0 }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="P1" header-align="center" align="center" width="55px">
          <template slot-scope="{row}">
            <el-tag v-if="row.filelist_p1==='0'" type="success" color="green" effect="dark" size="small">{{ row.filelist_p1 }}</el-tag>
            <el-tag v-else-if="row.filelist_p1<=10" type="warning" effect="dark" size="small">{{ row.filelist_p1 }}</el-tag>
            <el-tag v-else-if="row.filelist_p1>10" type="danger" effect="dark" size="small">{{ row.filelist_p1 }}</el-tag>
            <el-tag v-else-if="row.filelist_p1==='NA'" type="info" effect="dark" size="small">{{ row.filelist_p1 }}</el-tag>
            <el-tag v-else type="danger" color="red" effect="dark" size="small">{{ row.filelist_p1 }}</el-tag>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="IUS" width="55px" align="center">
        <el-table-column label="Com" header-align="center" align="center" width="55px">
          <template slot-scope="{row}">
            <el-tag v-if="row.ius_error==='0'" type="success" color="green" effect="dark" size="small">{{ row.ius_error }}</el-tag>
            <el-tag v-else-if="row.ius_error<=10" type="warning" effect="dark" size="small">{{ row.ius_error }}</el-tag>
            <el-tag v-else-if="row.ius_error>10" type="danger" effect="dark" size="small">{{ row.ius_error }}</el-tag>
            <el-tag v-else-if="row.ius_error==='NA'" type="info" effect="dark" size="small">{{ row.ius_error }}</el-tag>
            <el-tag v-else type="danger" color="red" effect="dark" size="small">{{ row.ius_error }}</el-tag>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="DefineChk" header-align="center" align="center" width="50px" style="width: 10%;margin-top: 20px">
        <el-table-column label="Red" header-align="center" align="left" width="55px">
          <template slot-scope="{row}">
            <el-tag v-if="row.define_chk_red==='0'" type="success" color="green" effect="dark" size="small">{{ row.define_chk_red }}</el-tag>
            <el-tag v-else-if="row.define_chk_red<=10" type="warning" effect="dark" size="small">{{ row.define_chk_red }}</el-tag>
            <el-tag v-else-if="row.define_chk_red>10" type="danger" effect="dark" size="small">{{ row.define_chk_red }}</el-tag>
            <el-tag v-else-if="row.define_chk_red==='NA'" type="info" effect="dark" size="small">{{ row.define_chk_red }}</el-tag>
            <el-tag v-else color="red" type="danger" effect="dark" size="small">{{ row.define_chk_red }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Gro" header-align="center" align="center" width="55px">
          <template slot-scope="{row}">
            <el-tag v-if="row.define_chk_gro==='0'" type="success" color="green" effect="dark" size="small">{{ row.define_chk_gro }}</el-tag>
            <el-tag v-else-if="row.define_chk_gro<=10" type="warning" effect="dark" size="small">{{ row.define_chk_gro }}</el-tag>
            <el-tag v-else-if="row.define_chk_gro>10" type="danger" effect="dark" size="small">{{ row.define_chk_gro }}</el-tag>
            <el-tag v-else-if="row.define_chk_gro==='NA'" type="info" effect="dark" size="small">{{ row.define_chk_gro }}</el-tag>
            <el-tag v-else type="danger" color="pink" effect="light" size="small">{{ row.define_chk_gro }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Lat" header-align="center" align="center" width="55px">
          <template slot-scope="{row}">
            <el-tag v-if="row.define_chk_lat==='0'" type="success" color="green" effect="dark" size="small">{{ row.define_chk_lat }}</el-tag>
            <el-tag v-else-if="row.define_chk_lat<=10" type="warning" effect="dark" size="small">{{ row.define_chk_lat }}</el-tag>
            <el-tag v-else-if="row.define_chk_lat>10" type="danger" effect="dark" size="small">{{ row.define_chk_lat }}</el-tag>
            <el-tag v-else-if="row.define_chk_lat==='NA'" type="info" effect="dark" size="small">{{ row.define_chk_lat }}</el-tag>
            <el-tag v-else type="danger" color="red" effect="dark" size="small">{{ row.define_chk_lat }}</el-tag>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="ParamsChk" header-align="center" align="center" width="50px" style="width: 10%;margin-top: 20px">
        <el-table-column label="Fat" header-align="center" align="left" width="55px">
          <template slot-scope="{row}">
            <el-tag v-if="row.params_chk_fat==='0'" type="success" color="green" effect="dark" size="small">{{ row.params_chk_fat }}</el-tag>
            <el-tag v-else-if="row.params_chk_fat<=10" type="warning" effect="dark" size="small">{{ row.params_chk_fat }}</el-tag>
            <el-tag v-else-if="row.params_chk_fat>10" type="danger" effect="dark" size="small">{{ row.params_chk_fat }}</el-tag>
            <el-tag v-else-if="row.params_chk_fat==='NA'" type="info" effect="dark" size="small">{{ row.params_chk_fat }}</el-tag>
            <el-tag v-else color="red" type="danger" effect="dark" size="small">{{ row.params_chk_fat }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Err" header-align="center" align="center" width="55px">
          <template slot-scope="{row}">
            <el-tag v-if="row.params_chk_err==='0'" type="success" color="green" effect="dark" size="small">{{ row.params_chk_err }}</el-tag>
            <el-tag v-else-if="row.params_chk_err<=10" type="warning" effect="dark" size="small">{{ row.params_chk_err }}</el-tag>
            <el-tag v-else-if="row.params_chk_err>10" type="danger" effect="dark" size="small">{{ row.params_chk_err }}</el-tag>
            <el-tag v-else-if="row.params_chk_err==='NA'" type="info" effect="dark" size="small">{{ row.params_chk_err }}</el-tag>
            <el-tag v-else type="danger" color="pink" effect="light" size="small">{{ row.params_chk_err }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="War" header-align="center" align="center" width="55px">
          <template slot-scope="{row}">
            <el-tag v-if="row.params_chk_war==='0'" type="success" color="green" effect="dark" size="small">{{ row.params_chk_war }}</el-tag>
            <el-tag v-else-if="row.params_chk_war<=10" type="warning" effect="dark" size="small">{{ row.params_chk_war }}</el-tag>
            <el-tag v-else-if="row.params_chk_war>10" type="danger" effect="dark" size="small">{{ row.params_chk_war }}</el-tag>
            <el-tag v-else-if="row.params_chk_war==='NA'" type="info" effect="dark" size="small">{{ row.params_chk_war }}</el-tag>
            <el-tag v-else type="danger" color="red" effect="dark" size="small">{{ row.params_chk_war }}</el-tag>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="SpyLint" header-align="center" align="center" width="50px" style="width: 10%;margin-top: 20px">
        <el-table-column label="Bui" header-align="center" align="left" width="55px">
          <template slot-scope="{row}">
            <el-tag v-if="row.spylint_bui==='0'" type="success" color="green" effect="dark" size="small">{{ row.spylint_bui }}</el-tag>
            <el-tag v-else-if="row.spylint_bui<=10" type="warning" effect="dark" size="small">{{ row.spylint_bui }}</el-tag>
            <el-tag v-else-if="row.spylint_bui>10" type="danger" effect="dark" size="small">{{ row.spylint_bui }}</el-tag>
            <el-tag v-else-if="row.spylint_bui==='NA'" type="info" effect="dark" size="small">{{ row.spylint_bui }}</el-tag>
            <el-tag v-else color="red" type="danger" effect="dark" size="small">{{ row.spylint_bui }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="P0" header-align="center" align="center" width="55px">
          <template slot-scope="{row}">
            <el-tag v-if="row.spylint_p0==='0'" type="success" color="green" effect="dark" size="small">{{ row.spylint_p0 }}</el-tag>
            <el-tag v-else-if="row.spylint_p0<=10" type="warning" effect="dark" size="small">{{ row.spylint_p0 }}</el-tag>
            <el-tag v-else-if="row.spylint_p0>10" type="danger" effect="dark" size="small">{{ row.spylint_p0 }}</el-tag>
            <el-tag v-else-if="row.spylint_p0==='NA'" type="info" effect="dark" size="small">{{ row.spylint_p0 }}</el-tag>
            <el-tag v-else type="danger" color="pink" effect="light" size="small">{{ row.spylint_p0 }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="P1" header-align="center" align="center" width="55px">
          <template slot-scope="{row}">
            <el-tag v-if="row.spylint_p1==='0'" type="success" color="green" effect="dark" size="small">{{ row.spylint_p1 }}</el-tag>
            <el-tag v-else-if="row.spylint_p1<=10" type="warning" effect="dark" size="small">{{ row.spylint_p1 }}</el-tag>
            <el-tag v-else-if="row.spylint_p1>10" type="danger" effect="dark" size="small">{{ row.spylint_p1 }}</el-tag>
            <el-tag v-else-if="row.spylint_p1==='NA'" type="info" effect="dark" size="small">{{ row.spylint_p1 }}</el-tag>
            <el-tag v-else type="danger" color="red" effect="dark" size="small">{{ row.spylint_p1 }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="P2" header-align="center" align="center" width="55px">
          <template slot-scope="{row}">
            <el-tag v-if="row.spylint_p2==='0'" type="success" color="green" effect="dark" size="small">{{ row.spylint_p2 }}</el-tag>
            <el-tag v-else-if="row.spylint_p2<=10" type="warning" effect="dark" size="small">{{ row.spylint_p2 }}</el-tag>
            <el-tag v-else-if="row.spylint_p2>10" type="danger" effect="dark" size="small">{{ row.spylint_p2 }}</el-tag>
            <el-tag v-else-if="row.spylint_p2==='NA'" type="info" effect="dark" size="small">{{ row.spylint_p2 }}</el-tag>
            <el-tag v-else type="danger" color="red" effect="dark" size="small">{{ row.spylint_p2 }}</el-tag>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="Lop" width="55px" align="center">
        <el-table-column label="Com" header-align="center" align="center" width="55px">
          <template slot-scope="{row}">
            <el-tag v-if="row.lop_com==='0'" type="success" color="green" effect="dark" size="small">{{ row.lop_com }}</el-tag>
            <el-tag v-else-if="row.lop_com<=10" type="warning" effect="dark" size="small">{{ row.lop_com }}</el-tag>
            <el-tag v-else-if="row.lop_com>10" type="danger" effect="dark" size="small">{{ row.lop_com }}</el-tag>
            <el-tag v-else-if="row.lop_com==='NA'" type="info" effect="dark" size="small">{{ row.lop_com }}</el-tag>
            <el-tag v-else type="danger" color="red" effect="dark" size="small">{{ row.lop_com }}</el-tag>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="SpySdc" header-align="center" align="center" width="50px" style="width: 10%;margin-top: 20px">
        <el-table-column label="Bui" header-align="center" align="left" width="55px">
          <template slot-scope="{row}">
            <el-tag v-if="row.spysdc_bui==='0'" type="success" color="green" effect="dark" size="small">{{ row.spysdc_bui }}</el-tag>
            <el-tag v-else-if="row.spysdc_bui<=10" type="warning" effect="dark" size="small">{{ row.spysdc_bui }}</el-tag>
            <el-tag v-else-if="row.spysdc_bui>10" type="danger" effect="dark" size="small">{{ row.spysdc_bui }}</el-tag>
            <el-tag v-else-if="row.spysdc_bui==='NA'" type="info" effect="dark" size="small">{{ row.spysdc_bui }}</el-tag>
            <el-tag v-else color="red" type="danger" effect="dark" size="small">{{ row.spysdc_bui }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="P0" header-align="center" align="center" width="55px">
          <template slot-scope="{row}">
            <el-tag v-if="row.spysdc_p0==='0'" type="success" color="green" effect="dark" size="small">{{ row.spysdc_p0 }}</el-tag>
            <el-tag v-else-if="row.spysdc_p0<=10" type="warning" effect="dark" size="small">{{ row.spysdc_p0 }}</el-tag>
            <el-tag v-else-if="row.spysdc_p0>10" type="danger" effect="dark" size="small">{{ row.spysdc_p0 }}</el-tag>
            <el-tag v-else-if="row.spysdc_p0==='NA'" type="info" effect="dark" size="small">{{ row.spysdc_p0 }}</el-tag>
            <el-tag v-else type="danger" color="pink" effect="light" size="small">{{ row.spysdc_p0 }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="P1" header-align="center" align="center" width="55px">
          <template slot-scope="{row}">
            <el-tag v-if="row.spysdc_p1==='0'" type="success" color="green" effect="dark" size="small">{{ row.spysdc_p1 }}</el-tag>
            <el-tag v-else-if="row.spysdc_p1<=10" type="warning" effect="dark" size="small">{{ row.spysdc_p1 }}</el-tag>
            <el-tag v-else-if="row.spysdc_p1>10" type="danger" effect="dark" size="small">{{ row.spysdc_p1 }}</el-tag>
            <el-tag v-else-if="row.spysdc_p1==='NA'" type="info" effect="dark" size="small">{{ row.spysdc_p1 }}</el-tag>
            <el-tag v-else type="danger" color="red" effect="dark" size="small">{{ row.spysdc_p1 }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="P2" header-align="center" align="center" width="55px">
          <template slot-scope="{row}">
            <el-tag v-if="row.spysdc_p2==='0'" type="success" color="green" effect="dark" size="small">{{ row.spysdc_p2 }}</el-tag>
            <el-tag v-else-if="row.spysdc_p2<=10" type="warning" effect="dark" size="small">{{ row.spysdc_p2 }}</el-tag>
            <el-tag v-else-if="row.spysdc_p2>10" type="danger" effect="dark" size="small">{{ row.spysdc_p2 }}</el-tag>
            <el-tag v-else-if="row.spysdc_p2==='NA'" type="info" effect="dark" size="small">{{ row.spysdc_p2 }}</el-tag>
            <el-tag v-else type="danger" color="red" effect="dark" size="small">{{ row.spysdc_p2 }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="UCr" header-align="center" align="center" width="55px">
          <template slot-scope="{row}">
            <el-tag v-if="row.spysdc_ucr==='0'" type="success" color="green" effect="dark" size="small">{{ row.spysdc_ucr }}</el-tag>
            <el-tag v-else-if="row.spysdc_ucr<=10" type="warning" effect="dark" size="small">{{ row.spysdc_ucr }}</el-tag>
            <el-tag v-else-if="row.spysdc_ucr>10" type="danger" effect="dark" size="small">{{ row.spysdc_ucr }}</el-tag>
            <el-tag v-else-if="row.spysdc_ucr==='NA'" type="info" effect="dark" size="small">{{ row.spysdc_ucr }}</el-tag>
            <el-tag v-else type="danger" color="red" effect="dark" size="small">{{ row.spysdc_ucr }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="UCi" header-align="center" align="center" width="55px">
          <template slot-scope="{row}">
            <el-tag v-if="row.spysdc_uci==='0'" type="success" color="green" effect="dark" size="small">{{ row.spysdc_uci }}</el-tag>
            <el-tag v-else-if="row.spysdc_uci<=10" type="warning" effect="dark" size="small">{{ row.spysdc_uci }}</el-tag>
            <el-tag v-else-if="row.spysdc_uci>10" type="danger" effect="dark" size="small">{{ row.spysdc_uci }}</el-tag>
            <el-tag v-else-if="row.spysdc_uci==='NA'" type="info" effect="dark" size="small">{{ row.spysdc_uci }}</el-tag>
            <el-tag v-else type="danger" color="red" effect="dark" size="small">{{ row.spysdc_uci }}</el-tag>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="SpyCdc" header-align="center" align="center" width="50px" style="width: 10%;margin-top: 20px">
        <el-table-column label="Bui" header-align="center" align="left" width="55px">
          <template slot-scope="{row}">
            <el-tag v-if="row.spycdc_bui==='0'" type="success" color="green" effect="dark" size="small">{{ row.spycdc_bui }}</el-tag>
            <el-tag v-else-if="row.spycdc_bui<=10" type="warning" effect="dark" size="small">{{ row.spycdc_bui }}</el-tag>
            <el-tag v-else-if="row.spycdc_bui>10" type="danger" effect="dark" size="small">{{ row.spycdc_bui }}</el-tag>
            <el-tag v-else-if="row.spycdc_bui==='NA'" type="info" effect="dark" size="small">{{ row.spycdc_bui }}</el-tag>
            <el-tag v-else color="red" type="danger" effect="dark" size="small">{{ row.spycdc_bui }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="P0" header-align="center" align="center" width="55px">
          <template slot-scope="{row}">
            <el-tag v-if="row.spycdc_p0==='0'" type="success" color="green" effect="dark" size="small">{{ row.spycdc_p0 }}</el-tag>
            <el-tag v-else-if="row.spycdc_p0<=10" type="warning" effect="dark" size="small">{{ row.spycdc_p0 }}</el-tag>
            <el-tag v-else-if="row.spycdc_p0>10" type="danger" effect="dark" size="small">{{ row.spycdc_p0 }}</el-tag>
            <el-tag v-else-if="row.spycdc_p0==='NA'" type="info" effect="dark" size="small">{{ row.spycdc_p0 }}</el-tag>
            <el-tag v-else type="danger" color="pink" effect="light" size="small">{{ row.spycdc_p0 }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="P1" header-align="center" align="center" width="55px">
          <template slot-scope="{row}">
            <el-tag v-if="row.spycdc_p1==='0'" type="success" color="green" effect="dark" size="small">{{ row.spycdc_p1 }}</el-tag>
            <el-tag v-else-if="row.spycdc_p1<=10" type="warning" effect="dark" size="small">{{ row.spycdc_p1 }}</el-tag>
            <el-tag v-else-if="row.spycdc_p1>10" type="danger" effect="dark" size="small">{{ row.spycdc_p1 }}</el-tag>
            <el-tag v-else-if="row.spycdc_p1==='NA'" type="info" effect="dark" size="small">{{ row.spycdc_p1 }}</el-tag>
            <el-tag v-else type="danger" color="red" effect="dark" size="small">{{ row.spycdc_p1 }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="P2" header-align="center" align="center" width="55px">
          <template slot-scope="{row}">
            <el-tag v-if="row.spycdc_p2==='0'" type="success" color="green" effect="dark" size="small">{{ row.spycdc_p2 }}</el-tag>
            <el-tag v-else-if="row.spycdc_p2<=10" type="warning" effect="dark" size="small">{{ row.spycdc_p2 }}</el-tag>
            <el-tag v-else-if="row.spycdc_p2>10" type="danger" effect="dark" size="small">{{ row.spycdc_p2 }}</el-tag>
            <el-tag v-else-if="row.spycdc_p2==='NA'" type="info" effect="dark" size="small">{{ row.spycdc_p2 }}</el-tag>
            <el-tag v-else type="danger" color="red" effect="dark" size="small">{{ row.spycdc_p2 }}</el-tag>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="SpyDft" header-align="center" align="center" width="50px" style="width: 10%;margin-top: 20px">
        <el-table-column label="Bui" header-align="center" align="left" width="55px">
          <template slot-scope="{row}">
            <el-tag v-if="row.spydft_bui==='0'" type="success" color="green" effect="dark" size="small">{{ row.spydft_bui }}</el-tag>
            <el-tag v-else-if="row.spydft_bui<=10" type="warning" effect="dark" size="small">{{ row.spydft_bui }}</el-tag>
            <el-tag v-else-if="row.spydft_bui>10" type="danger" effect="dark" size="small">{{ row.spydft_bui }}</el-tag>
            <el-tag v-else-if="row.spydft_bui==='NA'" type="info" effect="dark" size="small">{{ row.spydft_bui }}</el-tag>
            <el-tag v-else color="red" type="danger" effect="dark" size="small">{{ row.spydft_bui }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="P0" header-align="center" align="center" width="55px">
          <template slot-scope="{row}">
            <el-tag v-if="row.spydft_p0==='0'" type="success" color="green" effect="dark" size="small">{{ row.spydft_p0 }}</el-tag>
            <el-tag v-else-if="row.spydft_p0<=10" type="warning" effect="dark" size="small">{{ row.spydft_p0 }}</el-tag>
            <el-tag v-else-if="row.spydft_p0>10" type="danger" effect="dark" size="small">{{ row.spydft_p0 }}</el-tag>
            <el-tag v-else-if="row.spydft_p0==='NA'" type="info" effect="dark" size="small">{{ row.spydft_p0 }}</el-tag>
            <el-tag v-else type="danger" color="pink" effect="light" size="small">{{ row.spydft_p0 }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="P1" header-align="center" align="center" width="55px">
          <template slot-scope="{row}">
            <el-tag v-if="row.spydft_p1==='0'" type="success" color="green" effect="dark" size="small">{{ row.spydft_p1 }}</el-tag>
            <el-tag v-else-if="row.spydft_p1<=10" type="warning" effect="dark" size="small">{{ row.spydft_p1 }}</el-tag>
            <el-tag v-else-if="row.spydft_p1>10" type="danger" effect="dark" size="small">{{ row.spydft_p1 }}</el-tag>
            <el-tag v-else-if="row.spydft_p1==='NA'" type="info" effect="dark" size="small">{{ row.spydft_p1 }}</el-tag>
            <el-tag v-else type="danger" color="red" effect="dark" size="small">{{ row.spydft_p1 }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="P2" header-align="center" align="center" width="55px">
          <template slot-scope="{row}">
            <el-tag v-if="row.spydft_p2==='0'" type="success" color="green" effect="dark" size="small">{{ row.spydft_p2 }}</el-tag>
            <el-tag v-else-if="row.spydft_p2<=10" type="warning" effect="dark" size="small">{{ row.spydft_p2 }}</el-tag>
            <el-tag v-else-if="row.spydft_p2>10" type="danger" effect="dark" size="small">{{ row.spydft_p2 }}</el-tag>
            <el-tag v-else-if="row.spydft_p2==='NA'" type="info" effect="dark" size="small">{{ row.spydft_p2 }}</el-tag>
            <el-tag v-else type="danger" color="red" effect="dark" size="small">{{ row.spydft_p2 }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Fau" header-align="center" align="center" width="70px">
          <template slot-scope="{row}">
            <el-tag v-if="row.spydft_fau.replace('%','')>=90" type="success" color="green" effect="dark" size="small">{{ row.spydft_fau }}</el-tag>
            <el-tag v-else-if="row.spydft_fau==='NA'" type="info" effect="dark" size="small">{{ row.spydft_fau }}</el-tag>
            <el-tag v-else type="danger" color="red" effect="dark" size="small">{{ row.spydft_fau }}</el-tag>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="CLP" header-align="center" align="center" width="50px" style="width: 10%;margin-top: 20px">
        <el-table-column label="P0" header-align="center" align="left" width="55px">
          <template slot-scope="{row}">
            <el-tag v-if="row.clp_p0==='0'" type="success" color="green" effect="dark" size="small">{{ row.clp_p0 }}</el-tag>
            <el-tag v-else-if="row.clp_p0<=10" type="warning" effect="dark" size="small">{{ row.clp_p0 }}</el-tag>
            <el-tag v-else-if="row.clp_p0>10" type="danger" effect="dark" size="small">{{ row.clp_p0 }}</el-tag>
            <el-tag v-else-if="row.clp_p0==='NA'" type="info" effect="dark" size="small">{{ row.clp_p0 }}</el-tag>
            <el-tag v-else color="red" type="danger" effect="dark" size="small">{{ row.clp_p0 }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="P1" header-align="center" align="center" width="55px">
          <template slot-scope="{row}">
            <el-tag v-if="row.clp_p1==='0'" type="success" color="green" effect="dark" size="small">{{ row.clp_p1 }}</el-tag>
            <el-tag v-else-if="row.clp_p1<=10" type="warning" effect="dark" size="small">{{ row.clp_p1 }}</el-tag>
            <el-tag v-else-if="row.clp_p1>10" type="danger" effect="dark" size="small">{{ row.clp_p1 }}</el-tag>
            <el-tag v-else-if="row.clp_p1==='NA'" type="info" effect="dark" size="small">{{ row.clp_p1 }}</el-tag>
            <el-tag v-else type="danger" color="pink" effect="light" size="small">{{ row.clp_p1 }}</el-tag>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="ETC" header-align="center" align="center" width="50px" style="width: 10%;margin-top: 20px">
        <el-table-column label="Err" header-align="center" align="left" width="55px">
          <template slot-scope="{row}">
            <el-tag v-if="row.etc_err==='0'" type="success" color="green" effect="dark" size="small">{{ row.etc_err }}</el-tag>
            <el-tag v-else-if="row.etc_err<=10" type="warning" effect="dark" size="small">{{ row.etc_err }}</el-tag>
            <el-tag v-else-if="row.etc_err>10" type="danger" effect="dark" size="small">{{ row.etc_err }}</el-tag>
            <el-tag v-else-if="row.etc_err==='NA'" type="info" effect="dark" size="small">{{ row.etc_err }}</el-tag>
            <el-tag v-else color="red" type="danger" effect="dark" size="small">{{ row.etc_err }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="War" header-align="center" align="center" width="55px">
          <template slot-scope="{row}">
            <el-tag v-if="row.etc_war==='0'" type="success" color="green" effect="dark" size="small">{{ row.etc_war }}</el-tag>
            <el-tag v-else-if="row.etc_war<=10" type="warning" effect="dark" size="small">{{ row.etc_war }}</el-tag>
            <el-tag v-else-if="row.etc_war>10" type="danger" effect="dark" size="small">{{ row.etc_war }}</el-tag>
            <el-tag v-else-if="row.etc_war==='NA'" type="info" effect="dark" size="small">{{ row.etc_war }}</el-tag>
            <el-tag v-else type="danger" color="pink" effect="light" size="small">{{ row.etc_war }}</el-tag>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="ERC" header-align="center" align="center" width="50px" style="width: 10%;margin-top: 20px">
        <el-table-column label="CoD" header-align="center" align="left" width="55px">
          <template slot-scope="{row}">
            <el-tag v-if="row.erc_cod==='0'" type="success" color="green" effect="dark" size="small">{{ row.erc_cod }}</el-tag>
            <el-tag v-else-if="row.erc_cod<=10" type="warning" effect="dark" size="small">{{ row.erc_cod }}</el-tag>
            <el-tag v-else-if="row.erc_cod>10" type="danger" effect="dark" size="small">{{ row.erc_cod }}</el-tag>
            <el-tag v-else-if="row.erc_cod==='NA'" type="info" effect="dark" size="small">{{ row.erc_cod }}</el-tag>
            <el-tag v-else color="red" type="danger" effect="dark" size="small">{{ row.erc_cod }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Doc" header-align="center" align="center" width="55px">
          <template slot-scope="{row}">
            <el-tag v-if="row.etc_war==='0'" type="success" color="green" effect="dark" size="small">{{ row.erc_doc }}</el-tag>
            <el-tag v-else-if="row.erc_doc<=10" type="warning" effect="dark" size="small">{{ row.erc_doc }}</el-tag>
            <el-tag v-else-if="row.erc_doc>10" type="danger" effect="dark" size="small">{{ row.erc_doc }}</el-tag>
            <el-tag v-else-if="row.erc_doc==='NA'" type="info" effect="dark" size="small">{{ row.erc_doc }}</el-tag>
            <el-tag v-else type="danger" color="pink" effect="light" size="small">{{ row.erc_doc }}</el-tag>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="MTBF" header-align="center" align="center" width="50px" style="width: 10%;margin-top: 20px">
        <el-table-column label="Dat" header-align="center" align="left" width="55px">
          <template slot-scope="{row}">
            <el-tag v-if="row.mtbf_dat==='0'" type="success" color="green" effect="dark" size="small">{{ row.mtbf_dat }}</el-tag>
            <el-tag v-else-if="row.mtbf_dat<=10" type="warning" effect="dark" size="small">{{ row.mtbf_dat }}</el-tag>
            <el-tag v-else-if="row.mtbf_dat>10" type="danger" effect="dark" size="small">{{ row.mtbf_dat }}</el-tag>
            <el-tag v-else-if="row.mtbf_dat==='NA'" type="info" effect="dark" size="small">{{ row.mtbf_dat }}</el-tag>
            <el-tag v-else color="red" type="danger" effect="dark" size="small">{{ row.mtbf_dat }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Res" header-align="center" align="center" width="55px">
          <template slot-scope="{row}">
            <el-tag v-if="row.mtbf_res==='0'" type="success" color="green" effect="dark" size="small">{{ row.mtbf_res }}</el-tag>
            <el-tag v-else-if="row.mtbf_res<=10" type="warning" effect="dark" size="small">{{ row.mtbf_res }}</el-tag>
            <el-tag v-else-if="row.mtbf_res>10" type="danger" effect="dark" size="small">{{ row.mtbf_res }}</el-tag>
            <el-tag v-else-if="row.mtbf_res==='NA'" type="info" effect="dark" size="small">{{ row.mtbf_res }}</el-tag>
            <el-tag v-else type="danger" color="pink" effect="light" size="small">{{ row.mtbf_res }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Pos" header-align="center" align="center" width="55px">
          <template slot-scope="{row}">
            <el-tag v-if="row.mtbf_pos==='0'" type="success" color="green" effect="dark" size="small">{{ row.mtbf_pos }}</el-tag>
            <el-tag v-else-if="row.mtbf_pos<=10" type="warning" effect="dark" size="small">{{ row.mtbf_pos }}</el-tag>
            <el-tag v-else-if="row.mtbf_pos>10" type="danger" effect="dark" size="small">{{ row.mtbf_pos }}</el-tag>
            <el-tag v-else-if="row.mtbf_pos==='NA'" type="info" effect="dark" size="small">{{ row.mtbf_pos }}</el-tag>
            <el-tag v-else type="danger" color="pink" effect="light" size="small">{{ row.mtbf_pos }}</el-tag>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="Latest_Goodcode" width="250px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.lat_tag }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Owner" width="130px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.owner }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="Type" prop="type">
          <el-select v-model="temp.type" class="filter-item" placeholder="Please select">
            <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="Date" prop="timestamp">
          <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date" />
        </el-form-item>
        <el-form-item label="Title" prop="proj_name">
          <el-input v-model="temp.proj_name" />
        </el-form-item>
        <el-form-item label="Status">
          <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="Imp">
          <el-rate v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top:8px;" />
        </el-form-item>
        <el-form-item label="Remark">
          <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, fetchPv, createRegr, updateRegr } from '@/api/regression'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

console.log('Time : 06-08 fetchList is :', fetchList)

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

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
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
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
        timestamp: '+id',
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        proj_name: '',
        type: '',
        status: 'published'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        proj_name: [{ required: true, message: 'proj_name is required', trigger: 'blur' }]
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
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
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
    addClass({ row, column, rowIndex, columnIndex }) {
      if (row.proj_name === 'Orca') {
        console.log('Time:06-16: rowIndex,row', rowIndex, row)
        return 'background-color: red'
      }
    },
    // 修改table tr行的背景颜色
    tableRowStyle({ row, rowIndex }) {
      return 'background-color: pink'
    },
    // 修改table header的背景颜色
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return 'background-color: #2d96ff;color: #000000;font-weight:10;'
      }
      if (rowIndex === 1) {
        return 'background-color: #d6c70c;color: #000000;font-weight:10;'
      }
    }
  }
}
</script>
