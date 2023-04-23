import { Context } from 'koa'

import connection from '~/app/database'
import { handlerServiceError } from '~/common/utils'
import { IUserInfo } from '~/types/user'

class RoleService {
  async getPermissionByRoleId(ctx: Context) {
    const userInfo: IUserInfo = ctx.userInfo
    const roleId = userInfo.role.id
    const s = `
      SELECT JSON_ARRAYAGG(CONCAT(sp.page, '[', sp.control, ']:', sp.handle)) handle
      FROM sys_role_permission srp
      LEFT JOIN sys_permission sp on sp.id = srp.permission_id
      WHERE srp.role_id = ?
    `
    const res = await connection.execute(s, [roleId]).catch(handlerServiceError(ctx))
    return res[0][0]
  }

  async getRoleList(ctx: Context) {
    const s = `
      SELECT sr.id, sr.role_name, sr.role_alias, sr.create_by, sr.update_by, sr.create_time, sr.update_time,
        JSON_ARRAYAGG(
          JSON_OBJECT('id', sp.id, 'page', sp.page, 'control', sp.control, 'handler', sp.handle, 'description', sp.description)
        ) permission
      FROM sys_role sr
      LEFT JOIN sys_role_permission srp on srp.role_id = sr.id
      LEFT JOIN sys_permission sp on sp.id = srp.permission_id
      GROUP BY sr.id
    `
    const res = await connection.execute(s).catch(handlerServiceError(ctx))
    return res[0]
  }

  async getRoleListTotal(ctx: Context) {
    const s = `SELECT COUNT(*) total FROM sys_role`
    const res: any = await connection.execute(s).catch(handlerServiceError(ctx))
    return res[0]?.[0]?.total ?? 0
  }

  async getRoleTypeList(ctx: Context) {
    const s = `SELECT id, role_name, role_alias FROM sys_role`
    const res = await connection.execute(s).catch(handlerServiceError(ctx))
    return res[0]
  }
}

export default new RoleService()
