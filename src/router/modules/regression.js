/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const regrdbRouter = {
  path: '/regrdb',
  component: Layout,
  redirect: '/regrdb/regression',
  name: 'RegrDB',
  meta: {
    title: 'RegrDB',
    icon: 'table'
  },
  children: [
    {
      path: 'dynamic-table',
      component: () => import('@/views/regrdb/dynamic-table/index'),
      name: 'DynamicTable',
      meta: { title: 'Dynamic Table' }
    },
    {
      path: 'drag-table',
      component: () => import('@/views/regrdb/drag-table'),
      name: 'DragTable',
      meta: { title: 'Drag Table' }
    },
    {
      path: 'inline-edit-table',
      component: () => import('@/views/regrdb/inline-edit-table'),
      name: 'InlineEditTable',
      meta: { title: 'Inline Edit' }
    },
    {
      path: 'regression',
      component: () => import('@/views/regrdb/regression'),
      name: 'Regression',
      meta: { title: 'Regression' }
    }
  ]
}
export default regrdbRouter
