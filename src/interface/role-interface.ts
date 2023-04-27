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
  async getRoleListSelect(ctx: Context) {
    const roleListSelect = await roleService.getRoleListSelect(ctx)
    ctx.body ??= {
      code: 200,
      roleListSelect
    }
  }
  async updateRoleInfo(ctx: Context) {
    const flag = await roleService.updateRoleInfo(ctx)
    ctx.body ??= {
      code: 200,
      message: flag ? '修改成功' : '角色不存在'
    }
  }
  async updateRoleStatus(ctx: Context) {
    const flag = await roleService.updateRoleStatus(ctx)
    ctx.body ??= {
      code: 200,
      message: flag ? '修改成功' : '角色不存在'
    }
  }
  async deleteRole(ctx: Context) {
    const flag = await roleService.deleteRole(ctx)
    ctx.body ??= {
      code: 200,
      message: flag ? '删除成功' : '角色不存在'
    }
  }
}

export const { getRoleList, getRoleListSelect, updateRoleInfo, updateRoleStatus, deleteRole } = new RoleInterface()
