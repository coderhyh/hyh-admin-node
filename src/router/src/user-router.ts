import Router from 'koa-router'

import {
  deleteUser,
  getUserList,
  loginCreate,
  queryUserInfo,
  registerCreate,
  updateUserInfo,
  userExit
} from '~/interface/user-interface'
import { verifyPermission, verifyTokenExist, verifyTokenInvalid } from '~/middleware/auth-middleware'
import { requiredField } from '~/middleware/requiredField'
import { loginVerifyParams, registerVerifyParams } from '~/middleware/user-middleware'

const userRouter = new Router({ prefix: '/user' })

userRouter.post(
  '/create',
  requiredField(['username', 'password', 'role', 'nickname']),
  verifyTokenExist,
  verifyTokenInvalid,
  verifyPermission('system/user-manage', 'table', 'insert'),
  registerVerifyParams,
  registerCreate
)
userRouter.post('/login', requiredField(['username', 'password']), loginVerifyParams, loginCreate)
userRouter.delete('/exit', verifyTokenExist, verifyTokenInvalid, userExit)
userRouter.get('/info', verifyTokenExist, verifyTokenInvalid, queryUserInfo)
userRouter.post(
  '/list',
  verifyTokenExist,
  verifyTokenInvalid,
  verifyPermission('system/user-manage', 'table', 'query'),
  getUserList
)
userRouter.delete(
  '/:userId',
  verifyTokenExist,
  verifyTokenInvalid,
  verifyPermission('system/user-manage', 'table', 'delete'),
  deleteUser
)
userRouter.patch(
  '/:userId',
  requiredField(['username', 'nickname', 'role']),
  verifyTokenExist,
  verifyTokenInvalid,
  verifyPermission('system/user-manage', 'table', 'update'),
  updateUserInfo
)
module.exports = userRouter
