export default {
  PARAMETER_MISSIMG: { message: '参数缺失: ', code: 400 },
  USER_ALREADY_EXISTS: { message: '用户已存在', code: 409 },
  ROLE_ALREADY_EXISTS: { message: '角色已存在', code: 409 },
  USERNAME_OR_PASSWORD_INCONFORMITY: {
    message: '账号或者密码不符合规则',
    code: 400
  },
  USERNAME_OR_PASSWORD_ERROR: { message: '用户名或密码错误', code: 400 },
  ROLE_RELEVANCE_USER: { message: '以下角色关联了用户, 无法删除', code: 400 },
  BAD_REQUEST: { message: '参数不合法', code: 400 },
  SERVER_ERROR: { message: '服务器错误', code: 500 },
  UNAUTHORIZATION: { message: '登录失效', code: 401 },
  INSUFFICIENT_PRIVILEGES: { message: '权限不足', code: 403 },
  INSUFFICIENT_PRIVILEGES_GRADE: { message: '级别权限不足:无法操作', code: 403 },
  ROLE_FREEZE: { message: '角色已被冻结', code: 403 },
  USER_FREEZE: { message: '用户已被冻结', code: 403 }
}
