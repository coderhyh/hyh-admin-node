import { Context, Next } from 'koa'

import { verifyToken } from '~/common/utils'
import errorTypes from '~/constants/error-types'
import { ROLE } from '~/enums'
import roleService from '~/service/role-service'
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

  verifyRole(role: ROLE[]) {
    return async (ctx: Context, next: Next) => {
      const userInfo: IUserInfo = ctx.userInfo
      const flag = role.includes(userInfo.role.id)

      if (!flag) ctx.app.emit('error', errorTypes.INSUFFICIENT_PRIVILEGES, ctx)
      else await next()
    }
  }

  verifyPermission(page: string, control: string, handle: 'insert' | 'delete' | 'update' | 'query') {
    return async (ctx: Context, next: Next) => {
      const res: { handle: string[] } = await roleService.getPermissionByRoleId(ctx)
      const curPermission = `${page}[${control}]:${handle}`

      if (res.handle.includes(curPermission)) await next()
      else ctx.app.emit('error', errorTypes.INSUFFICIENT_PRIVILEGES, ctx)
    }
  }
}

export const { verifyTokenInvalid, verifyTokenExist, verifyRole, verifyPermission } = new AuthMiddleware()
