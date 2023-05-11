import { Context, Next } from 'koa'

import { verifyToken } from '~/common/utils'
import errorTypes from '~/constants/error-types'
import { USER } from '~/enums'
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
    const { id, password }: User.IUserAccount = ctx.userAccount
    try {
      const res = await userService.getUserInfoById([id], ctx)
      if (res[0]?.jwt !== token || res[0]?.password !== password) throw 'UNAUTHORIZATION'
      ctx.userInfo = res[0]
      await next()
    } catch (err) {
      console.log(err)
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
      const userAccount = ctx.userAccount as User.IUserAccount
      const userInfo: User.IUserInfo = ctx.userInfo
      const userStatus = Number(userInfo.status)
      const roleStatus = Number(userInfo.role.status)

      if (roleStatus === USER.FROZEN) {
        ctx.app.emit('error', errorTypes.ROLE_FREEZE, ctx)
      } else if (userStatus === USER.FROZEN) {
        await userService.updateJWT({ username: userAccount.username, password: userAccount.password, token: '' }, ctx)
        ctx.app.emit('error', { ...errorTypes.USER_FREEZE, redirect: '/login' }, ctx)
      } else if ([userStatus, roleStatus].every((s) => [USER.UNFROZEN, USER.ADMIN].includes(s))) {
        const res: { handle: string[] | null } = await roleService.getPermissionByRoleId(ctx)

        const curPermission = `${route}[${control}]:${handle}`
        if (res.handle?.includes(curPermission)) await next()
        else ctx.app.emit('error', errorTypes.INSUFFICIENT_PRIVILEGES, ctx)
      } else {
        ctx.app.emit('error', errorTypes.INSUFFICIENT_PRIVILEGES, ctx)
      }
    }
  }
}

export const { verifyTokenInvalid, verifyTokenExist, verifyRole, verifyPermission } = new AuthMiddleware()
