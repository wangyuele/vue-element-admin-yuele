import Mock from 'mockjs'

const List = []
const count = 100

const baseContent = '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>'
const image_uri = 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3'

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    timestamp: +Mock.Random.date('T'),
    owner: 'yuele.wang',
    reviewer: '@first',
    title: ('SharkL6', 'SharkL6Pro'),
    subsys: 'ap_sys',
    topmodule: 'apcpu_top_pwr_wrap',
    tag: 'DE_ap_sys_0075_comp_goodcode',
    lat_tag: 'DE_ap_sys_0077_comp_goodcode',
    filelist_dup: '0',
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
    spydft_fau: '90%',
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
    forecast: '@float(0, 100, 2, 2)',
    importance: '@integer(1, 3)',
    'type|1': ['CN', 'US', 'JP', 'EU'],
    'status|1': ['published', 'draft'],
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
      console.log('Time: 06-10 config.query is :', config.query)
      const { importance, type, title, page = 1, limit = 20, sort, subsys, topmodule, tag, owner } = config.query

      let mockList = List.filter(item => {
        if (importance && item.importance !== +importance) return false
        if (type && item.type !== type) return false
        if (title && item.title.indexOf(title) < 0) return false
        if (subsys && item.subsys.indexOf(subsys) < 0) return false
        if (topmodule && item.topmodule.indexOf(topmodule) < 0) return false
        if (tag && item.tag.indexOf(tag) < 0) return false
        if (owner && item.owner.indexOf(owner) < 0) return false
        return true
      })

      if (sort === '-id') {
        mockList = mockList.reverse()
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

