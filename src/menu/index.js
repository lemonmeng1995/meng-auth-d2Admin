import { uniqueId } from 'lodash'

/**
 * @description 给菜单数据补充上 path 字段
 * @description https://github.com/d2-projects/d2-admin/issues/209
 * @param {Array} menu 原始的菜单数据
 */
function supplementPath (menu) {
  return menu.map(e => ({
    ...e,
    path: e.path || uniqueId('d2-menu-empty-'),
    ...e.children ? {
      children: supplementPath(e.children)
    } : {}
  }))
}

export const menuHeader = supplementPath([
  {
    title: '权限管理',
    icon: 'folder-o',
    children: [{
      title: '菜单管理',
      path: '/management/menu'

    }, {
      title: '角色管理',
      path: '/management/role'
    }, {
      title: '用户管理',
      path: '/management/user'
    }]
  }
])

export const menuAside = supplementPath([
  {
    title: '权限管理',
    icon: 'folder-o',
    children: [{
      title: '菜单管理',
      path: '/management/menu'
    },
    // {
    //   title: '路由管理',
    //   path: '/management/router'
    // }, 
    {
      title: '角色管理',
      path: '/management/role'
    }, {
      title: '用户管理',
      path: '/management/user'
    }]
  }
])
