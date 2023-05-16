import dayjs from 'dayjs'
import { Context } from 'koa'

import connection from '~/app/database'
import { handlerServiceError, password2md5 } from '~/common/utils'
import errorTypes from '~/constants/error-types'

const userInfoSql = (isPwd = false) => `
  SELECT su.id, su.username, ${isPwd ? 'su.password,' : ''}
  su.nickname, su.jwt, su.status, su.create_time, su.update_time, su.last_login_time, 
    JSON_OBJECT('id', sr.id, 'role_name', sr.role_name, 'role_alias', sr.role_alias, 'status', sr.status, 'grade', sr.grade) role,
    JSON_ARRAYAGG(CONCAT(su.id, ':', sm.permission)) permission
  FROM sys_user su
  LEFT JOIN sys_role sr ON su.role = sr.id
  LEFT JOIN sys_role_menu srm ON srm.role_id = sr.id
  LEFT JOIN sys_menu sm ON sm.id = srm.menu_id
`

class userService {
  async createUser(ctx: Context) {
    const { username, password, nickname, role } = ctx.request.body as User.ICreateUser
    const s = 'INSERT INTO sys_user (username, password, nickname, role) VALUES (?, ?, ?, ?)'
    return handlerServiceError(ctx, async () => {
      const res = await connection.execute(s, [username, password, nickname, role].trim())
      return res
    })
  }
  async getUserByName(username: string, ctx: Context) {
    const s = 'SELECT * FROM sys_user WHERE username = ?'
    return handlerServiceError(ctx, async () => {
      const res = await connection.execute(s, [username].trim())
      return res[0]
    })
  }
  async updateJWT({ username, password, token }: { username: string; password: string; token: string }, ctx: Context) {
    const date = dayjs().format('YYYY-MM-DD HH:mm:ss')
    const s = 'UPDATE sys_user SET jwt = ?, last_login_time = ? WHERE username = ? AND password = ?'
    return handlerServiceError(ctx, async () => {
      const res = await connection.execute(s, [token, date, username, password].trim())
      return res
    })
  }
  async getUserInfoById(ids: number[], ctx: Context): Promise<(User.IUserInfo & { password: string })[]> {
    const s = `
      ${userInfoSql(true)}
      WHERE su.id in (${ids.map((e) => '?').join(',')})
      GROUP BY su.id
    `
    return handlerServiceError(ctx, async () => {
      const res = await connection.execute(s, ids)
      return res[0]
    })
  }
  async getUserInfoByAccount(
    { username, password }: Omit<User.IUserAccount, 'id'>,
    ctx: Context
  ): Promise<User.IUserInfo[]> {
    const s = `
      ${userInfoSql()}
      WHERE su.username = ? AND su.password = ?
      GROUP BY su.id
    `
    return handlerServiceError(ctx, async () => {
      const res = await connection.execute(s, [username, password])
      return res[0]
    })
  }
  async getUserList(ctx: Context): Promise<User.IUserInfo[]> {
    type queryConditionType = { id: string; username: string; nickname: string }
    const {
      pageNo = 1,
      pageSize = 20,
      orderBy = 'id',
      order = 'ASC',
      queryCondition = { id: '', username: '', nickname: '' }
    } = ctx.request.body as App.IListParamsType<queryConditionType>
    const { id = '', username = '', nickname = '' } = queryCondition

    const s = `
      SELECT su.id, su.username, su.nickname, su.create_time, su.update_time, su.last_login_time, su.status,
        JSON_OBJECT('id', sr.id, 'role_name', sr.role_name, 'role_alias', sr.role_alias, 'status', sr.status, 'grade', sr.grade) role,
        JSON_ARRAYAGG(CONCAT(su.id, ':', sm.permission)) permission
      FROM sys_user su
      LEFT JOIN sys_role sr ON su.role = sr.id
      LEFT JOIN sys_role_menu srm ON srm.role_id = sr.id
      LEFT JOIN sys_menu sm ON sm.id = srm.menu_id
      WHERE su.id LIKE ? AND su.username LIKE ? AND su.nickname LIKE ?
      GROUP BY su.id
      ORDER BY su.${orderBy} ${order}
      LIMIT ?, ?
    `
    return handlerServiceError(ctx, async () => {
      const res = await connection.execute(
        s,
        [
          `%${id.trim()}%`,
          `%${username.trim()}%`,
          `%${nickname.trim()}%`,
          String(pageSize * (pageNo - 1)),
          String(pageSize)
        ].trim()
      )
      return res[0]
    })
  }
  async getUserListTotal(ctx: Context): Promise<number> {
    type queryConditionType = { id: string; username: string; nickname: string }
    const { queryCondition = { id: '', username: '', nickname: '' } } = ctx.request.body as {
      queryCondition: queryConditionType
    }
    const { id = '', username = '', nickname = '' } = queryCondition

    const s = `SELECT COUNT(*) total FROM sys_user WHERE id LIKE ? AND username LIKE ? AND nickname LIKE ?`
    return handlerServiceError(ctx, async () => {
      const res: any = await connection.execute(s, [`%${id.trim()}%`, `%${username.trim()}%`, `%${nickname.trim()}%`])
      return res[0]?.[0]?.total ?? 0
    })
  }
  async deleteUser(ctx: Context) {
    const { userIds } = ctx.request.body as { userIds: number[] }
    const s = `DELETE FROM sys_user WHERE id in (${userIds.map((e) => `?`).join(',')})`
    try {
      const res: any = await connection.execute(s, userIds.trim())
      return !!res[0]?.affectedRows
    } catch (error) {
      if (error.sqlState === '45000') {
        ctx.app.emit('error', { message: error.sqlMessage, code: 403 }, ctx)
      }
    }
  }
  async resetPassword(ctx: Context) {
    const userId: string = ctx.params.userId
    const { newPassword } = ctx.request.body as {
      newPassword: string | number
    }
    const s = `UPDATE sys_user SET password = ? WHERE id = ?`
    return handlerServiceError(ctx, async () => {
      const res: any = await connection.execute(s, [password2md5(String(newPassword)), userId].trim())
      return !!res[0]?.affectedRows
    })
  }
  async updateUserInfo(ctx: Context) {
    const userId: string = ctx.params.userId
    const { username, nickname, role, status } = ctx.request.body as {
      username: string
      nickname: string
      role: string
      status: App.AccountStatus
    }
    const s = `UPDATE sys_user SET username = ?, nickname = ?, role = ?, status = ? WHERE id = ?`
    return handlerServiceError(ctx, async () => {
      const res: any = await connection.execute(s, [username, nickname, role, status, userId].trim())
      return !!res[0]?.affectedRows
    })
  }
  async updateUserStatus(ctx: Context) {
    const userId: string = ctx.params.userId
    const { status } = ctx.request.body as Pick<User.IUserInfo, 'status'>
    const s = `UPDATE sys_user SET status = ? WHERE id = ?`
    return handlerServiceError(ctx, async () => {
      const res: any = await connection.execute(s, [status, userId])
      return !!res[0]?.affectedRows
    })
  }
  async getUserByRoleIds(roleIds: number[], ctx: Context) {
    const s = `SELECT role FROM sys_user WHERE role in (${roleIds.map((e) => '?').join(',')}) GROUP BY role`
    return handlerServiceError(ctx, async () => {
      const res = await connection.execute({ sql: s, values: roleIds, rowsAsArray: true })
      return res[0]
    })
  }
}

export default new userService()
