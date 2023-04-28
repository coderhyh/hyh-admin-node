export default {
  PARAMETER_MISSIMG: { msg: '参数缺失: ', status: 400 },
  USER_ALREADY_EXISTS: { msg: '用户已存在', status: 409 },
  ROLE_ALREADY_EXISTS: { msg: '角色已存在', status: 409 },
  USERNAME_OR_PASSWORD_INCONFORMITY: {
    msg: '账号或者密码不符合规则',
    status: 400
  },
  USERNAME_OR_PASSWORD_ERROR: { msg: '用户名或密码错误', status: 400 },
  BAD_REQUEST: { msg: '参数不合法', status: 400 },
  SERVER_ERROR: { msg: '服务器错误', status: 500 },
  UNAUTHORIZATION: { msg: '登录失效', status: 401 },
  INSUFFICIENT_PRIVILEGES: { msg: '权限不足', status: 403 },
  INSUFFICIENT_PRIVILEGES_GRADE: { msg: '级别权限不足:无法操作', status: 403 },
  ROLE_FREEZE: { msg: '角色已被冻结', status: 403 }
}
