import { Context, Next } from 'koa'

import { password2md5 } from '~/common/utils'
import errorTypes from '~/constants/error-types'
import userService from '~/service/user-service'
import type { ICreateUser, IUserInfo } from '~/types/user'

class UserMiddleware {
  async register_verifyParams(ctx: Context, next: Next) {
    const { username, password }: ICreateUser = ctx.request.body as ICreateUser
    const userNameReg = /^[a-zA-Z\d.]{6,16}$/g
    const passWordReg = /^[\da-zA-z_.]{6,16}$/g
    if (!userNameReg.test(username) || !passWordReg.test(password)) {
      ctx.app.emit('error', errorTypes.USERNAME_OR_PASSWORD_INCONFORMITY, ctx)
      return
    }

    const res = await userService.getUserByName(username, ctx)
    if (Array.isArray(res) && res.length) {
      ctx.app.emit('error', errorTypes.USER_ALREADY_EXISTS, ctx)
      return
    }
    await next()
  }

  async login_verifyParams(ctx: Context, next: Next) {
    const user: ICreateUser = ctx.request.body as ICreateUser
    user.password = password2md5(user.password)
    const res: IUserInfo[] = await userService.getUserInfo(user, ctx)
    if (!res.length) {
      ctx.app.emit('error', errorTypes.USERNAME_OR_PASSWORD_ERROR, ctx)
      return
    }
    ctx.user = res[0]
    await next()
  }
}
export const { register_verifyParams, login_verifyParams } = new UserMiddleware()
