import type { Context, Next } from 'koa'

import { createToken, password2md5 } from '~/common/utils'
import errorTypes from '~/constants/error-types'
import userService from '~/service/user-service'
import type { ICreateUser, IUserInfo } from '~/types/user'

class UserInterface {
  async registerCreate(ctx: Context) {
    const user: ICreateUser = ctx.request.body as ICreateUser
    user.password = password2md5(user.password)
    const res = await userService.createUser(user, ctx)

    if (Array.isArray(res) && res[0].affectedRows) {
      ctx.body ??= {
        code: 200,
        message: '注册成功'
      }
    } else {
      ctx.app.emit('error', errorTypes.SERVER_ERROR, ctx)
    }
  }

  async loginCreate(ctx: Context) {
    const user = ctx.request.body as Omit<ICreateUser, 'role'>
    const userInfo: IUserInfo = ctx.user
    const token: string = await createToken(user)
    await userService.updateJWT({ username: user.username, password: user.password, token }, ctx)

    Reflect.deleteProperty(userInfo, 'jwt')
    ctx.body ??= {
      code: 200,
      message: '登录成功',
      token,
      userInfo
    }
  }

  async userExit(ctx: Context) {
    const userAccount = ctx.userAccount as Omit<ICreateUser, 'role'>
    const token = ''
    await userService.updateJWT({ username: userAccount.username, password: userAccount.password, token }, ctx)
    ctx.body ??= {
      code: 200,
      message: '退出成功'
    }
  }

  async queryUserInfo(ctx: Context) {
    const userInfo: IUserInfo = ctx.userInfo

    Reflect.deleteProperty(userInfo, 'jwt')
    ctx.body ??= {
      code: 200,
      userInfo
    }
  }

  async getUserList(ctx: Context) {
    const [userList, userListTotal] = await Promise.all([
      userService.getUserList(ctx),
      userService.getUserListTotal(ctx)
    ])
    ctx.body ??= {
      code: 200,
      total: userListTotal,
      userList
    }
  }

  async deleteUser(ctx: Context) {
    const flag = await userService.deleteUser(ctx)
    ctx.body ??= {
      code: 200,
      message: flag ? '删除成功' : '用户不存在'
    }
  }

  async updateUserInfo(ctx: Context) {
    const flag = await userService.updateUserInfo(ctx)
    ctx.body ??= {
      code: 200,
      message: flag ? '修改成功' : '用户不存在'
    }
  }
}

export const { registerCreate, loginCreate, queryUserInfo, getUserList, userExit, deleteUser, updateUserInfo } =
  new UserInterface()
