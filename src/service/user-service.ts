import { Context } from 'koa'

import connection from '~/app/database'
import { handlerServiceError } from '~/common/utils'
import type { ICreateUser } from '~/types/user'

class userService {
  async createUser({ username, password, role, nickname }: ICreateUser, ctx: Context) {
    const s = 'INSERT INTO sys_user (user_name, user_pwd, nickname, role) VALUES (?, ?, ?, ?)'
    const res = await connection.execute(s, [username, password, nickname, role]).catch(handlerServiceError(ctx))
    return res
  }
  async getUserByName(username: string, ctx: Context) {
    const s = 'SELECT * FROM sys_user WHERE user_name = ?'
    const res = await connection.execute(s, [username]).catch(handlerServiceError(ctx))
    return res[0]
  }
  async updateJWT({ username, password, token }: { username: string; password: string; token: string }, ctx: Context) {
    const s = 'UPDATE sys_user SET jwt = ? WHERE user_name = ? AND user_pwd = ?'
    const res = await connection.execute(s, [token, username, password]).catch(handlerServiceError(ctx))
    return res
  }
  async getUserInfo({ username, password }: Omit<ICreateUser, 'role' | 'nickname'>, ctx: Context) {
    const s = `
      SELECT su.id, su.user_name, su.nickname, su.jwt, su.create_time, su.update_time, su.last_login_time, 
        JSON_OBJECT('id', sr.id, 'role_name', sr.role_name, 'role_alias', sr.role_alias) role,
        (
          SELECT JSON_ARRAYAGG(CONCAT(su.id, ':', sp.page, '[', sp.control, ']:', sp.permission))
          FROM sys_role_permission srp
          LEFT JOIN sys_permission sp on sp.id = srp.permission_id
          WHERE srp.role_id = su.role
        ) permission
      FROM sys_user su
      LEFT JOIN sys_role sr ON su.role = sr.id
      WHERE su.user_name = ? AND su.user_pwd = ?
    `
    const res = await connection.execute(s, [username, password]).catch(handlerServiceError(ctx))
    return res[0]
  }
}

export default new userService()
