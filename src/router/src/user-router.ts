import Router from 'koa-router'

import { login_create, queryUserInfo, register_create } from '~/interface/user-interface'
import { verifyTokenExist, verifyTokenInvalid } from '~/middleware/auth-middleware'
import { requiredField } from '~/middleware/requiredField'
import { login_verifyParams, register_verifyParams } from '~/middleware/user-middleware'

const userRouter = new Router({ prefix: '/user' })

userRouter.post(
  '/register',
  requiredField(['username', 'password', 'role', 'nickname']),
  register_verifyParams,
  register_create
)
userRouter.post('/login', requiredField(['username', 'password']), login_verifyParams, login_create)
userRouter.post('/info', verifyTokenExist, verifyTokenInvalid, queryUserInfo)

module.exports = userRouter
