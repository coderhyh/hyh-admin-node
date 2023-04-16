import Router from 'koa-router'

import { login_create, register_create } from '~/interface/user-interface'
import { requiredField } from '~/middleware/requiredField'
import { login_verifyParams, register_verifyParams } from '~/middleware/user-middleware'

const userRouter = new Router({ prefix: '/user' })

userRouter.post('/register', requiredField(['userName', 'passWord']), register_verifyParams, register_create)
userRouter.post('/login', requiredField(['userName', 'passWord']), login_verifyParams, login_create)

module.exports = userRouter
