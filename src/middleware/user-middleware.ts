import { Context, Next } from 'koa'

import { password2md5 } from '~/common/utils'
import errorTypes from '~/constants/error-types'
import userService from '~/service/user-service'
import { IUser } from '~/types/user'

class UserMiddleware {
  async register_verifyParams(ctx: Context, next: Next) {
    const { userName, passWord }: IUser = ctx.request.body as IUser
    const userNameReg = /^[a-zA-Z\d]{8,16}$/g
    const passWordReg = /^[\da-zA-z_]{8,16}$/g
    if (!userNameReg.test(userName) || !passWordReg.test(passWord)) {
      ctx.app.emit('error', errorTypes.USERNAME_OR_PASSWORD_INCONFORMITY, ctx)
      return
    }

    const res = await userService.getUserByName(userName)
    if (Array.isArray(res) && res.length) {
      ctx.app.emit('error', errorTypes.USER_ALREADY_EXISTS, ctx)
      return
    }
    await next()
  }

  async login_verifyParams(ctx: Context, next: Next) {
    const user: IUser = ctx.request.body as IUser
    user.passWord = password2md5(user.passWord)
    const res = await userService.getUserInfo(user)
    if (!res.length) {
      ctx.app.emit('error', errorTypes.USERNAME_OR_PASSWORD_ERROR, ctx)
      return
    }
    await next()
  }
}
export const { register_verifyParams, login_verifyParams } = new UserMiddleware()
