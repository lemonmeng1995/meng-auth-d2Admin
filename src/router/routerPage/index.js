var pages = [
  // 权限管理
  {
    path: 'management/menu',
    name: 'managementMenu',
    meta: {
      title: '菜单管理',
      auth: true,
      cache: true
    },
    component: () =>
      import('@/views/authoritymanagement/menumanagement/index.vue')
  },
  {
    path: 'management/router',
    name: 'managementRouter',
    meta: {
      title: '路由管理',
      auth: true,
      cache: true
    },
    component: () =>
      import('@/views/authoritymanagement/routermanagement/index.vue')
  },
  {
    path: 'management/role',
    name: 'managementRole',
    meta: {
      title: '角色管理',
      auth: true,
      cache: true
    },
    component: () =>
      import('@/views/authoritymanagement/rolemanagement/index.vue')
  },
  {
    path: 'management/user',
    name: 'managementUser',
    meta: {
      title: '用户管理',
      auth: true,
      cache: true
    },
    component: () =>
      import('@/views/authoritymanagement/usermanagement/index.vue')
  }
]

export default pages
