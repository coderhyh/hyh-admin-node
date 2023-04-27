import { Context } from 'koa'

import permissionService from '~/service/permission-service'

class PermissionInterface {
  async getRolePermissionSelect(ctx: Context) {
    const permissionListSelect = await permissionService.getPermissionListSelect(ctx)
    ctx.body ??= {
      code: 200,
      permissionListSelect
    }
  }
}

export const { getRolePermissionSelect } = new PermissionInterface()
