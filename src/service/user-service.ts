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
  async getUserInfo({ username, password }: Omit<ICreateUser, 'role'>, ctx: Context) {
    const s = 'SELECT * FROM sys_user WHERE user_name = ? AND user_pwd = ?'
    const res = await connection.execute(s, [username, password]).catch(handlerServiceError(ctx))
    return res[0]
  }
}

export default new userService()
