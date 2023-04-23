import dayjs from 'dayjs'
import { Context } from 'koa'

import connection from '~/app/database'
import { handlerServiceError } from '~/common/utils'
import type { ICreateUser, IUserInfo } from '~/types/user'

class userService {
  async createUser({ username, password, role, nickname }: ICreateUser, ctx: Context) {
    const s = 'INSERT INTO sys_user (username, password, nickname, role) VALUES (?, ?, ?, ?)'
    const res = await connection.execute(s, [username, password, nickname, role]).catch(handlerServiceError(ctx))
    return res
  }
  async getUserByName(username: string, ctx: Context) {
    const s = 'SELECT * FROM sys_user WHERE username = ?'
    const res = await connection.execute(s, [username]).catch(handlerServiceError(ctx))
    return res[0]
  }
  async updateJWT({ username, password, token }: { username: string; password: string; token: string }, ctx: Context) {
    const date = dayjs().format('YYYY-MM-DD HH:mm:ss')
    const s = 'UPDATE sys_user SET jwt = ?, last_login_time = ? WHERE username = ? AND password = ?'
    const res = await connection.execute(s, [token, date, username, password]).catch(handlerServiceError(ctx))
    return res
  }
  async getUserInfo(
    { username, password }: Omit<ICreateUser, 'role' | 'nickname'>,
    ctx: Context
  ): Promise<IUserInfo[]> {
    const s = `
      SELECT su.id, su.username, su.nickname, su.jwt, su.create_time, su.update_time, su.last_login_time, 
        JSON_OBJECT('id', sr.id, 'role_name', sr.role_name, 'role_alias', sr.role_alias) role,
        (
          SELECT JSON_ARRAYAGG(CONCAT(su.id, ':', sp.page, '[', sp.control, ']:', sp.handle))
          FROM sys_role_permission srp
          LEFT JOIN sys_permission sp on sp.id = srp.permission_id
          WHERE srp.role_id = su.role
        ) permission
      FROM sys_user su
      LEFT JOIN sys_role sr ON su.role = sr.id
      WHERE su.username = ? AND su.password = ?
    `
    const res = await connection.execute(s, [username, password]).catch(handlerServiceError(ctx))
    return res[0]
  }
  async getUserList(ctx: Context): Promise<IUserInfo[]> {
    const { pageNo = 1, pageSize = 20 } = ctx.request.body as { pageNo: number; pageSize: number }
    const s = `
      SELECT su.id, su.username, su.nickname, su.create_time, su.update_time, su.last_login_time, 
        JSON_OBJECT('id', sr.id, 'role_name', sr.role_name, 'role_alias', sr.role_alias) role,
        (
          SELECT JSON_ARRAYAGG(CONCAT(su.id, ':', sp.page, '[', sp.control, ']:', sp.handle))
          FROM sys_role_permission srp
          LEFT JOIN sys_permission sp on sp.id = srp.permission_id
          WHERE srp.role_id = su.role
        ) permission
      FROM sys_user su
      LEFT JOIN sys_role sr ON su.role = sr.id
      LIMIT ?, ?
    `
    const res = await connection
      .execute(s, [String(pageSize * (pageNo - 1)), String(pageSize)])
      .catch(handlerServiceError(ctx))
    return res[0]
  }
  async getUserListTotal(ctx: Context): Promise<number> {
    const s = `SELECT COUNT(*) total FROM sys_user`
    const res: any = await connection.execute(s).catch(handlerServiceError(ctx))
    return res[0]?.[0]?.total ?? 0
  }
  async deleteUser(ctx: Context) {
    const { userId } = ctx.params
    const s = `DELETE FROM sys_user WHERE id = ?`
    const res = await connection.execute(s, [userId]).catch(handlerServiceError(ctx))
    return !!res[0]?.affectedRows
  }
  async updateUserInfo(ctx: Context) {
    const userId: string = ctx.params.userId
    const { username, nickname, role } = ctx.request.body as { username: string; nickname: string; role: string }
    const s = `UPDATE sys_user SET username = ?, nickname = ?, role = ? WHERE id = ?`
    const res = await connection.execute(s, [username, nickname, role, userId]).catch(handlerServiceError(ctx))

    return !!res[0]?.affectedRows
  }
}

export default new userService()
