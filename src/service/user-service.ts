import connection from '~/app/database'
import type { IUser } from '~/types/user'

class userService {
  async createUser({ userName, passWord }: IUser) {
    const s = 'INSERT INTO users (user_name, user_pwd) VALUES (?, ?)'
    const res = await connection.execute(s, [userName, passWord]).catch((err) => err)
    return res
  }
  async getUserByName(userName: string) {
    const s = 'SELECT * FROM users WHERE user_name = ?'
    const res = await connection.execute(s, [userName]).catch((err) => err)
    return res[0]
  }
  async getUserInfo({ userName, passWord }: IUser) {
    const s = 'SELECT * FROM users WHERE user_name = ? AND user_pwd = ?'
    const res = await connection.execute(s, [userName, passWord]).catch((err) => err)
    return res[0]
  }
}

export default new userService()
