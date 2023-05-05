import Router from 'koa-router'

import {
  deleteUser,
  getUserList,
  loginCreate,
  queryUserInfo,
  registerCreate,
  updateUserInfo,
  updateUserStatus,
  userExit
} from '~/interface/user-interface'
import { verifyPermission, verifyTokenExist, verifyTokenInvalid } from '~/middleware/auth-middleware'
import {
  loginVerifyParams,
  registerVerifyParams,
  verifyDeleteUserGrade,
  verifyUpdateUserGrade
} from '~/middleware/user-middleware'
import { requiredField, requiredFieldType } from '~/middleware/verify-middleware'

import { userFieldType } from '../config/user-config'

const userRouter = new Router({ prefix: '/user' })

userRouter.post(
  '/create',
  requiredField(['username', 'password', 'role', 'nickname']),
  requiredFieldType(userFieldType.createUser),
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
  requiredFieldType(userFieldType.userList),
  verifyTokenExist,
  verifyTokenInvalid,
  verifyPermission('system/user-manage', 'table', 'query'),
  getUserList
)
userRouter.delete(
  '/delete-users',
  requiredField(['userIds']),
  requiredFieldType(userFieldType.deleteUsers),
  verifyTokenExist,
  verifyTokenInvalid,
  verifyPermission('system/user-manage', 'table', 'delete'),
  verifyDeleteUserGrade,
  deleteUser
)
userRouter.patch(
  '/:userId',
  requiredField(['username', 'nickname', 'role', 'status']),
  requiredFieldType(userFieldType.updateUser),
  verifyTokenExist,
  verifyTokenInvalid,
  verifyPermission('system/user-manage', 'table', 'update'),
  verifyUpdateUserGrade,
  updateUserInfo
)
userRouter.patch(
  '/status/:userId',
  requiredField(['status']),
  requiredFieldType(userFieldType.updateUserStatus),
  verifyTokenExist,
  verifyTokenInvalid,
  verifyPermission('system/role-manage', 'table', 'update'),
  verifyUpdateUserGrade,
  updateUserStatus
)
module.exports = userRouter
