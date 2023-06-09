import { Context } from 'koa'
import mysql from 'mysql2/promise'

import connection from '~/app/database'
import { buildTree, handlerServiceError } from '~/common/utils'
import errorTypes from '~/constants/error-types'
import { menuFields } from '~/router/config/menu-config'

class PermissionService {
  async getMenuTree(ctx: Context) {
    const s = `
      SELECT sm1.*, sm2.page requiredText
      FROM sys_menu sm1 
      LEFT JOIN sys_menu sm2 ON sm1.requiredId = sm2.id
    `
    return handlerServiceError(ctx, async () => {
      const res = await connection.execute(s)
      ;(<Menu.IMenuItem[]>res[0]).sort((a, b) => a.order - b.order)
      const tree = buildTree(res[0] as any[])
      return tree
    })
  }
  async getMenuTreeSelect(ctx: Context) {
    const s = `
      SELECT sm1.id, sm1.page, sm1.parentId, sm1.order
      FROM sys_menu sm1 
      LEFT JOIN sys_menu sm2 ON sm1.requiredId = sm2.id
    `
    return handlerServiceError(ctx, async () => {
      const res = await connection.execute(s)
      ;(<Menu.IMenuItem[]>res[0]).sort((a, b) => a.order - b.order)
      const tree = buildTree(res[0] as any[])
      return tree
    })
  }
  async getMenu(ctx: Context) {
    const s = `SELECT * FROM sys_menu WHERE type IN ('menu', 'directory') AND status = 0`
    const menuPermission: number[] = await this.getMenuPermissionByUserId(ctx)

    return handlerServiceError(ctx, async () => {
      const res = await connection.execute(s)
      const list = (<Menu.IMenuItem[]>res[0]).filter(
        (e) => menuPermission.includes(e.requiredId!) || e.type === 'directory' || e.requiredId === null
      )
      list.sort((a, b) => a.order - b.order)
      const tree = buildTree(list)
      return tree
    })
  }
  async getMenuPermissionByUserId(ctx: Context) {
    const { id } = ctx.userInfo as User.IUserInfo
    const s = `
      SELECT sm.id
      FROM sys_menu sm
      LEFT JOIN sys_role_menu srm ON srm.menu_id = sm.id
      LEFT JOIN sys_role sr ON sr.id = srm.role_id
      LEFT JOIN sys_user su ON su.role = sr.id
      WHERE su.id = ? AND srm.menu_id = sm.id
      GROUP BY sm.id
    `
    return handlerServiceError(ctx, async () => {
      const res = await connection.execute({ sql: s, values: [id], rowsAsArray: true })
      return (<number[][]>res[0]).flat()
    })
  }
  async createMenu(ctx: Context) {
    const s = `
      INSERT INTO sys_menu (${menuFields.map((e) => `\`${e}\``).join(',')}) 
      VALUES (${menuFields.map((e) => '?').join(', ')})
    `
    return handlerServiceError(ctx, async () => {
      const res = await connection.execute(
        s,
        menuFields.map((e) => (<Menu.IMenuItem>ctx.request.body)[e as keyof Menu.IMenuItem]).trim()
      )
      return res
    })
  }
  async getMenuItemById(id: number, ctx: Context) {
    const s = `SELECT * FROM sys_menu WHERE id = ?`
    return handlerServiceError(ctx, async () => {
      const res = await connection.execute(s, [id])
      return res[0]
    })
  }
  async updateMenu(ctx: Context) {
    const { menuId } = ctx.params ?? {}
    const body = ctx.request.body as Menu.IMenuItem
    const sql_list = [
      `UPDATE sys_menu SET ${menuFields.map((e) => `\`${e}\` = ?`).join(', ')} WHERE id = ?`,
      `UPDATE sys_menu SET status = ? WHERE parentId = ?`
    ]
    const s = [
      mysql.format(sql_list[0], [
        ...menuFields.map((e) => {
          const val = body[e as keyof Menu.IMenuItem]
          return typeof val === 'string' ? val.trim() || null : val
        }),
        menuId
      ]),
      mysql.format(sql_list[1], [body.status, menuId])
    ]

    const pool = await connection.getConnection()

    try {
      await pool.beginTransaction()
      await Promise.all(s.map((e) => e && pool.query(e)))
      await pool.commit()
      return true
    } catch (error) {
      await pool.rollback()
      ctx.app.emit('error', errorTypes.SERVER_ERROR, ctx)
      return false
    }
  }
  async deleteMenu(ctx: Context) {
    const { menuIds } = ctx.request.body as { menuIds: number[] }
    const sq = menuIds.map((e) => `?`).join(',')
    const s = `DELETE FROM sys_menu WHERE id in (${sq}) OR parentId in (${sq})`
    return handlerServiceError(ctx, async () => {
      const ids = menuIds.trim()
      const res: any = await connection.execute(s, [...ids, ...ids])
      return !!res[0]?.affectedRows
    })
  }
}

export default new PermissionService()
