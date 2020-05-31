// Just a mock data

export const constantRoutes = [
  /*
  {
    path: '/redirect',
    component: 'layout/Layout',
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: 'views/redirect/index'
      }
    ]
  },
  */
  {
    path: '/login',
    component: 'views/login/index',
    hidden: true
  },
  {
    path: '/404',
    component: 'views/error-page/404',
    hidden: true
  },
  {
    path: '/401',
    component: 'views/error-page/401',
    hidden: true
  },
  {
    path: '',
    component: 'layout/Layout',
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: 'views/dashboard/index',
        name: 'Dashboard',
        meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/regression',
    component: 'layout/Layout',
    redirect: '/regression/project',
    name: 'Regression',
    meta: { title: 'Regression', icon: 'example' },
    children: [
      {
        path: 'project',
        name: 'Project',
        component: () => import('@/views/project'),
        meta: { title: 'Project', icon: 'table' }
      },
      {
        path: 'ip',
        name: 'IP',
        component: () => import('@/views/ip'),
        meta: { title: 'IP', icon: 'tree' }
      }
    ]
  },
  {
    path: '/form',
    component: 'layout/Layout',
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/form'),
        meta: { title: 'Form', icon: 'form' }
      }
    ]
  }
]

export const asyncRoutes = [
  {
    path: '/permission',
    component: 'layout/Layout',
    redirect: '/permission/index',
    alwaysShow: true,
    meta: {
      title: 'Permission',
      icon: 'lock',
      roles: ['admin', 'editor']
    },
    children: [
      {
        path: 'page',
        component: 'views/permission/page',
        name: 'PagePermission',
        meta: {
          title: 'Page Permission',
          roles: ['admin']
        }
      },
      {
        path: 'directive',
        component: 'views/permission/directive',
        name: 'DirectivePermission',
        meta: {
          title: 'Directive Permission'
        }
      },
      {
        path: 'role',
        component: 'views/permission/role',
        name: 'RolePermission',
        meta: {
          title: 'Role Permission',
          roles: ['admin']
        }
      }
    ]
  },

  {
    path: '/icon',
    component: 'layout/Layout',
    children: [
      {
        path: 'index',
        component: 'views/icons/index',
        name: 'Icons',
        meta: { title: 'Icons', icon: 'icon', noCache: true }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]
