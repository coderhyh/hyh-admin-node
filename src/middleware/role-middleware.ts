import { Context, Next } from 'koa'

import errorTypes from '~/constants/error-types'
import roleService from '~/service/role-service'

class RoleMiddleware {
  async verifyUpdateRoleGrade(ctx: Context, next: Next) {
    const { role } = ctx.userInfo as User.IUserInfo
    const [{ grade: curGrade }]: Role.IRoleInfo[] = await roleService.getRoleInfoById([ctx.params.roleId], ctx)
    const { grade: newGrade = curGrade } = ctx.request.body as Role.IUpdateRoleInfoBody

    if (typeof curGrade !== 'number') return
    if (role.grade <= curGrade && role.grade <= newGrade) {
      // 修改者的权限 >= 被修改者当前的权限
      // &&
      // 修改者的权限 >= 被修改者新的权限
      await next()
    } else ctx.app.emit('error', errorTypes.INSUFFICIENT_PRIVILEGES_GRADE, ctx)
  }
  async verifyDeleteRoleGrade(ctx: Context, next: Next) {
    const { role } = ctx.userInfo as User.IUserInfo
    const { roleIds } = ctx.request.body as { roleIds: number[] }
    const roleInfoList: Role.IRoleInfo[] = await roleService.getRoleInfoById(roleIds, ctx)
    const flag = roleInfoList.every((e) => role.grade <= e.grade)

    if (flag) await next()
    else ctx.app.emit('error', errorTypes.INSUFFICIENT_PRIVILEGES_GRADE, ctx)
  }
}

export const { verifyUpdateRoleGrade, verifyDeleteRoleGrade } = new RoleMiddleware()
