/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const ipdbRouter = {
  path: '/ipdb',
  component: Layout,
  redirect: '/ipdb/ip_release',
  name: 'IPDB',
  meta: {
    title: 'IPDB',
    icon: 'table'
  },
  children: [
    {
      path: 'dynamic-table',
      component: () => import('@/views/ipdb/dynamic-table/index'),
      name: 'DynamicTable',
      meta: { title: 'Dynamic Table' }
    },
    {
      path: 'drag-table',
      component: () => import('@/views/ipdb/drag-table'),
      name: 'DragTable',
      meta: { title: 'Drag Table' }
    },
    {
      path: 'inline-edit-table',
      component: () => import('@/views/ipdb/inline-edit-table'),
      name: 'InlineEditTable',
      meta: { title: 'Inline Edit' }
    },
    {
      path: 'ip_release',
      component: () => import('@/views/ipdb/ip_release'),
      name: 'IPDB',
      meta: { title: 'IP_Release' }
    }
  ]
}
export default ipdbRouter
