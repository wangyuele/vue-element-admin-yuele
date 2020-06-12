import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/vue-element-admin/regression/list',
    method: 'get',
    params: query
  })
}

export function fetchRegr(id) {
  return request({
    url: '/vue-element-admin/regression/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/vue-element-admin/regression/pv',
    method: 'get',
    params: { pv }
  })
}

export function createRegr(data) {
  return request({
    url: '/vue-element-admin/regression/create',
    method: 'post',
    data
  })
}

export function updateRegr(data) {
  return request({
    url: '/vue-element-admin/regression/update',
    method: 'post',
    data
  })
}
