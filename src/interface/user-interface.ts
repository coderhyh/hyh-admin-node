import type { Context, Next } from 'koa'

import { createToken, password2md5 } from '~/common/utils'
import errorTypes from '~/constants/error-types'
import userService from '~/service/user-service'
import type { ICreateUser, IUserInfo } from '~/types/user'

class UserInterface {
  async register_create(ctx: Context, next: Next) {
    const user: ICreateUser = ctx.request.body as ICreateUser
    user.password = password2md5(user.password)
    const res = await userService.createUser(user, ctx)

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
    const user: Omit<ICreateUser, 'role'> = ctx.request.body as ICreateUser
    const userInfo: IUserInfo = ctx.user
    const token: string = await createToken(user)
    await userService.updateJWT({ username: user.username, password: user.password, token }, ctx)

    Reflect.deleteProperty(userInfo, 'jwt')
    ctx.body = {
      code: 200,
      message: '登陆成功',
      token,
      userInfo
    }
  }

  async queryUserInfo(ctx: Context, next: Next) {
    const userInfo: IUserInfo = ctx.userInfo

    Reflect.deleteProperty(userInfo, 'jwt')
    ctx.body = {
      code: 200,
      userInfo
    }
  }
}

export const { register_create, login_create, queryUserInfo } = new UserInterface()
