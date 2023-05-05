import { Context, Next } from 'koa'

import errorTypes from '~/constants/error-types'
import roleService from '~/service/role-service'
import userService from '~/service/user-service'

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
  async verifyRoleIsExist(ctx: Context, next: Next) {
    const { role_name } = ctx.request.body as Role.IUpdateRoleInfoBody
    const res = await roleService.getRoleByName(role_name, ctx)
    if (Array.isArray(res) && res.length) {
      ctx.app.emit('error', errorTypes.ROLE_ALREADY_EXISTS, ctx)
      return
    }
    await next()
  }
  async verifyRoleIsDelete(ctx: Context, next: Next) {
    const { roleIds } = ctx.request.body as { roleIds: number[] }

    const res_roleIds = await userService.getUserByRoleIds(roleIds, ctx)
    const ids = res_roleIds.flat()
    if (!ids.length) {
      await next()
    } else {
      ctx.app.emit('error', { ...errorTypes.ROLE_RELEVANCE_USER, roleIds: ids }, ctx)
    }
  }
}

export const { verifyUpdateRoleGrade, verifyDeleteRoleGrade, verifyRoleIsExist, verifyRoleIsDelete } =
  new RoleMiddleware()
