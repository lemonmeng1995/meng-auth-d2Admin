const configApi = {
  commonCaptcha: 'v1/common/captcha', // 获取验证码
  userLogin: 'v1/user_services/login', // 账号登录
  menuList: 'v1/menu/list',//菜单列表接口
  menuSave:'v1/menu/save',//菜单添加/修改
  menuDelete:'v1/menu/delete',//菜单删除
  roleList: 'v1/role/list', // 角色列表
  userList: 'v1/user/list', // 用户列表
  userSave: 'v1/user/save', // 用户添加修改
  userRoleUserList: 'v1/user/roleUserList', // 当前权限组户列表 + 所有用户
  userUserRoleList: 'v1/role/userRoleList', // 当前用户所在角色组 + 所有角色
  rolePermissionList: 'v1/permission/list', // 获取角色组当前权限列表
}

export default configApi
