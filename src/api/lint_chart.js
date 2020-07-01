import request from '@/utils/request'

export function fetchData(query) {
  return request({
    url: '/vue-element-admin/chart/lint_chart',
    method: 'get',
    params: query
  })
}

