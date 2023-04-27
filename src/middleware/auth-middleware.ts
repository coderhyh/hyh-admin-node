import { Context, Next } from 'koa'

import { verifyToken } from '~/common/utils'
import errorTypes from '~/constants/error-types'
import roleService from '~/service/role-service'
import userService from '~/service/user-service'

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
    const userAccount: User.IUserAccount = ctx.userAccount
    try {
      const res: User.IUserInfo[] = await userService.getUserInfoById([userAccount.id], ctx)
      if (res[0].jwt !== token) throw 'UNAUTHORIZATION'
      ctx.userInfo = res[0]
      await next()
    } catch (err) {
      ctx.app.emit('error', errorTypes.UNAUTHORIZATION, ctx)
    }
  }

  verifyRole(role: number[]) {
    return async (ctx: Context, next: Next) => {
      const userInfo: User.IUserInfo = ctx.userInfo
      const flag = role.includes(userInfo.role.id)

      if (!flag) ctx.app.emit('error', errorTypes.INSUFFICIENT_PRIVILEGES, ctx)
      else await next()
    }
  }

  verifyPermission(route: string, control: string, handle: 'insert' | 'delete' | 'update' | 'query') {
    return async (ctx: Context, next: Next) => {
      const userInfo: User.IUserInfo = ctx.userInfo
      if (userInfo.role.status) {
        ctx.app.emit('error', errorTypes.ROLE_FREEZE, ctx)
      } else {
        const res: { handle: string[] | null } = await roleService.getPermissionByRoleId(ctx)

        const curPermission = `${route}[${control}]:${handle}`
        if (res.handle?.includes(curPermission)) await next()
        else ctx.app.emit('error', errorTypes.INSUFFICIENT_PRIVILEGES, ctx)
      }
    }
  }
}

export const { verifyTokenInvalid, verifyTokenExist, verifyRole, verifyPermission } = new AuthMiddleware()
