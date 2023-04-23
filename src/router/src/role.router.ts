import Router from 'koa-router'

import { getRoleList, getRoleTypeList } from '~/interface/role-interface'
import { verifyPermission, verifyTokenExist, verifyTokenInvalid } from '~/middleware/auth-middleware'

const roleRouter = new Router({ prefix: '/role' })

// roleRouter.get(
//   '/list',
//   verifyTokenExist,
//   verifyTokenInvalid,
//   verifyPermission('system/role', 'table', 'query'),
//   getRoleList
// )
roleRouter.get('/typeList', verifyTokenExist, verifyTokenInvalid, getRoleTypeList)

module.exports = roleRouter
