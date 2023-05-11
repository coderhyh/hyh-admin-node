import { Context } from 'koa'
import mysql from 'mysql2/promise'

import connection from '~/app/database'
import { handlerServiceError } from '~/common/utils'
import errorTypes from '~/constants/error-types'

class RoleService {
  async createRole(ctx: Context) {
    const { role_name, role_alias, status, grade, permissionList } = ctx.request.body as Role.IUpdateRoleInfoBody
    const { id } = ctx.userInfo as User.IUserInfo

    const sql_list = [
      `INSERT INTO sys_role (role_name, role_alias, status, grade, create_by) VALUES (?, ?, ?, ?, ?)`,
      permissionList.length
        ? `INSERT INTO sys_role_menu (role_id, menu_id) VALUES ${permissionList.map((e) => `(?, ?)`).join(',')}`
        : undefined
    ]
    const pool = await connection.getConnection()
    try {
      await pool.beginTransaction()
      const [result]: any[] = await connection.execute(sql_list[0]!, [role_name, role_alias, status, grade, id])
      const insertId = result.insertId
      sql_list[1] && (await connection.execute(sql_list[1], permissionList.map((e) => [insertId, e]).flat()))
      await pool.commit()
      return true
    } catch (err) {
      await pool.rollback()
      ctx.app.emit('error', errorTypes.SERVER_ERROR, ctx)
      return false
    }
  }
  async getRoleByName(role_name: string, ctx: Context) {
    const s = 'SELECT * FROM sys_role WHERE role_name = ?'
    return handlerServiceError(ctx, async () => {
      const res = await connection.execute(s, [role_name].trim())
      return res[0]
    })
  }
  async getRoleInfoById(roleId: number[], ctx: Context) {
    const s = `
      SELECT sr.id, sr.role_name, sr.role_alias, sr.status, sr.grade, sr.create_time, sr.update_time,
        su1.username AS create_by,
        su2.username AS update_by, 
        JSON_ARRAYAGG(JSON_OBJECT('id', sm.id, 'page', sm.page, 'permission', sm.permission)) permission
      FROM sys_role sr
      LEFT JOIN sys_role_menu srp ON srp.role_id = sr.id
      LEFT JOIN sys_menu sm ON sm.id = srp.menu_id
      LEFT JOIN sys_user su1 ON su1.id = sr.create_by
      LEFT JOIN sys_user su2 ON su2.id = sr.update_by
      WHERE sr.id in (${roleId.map((e) => '?').join(',')})
      GROUP BY sr.id
    `
    return handlerServiceError(ctx, async () => {
      const res: any = await connection.execute(s, roleId)
      return res[0]
    })
  }
  async getPermissionByRoleId(ctx: Context) {
    const userInfo: User.IUserInfo = ctx.userInfo
    const roleId = userInfo.role.id
    const s = `
      SELECT JSON_ARRAYAGG(sm.permission) handle
      FROM sys_role_menu srp
      LEFT JOIN sys_menu sm on sm.id = srp.menu_id
      WHERE srp.role_id = ?
    `
    return handlerServiceError(ctx, async () => {
      const res: any = await connection.execute(s, [roleId])
      return res[0][0]
    })
  }
  async getRoleList(ctx: Context) {
    type queryConditionType = { id: string; role_name: string; role_alias: string }
    const {
      pageNo = 1,
      pageSize = 20,
      orderBy = 'id',
      order = 'ASC',
      queryCondition = { id: '', role_name: '', role_alias: '' }
    } = ctx.request.body as App.IListParamsType<queryConditionType>
    const { id = '', role_name = '', role_alias = '' } = queryCondition

    const orderByWhiteList = [
      'id',
      'role_name',
      'role_alias',
      'grade',
      'create_by',
      'update_by',
      'create_time',
      'update_time'
    ]
    const orderRule = ['ASC', 'DESC']
    if (!orderByWhiteList.includes(orderBy) || !orderRule.includes(order.toUpperCase())) {
      ctx.app.emit('error', errorTypes.BAD_REQUEST, ctx)
      return []
    }

    const s = `
      SELECT sr.id, sr.role_name, sr.role_alias, sr.status, sr.grade, sr.create_time, sr.update_time,
        su1.username AS create_by,
	      su2.username AS update_by, 
        JSON_ARRAYAGG(
          IF(sm.id, JSON_OBJECT('id', sm.id, 'page', sm.page, 'permission', sm.permission), NULL)
        ) permission
      FROM sys_role sr
      LEFT JOIN sys_role_menu srp ON srp.role_id = sr.id
      LEFT JOIN sys_menu sm ON sm.id = srp.menu_id
      LEFT JOIN sys_user su1 ON su1.id = sr.create_by
      LEFT JOIN sys_user su2 ON su2.id = sr.update_by
      WHERE sr.id LIKE ? AND sr.role_name LIKE ? AND sr.role_alias LIKE ?
      GROUP BY sr.id
      ORDER BY sr.${orderBy} ${order}
      LIMIT ?, ?
    `
    return handlerServiceError(ctx, async () => {
      const res = await connection.execute(
        s,
        [
          `%${id.trim()}%`,
          `%${role_name.trim()}%`,
          `%${role_alias.trim()}%`,
          String(pageSize * (pageNo - 1)),
          String(pageSize)
        ].trim()
      )
      return res[0]
    })
  }
  async getRoleListTotal(ctx: Context) {
    type queryConditionType = { id: string; role_name: string; role_alias: string }
    const { queryCondition = { id: '', role_name: '', role_alias: '' } } = ctx.request
      .body as App.IListParamsType<queryConditionType>

    const { id = '', role_name = '', role_alias = '' } = queryCondition

    const s = `SELECT COUNT(*) total FROM sys_role WHERE id LIKE ? AND role_name LIKE ? AND role_alias LIKE ?`
    return handlerServiceError(ctx, async () => {
      const res: any = await connection.execute(s, [
        `%${id.trim()}%`,
        `%${role_name.trim()}%`,
        `%${role_alias.trim()}%`
      ])
      return res[0]?.[0]?.total ?? 0
    })
  }
  async getRoleListSelect(ctx: Context) {
    const s = `SELECT id, role_name, role_alias, status, grade FROM sys_role`
    return handlerServiceError(ctx, async () => {
      const res = await connection.execute(s)
      return res[0]
    })
  }
  async updateRoleInfo(ctx: Context) {
    const roleId: string = ctx.params.roleId
    const { role_name, role_alias, status, grade, permissionList } = ctx.request.body as Role.IUpdateRoleInfoBody
    const { id } = ctx.userInfo as User.IUserInfo

    const sql_list = [
      `UPDATE sys_role SET role_name = ?, role_alias = ?, status = ?, grade = ?, update_by = ? WHERE id = ?`,
      `DELETE FROM sys_role_menu WHERE role_id = ?`,
      permissionList.length
        ? `INSERT INTO sys_role_menu (role_id, menu_id) VALUES ${permissionList.map((e) => `(?, ?)`).join(',')}`
        : undefined
    ]
    const s = [
      mysql.format(sql_list[0]!, [role_name, role_alias, status, grade, id, roleId]),
      mysql.format(sql_list[1]!, [roleId]),
      sql_list[2] && mysql.format(sql_list[2], permissionList.map((e) => [roleId, e]).flat())
    ]
    const pool = await connection.getConnection()
    try {
      await pool.beginTransaction()
      await Promise.all(s.map((e) => e && pool.query(e)))
      await pool.commit()
      return true
    } catch (err) {
      await pool.rollback()
      ctx.app.emit('error', errorTypes.SERVER_ERROR, ctx)
      return false
    }
  }
  async updateRoleStatus(ctx: Context) {
    const roleId: string = ctx.params.roleId
    const { id } = ctx.userInfo as User.IUserInfo
    const { status } = ctx.request.body as Pick<Role.IUpdateRoleInfoBody, 'status'>
    const s = `UPDATE sys_role SET status = ?, update_by = ? WHERE id = ?`
    return handlerServiceError(ctx, async () => {
      const res: any = await connection.execute(s, [status, id, roleId])
      return !!res[0]?.affectedRows
    })
  }
  async deleteRole(ctx: Context) {
    const { roleIds } = ctx.request.body as { roleIds: number[] }
    const s = `DELETE FROM sys_role WHERE id in (${roleIds.map((e) => `?`).join(',')})`
    try {
      const res: any = await connection.execute(s, roleIds.trim())
      return !!res[0]?.affectedRows
    } catch (error) {
      if (error.sqlState === '45000') {
        ctx.app.emit('error', { message: error.sqlMessage, code: 403 }, ctx)
      }
    }
  }
}

export default new RoleService()
