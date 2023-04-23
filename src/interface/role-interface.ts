import { Context } from 'koa'

import roleService from '~/service/role-service'

class RoleInterface {
  async getRoleList(ctx: Context) {
    const [roleList, total] = await Promise.all([roleService.getRoleList(ctx), roleService.getRoleListTotal(ctx)])
    ctx.body ??= {
      code: 200,
      total,
      roleList
    }
  }
  async getRoleTypeList(ctx: Context) {
    const roleTypeList = await roleService.getRoleTypeList(ctx)
    ctx.body ??= {
      code: 200,
      roleTypeList
    }
  }
}

export const { getRoleList, getRoleTypeList } = new RoleInterface()
