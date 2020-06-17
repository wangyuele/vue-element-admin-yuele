import Mock from 'mockjs'

const List = []
const count = 100

const baseContent = '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>'
const image_uri = 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3'

var project_list = ['SharkL6', 'SharkL6Pro', 'SharkL5', 'Orca', 'KounurK8']
var sys_list = ['ap_sys', 'wcn_sys', 'gpu_sys', 'wcn_sys', 'top']
var top_module = ['vsp_wrap', 'ap_top_pwr_wrap', 'gnss_sys_top', 'sharkl6_top', 'natt_ee_top']
var tag = ['DE_ap_sys_0075_comp_goodcode', 'DE_ap_sys_0076_comp_goodcode', 'DE_ap_sys_0077_comp_goodcode']
var owner = ['yuele.wang', 'hank.wang', 'guandong.wang', 'peizhuo.zhang']
var dft_fau = ['10%', '40%', '89.9%', '91.5%', '90%', '95%', '100%', 'NA', 'SE']
var filelist_dup = ['0', '6', '10', '20', 'SE', 'NA']
for (let i = 0; i < count; i++) {
  var regr_data = Mock.mock({
    'proj_name|1': project_list,
    'sys_name|1': sys_list,
    'top_module|1': top_module,
    'tag|1': tag,
    'dft_fau|1': dft_fau,
    'filelist_dup|1': filelist_dup,
    'owner|1': owner
  })
  List.push(Mock.mock({
    id: '@increment',
    timestamp: +Mock.Random.date('T'),
    owner: regr_data.owner,
    reviewer: '@first',
    proj_name: regr_data.proj_name,
    subsys: regr_data.sys_name,
    topmodule: regr_data.top_module,
    tag: regr_data.tag,
    lat_tag: 'DE_ap_sys_0077_comp_goodcode',
    filelist_dup: regr_data.filelist_dup,
    filelist_p0: '6',
    filelist_p1: '20',
    ius_error: 'NA',
    define_chk_red: '0',
    define_chk_gro: '10',
    define_chk_lat: '25',
    params_chk_fat: '0',
    params_chk_err: '12',
    params_chk_war: '26',
    spylint_bui: 'SE',
    spylint_p0: '0',
    spylint_p1: '13',
    spylint_p2: '30',
    lop_com: '50',
    spysdc_bui: 'SE',
    spysdc_p0: '0',
    spysdc_p1: '13',
    spysdc_p2: '30',
    spysdc_ucr: '13',
    spysdc_uci: '30',
    spycdc_bui: 'SE',
    spycdc_p0: '0',
    spycdc_p1: '13',
    spycdc_p2: '30',
    spydft_bui: 'SE',
    spydft_p0: '0',
    spydft_p1: '13',
    spydft_p2: '30',
    spydft_fau: regr_data.dft_fau,
    clp_p0: '0',
    clp_p1: '0',
    etc_err: '0',
    etc_war: '0',
    erc_cod: '0',
    erc_doc: '0',
    mtbf_dat: '0',
    mtbf_res: '0',
    mtbf_pos: '0',
    content_short: 'mock data',
    content: baseContent,
    display_time: '@datetime',
    comment_disabled: true,
    pageviews: '@integer(300, 5000)',
    image_uri,
    platforms: ['a-platform']
  }))
}

export default [
  {
    url: '/vue-element-admin/regression/list',
    type: 'get',
    response: config => {
      console.log('Time: 06-17 config.query is :', config.query)
      const { proj_name, page = 1, limit = 30, sort, subsys, topmodule, tag, owner, timestamp } = config.query
      let mockList = List.filter(item => {
        if (proj_name && item.proj_name.indexOf(proj_name) < 0) return false
        if (subsys && item.subsys.indexOf(subsys) < 0) return false
        if (topmodule && item.topmodule.indexOf(topmodule) < 0) return false
        if (tag && item.tag.indexOf(tag) < 0) return false
        if (owner && item.owner.indexOf(owner) < 0) return false
        return true
      })

      if (sort === '-id') {
        mockList = mockList.reverse()
      }

      console.log('Time: 06-17 timestamp is :', timestamp)
      function sortFun(prop, order) {
        // 第一个参数传入info里的prop表示排的是哪一列，第二个参数是升还是降排序
        console.log('Time:06-17,flag2 :', order)
        if (order == null) {
          order = 1
        } else {
          order = (order) ? 1 : -1
        }

        return function(a, b) {
          a = a[prop]
          b = b[prop]
          if (a < b) {
            return order * -1
          }
          if (a > b) {
            return order * 1
          }
          return 0
        }
      }
      if (timestamp !== null) {
        console.log('Time: 06-17 flag_here')
        mockList = mockList.sort(sortFun('timestamp', false))
        console.log('Time: 06-17 mockList is :', mockList)
      }

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  },

  {
    url: '/vue-element-admin/regression/detail',
    type: 'get',
    response: config => {
      const { id } = config.query
      for (const regression of List) {
        if (regression.id === +id) {
          return {
            code: 20000,
            data: regression
          }
        }
      }
    }
  },

  {
    url: '/vue-element-admin/regression/pv',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: {
          pvData: [
            { key: 'PC', pv: 1024 },
            { key: 'mobile', pv: 1024 },
            { key: 'ios', pv: 1024 },
            { key: 'android', pv: 1024 }
          ]
        }
      }
    }
  },

  {
    url: '/vue-element-admin/regression/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/vue-element-admin/regression/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]

