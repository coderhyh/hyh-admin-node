import { Context, Next } from 'koa'

import { verifyToken } from '~/common/utils'
import errorTypes from '~/constants/error-types'
import userService from '~/service/user-service'
import { IUserInfo } from '~/types/user'

class AuthMiddleware {
  async verifyTokenExist(ctx: Context, next: Next) {
    const authorization = ctx.headers.authorization
    if (!authorization) {
      return ctx.app.emit('error', errorTypes.UNAUTHORIZATION, ctx)
    }
    const token = authorization.replace('Bearer ', '')
    ctx.token = token
    try {
      ctx.userAccount = await verifyToken(token)
      await next()
    } catch (err) {
      ctx.app.emit('error', errorTypes.UNAUTHORIZATION, ctx)
    }
  }

  async verifyTokenInvalid(ctx: Context, next: Next) {
    const token: string = ctx.token
    try {
      const res: IUserInfo[] = await userService.getUserInfo(ctx.userAccount, ctx)
      if (res[0].jwt !== token) throw 'UNAUTHORIZATION'

      ctx.userInfo = res[0]
      await next()
    } catch (err) {
      ctx.app.emit('error', errorTypes.UNAUTHORIZATION, ctx)
    }
  }
}

export const { verifyTokenInvalid, verifyTokenExist } = new AuthMiddleware()
