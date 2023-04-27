import dayjs from 'dayjs'
import { Context } from 'koa'

import connection from '~/app/database'
import { handlerServiceError } from '~/common/utils'
import errorTypes from '~/constants/error-types'

const userInfoSql = `
  SELECT su.id, su.username, su.nickname, su.jwt, su.create_time, su.update_time, su.last_login_time, 
    JSON_OBJECT('id', sr.id, 'role_name', sr.role_name, 'role_alias', sr.role_alias, 'status', sr.status, 'grade', sr.grade) role,
    (
      SELECT JSON_ARRAYAGG(CONCAT(su.id, ':', sp.route, '[', sp.control, ']:', sp.handle))
      FROM sys_role_permission srp
      LEFT JOIN sys_permission sp on sp.id = srp.permission_id
      WHERE srp.role_id = su.role
    ) permission
  FROM sys_user su
  LEFT JOIN sys_role sr ON su.role = sr.id
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
  async getUserInfoById(ids: number[], ctx: Context): Promise<User.IUserInfo[]> {
    const s = `
      ${userInfoSql}
      WHERE su.id in (${ids.map((e) => '?').join(',')})
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
      ${userInfoSql}
      WHERE su.username = ? AND su.password = ?
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

    const orderByWhiteList = ['id', 'username', 'nickname', 'create_time', 'update_time', 'last_login_time', 'role']
    const orderRule = ['ASC', 'DESC']
    if (!orderByWhiteList.includes(orderBy) || !orderRule.includes(order.toUpperCase())) {
      ctx.app.emit('error', errorTypes.BAD_REQUEST, ctx)
      return []
    }

    const s = `
      SELECT su.id, su.username, su.nickname, su.create_time, su.update_time, su.last_login_time, 
        JSON_OBJECT('id', sr.id, 'role_name', sr.role_name, 'role_alias', sr.role_alias, 'status', sr.status, 'grade', sr.grade) role,
        (
          SELECT JSON_ARRAYAGG(CONCAT(su.id, ':', sp.route, '[', sp.control, ']:', sp.handle))
          FROM sys_role_permission srp
          LEFT JOIN sys_permission sp on sp.id = srp.permission_id
          WHERE srp.role_id = su.role
        ) permission
      FROM sys_user su
      LEFT JOIN sys_role sr ON su.role = sr.id
      WHERE su.id LIKE ? AND su.username LIKE ? AND su.nickname LIKE ?
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
    return handlerServiceError(ctx, async () => {
      const res: any = await connection.execute(s, userIds.trim())
      return !!res[0]?.affectedRows
    })
  }
  async updateUserInfo(ctx: Context) {
    const userId: string = ctx.params.userId
    const { username, nickname, role } = ctx.request.body as { username: string; nickname: string; role: string }
    const s = `UPDATE sys_user SET username = ?, nickname = ?, role = ? WHERE id = ?`
    return handlerServiceError(ctx, async () => {
      const res: any = await connection.execute(s, [username, nickname, role, userId].trim())
      return !!res[0]?.affectedRows
    })
  }
}

export default new userService()
