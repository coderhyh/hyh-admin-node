import type { Context, Next } from 'koa'

import { password2md5 } from '~/common/utils'
import errorTypes from '~/constants/error-types'
import userService from '~/service/user-service'
import type { IUser } from '~/types/user'

class UserInterface {
  async register_create(ctx: Context, next: Next) {
    const user: IUser = ctx.request.body as IUser
    user.passWord = password2md5(user.passWord)
    const res = await userService.createUser(user).catch((err) => err)

    if (Array.isArray(res) && res[0].affectedRows) {
      ctx.body = {
        code: 200,
        message: '注册成功'
      }
    } else {
      ctx.app.emit('error', errorTypes.SERVER_ERROR, ctx)
    }
  }

  async login_create(ctx: Context, next: Next) {
    ctx.body = {
      code: 200,
      msg: '登陆成功',
      token: '123'
    }
  }
}

export const { register_create, login_create } = new UserInterface()
