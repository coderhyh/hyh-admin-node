import Router from 'koa-router'

import { verifyAuth } from '~/common/utils'
import { login_create, queryUserInfo, register_create } from '~/interface/user-interface'
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
userRouter.post('/info/:id', requiredField(['id']), verifyAuth, queryUserInfo)

module.exports = userRouter
