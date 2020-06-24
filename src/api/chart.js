import request from '@/utils/request'

export function fetchData(query) {
  return request({
    url: '/vue-element-admin/regrdb/list',
    method: 'get',
    params: query
  })
}

