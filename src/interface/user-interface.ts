import type { Context } from 'koa'

import { createToken, password2md5 } from '~/common/utils'
import errorTypes from '~/constants/error-types'
import { USER } from '~/enums'
import userService from '~/service/user-service'

class UserInterface {
  async registerCreate(ctx: Context) {
    const user = ctx.request.body as User.ICreateUser
    user.password = password2md5(user.password)
    const res = await userService.createUser(ctx)

    if (Array.isArray(res) && res[0].affectedRows) {
      ctx.body ??= {
        code: 200,
        message: '添加成功'
      }
    } else {
      ctx.app.emit('error', errorTypes.SERVER_ERROR, ctx)
    }
  }

  async loginCreate(ctx: Context) {
    const user = ctx.request.body as Omit<User.ICreateUser, 'role'>
    const userInfo: User.IUserInfo = ctx.userInfo
    const token: string = await createToken({ ...user, id: userInfo.id })
    await userService.updateJWT({ username: user.username, password: user.password, token }, ctx)

    Reflect.deleteProperty(userInfo, 'jwt')
    if (userInfo.status === USER.FROZEN) {
      ctx.app.emit('error', { ...errorTypes.USER_FREEZE, redirect: '/login' }, ctx)
    }
    ctx.body ??= {
      code: 200,
      message: '登录成功',
      token,
      userInfo
    }
  }

  async userExit(ctx: Context) {
    const userAccount = ctx.userAccount as User.IUserAccount
    const token = ''
    await userService.updateJWT({ username: userAccount.username, password: userAccount.password, token }, ctx)
    ctx.body ??= {
      code: 200,
      message: '退出成功'
    }
  }

  async queryUserInfo(ctx: Context) {
    const userInfo: User.IUserInfo = ctx.userInfo
    Reflect.deleteProperty(userInfo, 'jwt')
    if (userInfo.status === USER.FROZEN) {
      ctx.app.emit('error', { ...errorTypes.USER_FREEZE, redirect: '/login' }, ctx)
    }
    Reflect.deleteProperty(userInfo, 'password')
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

  async resetPassword(ctx: Context) {
    const flag = await userService.resetPassword(ctx)
    ctx.body ??= {
      code: 200,
      message: flag ? '修改成功' : '用户不存在'
    }
  }

  async updateUserInfo(ctx: Context) {
    const flag = await userService.updateUserInfo(ctx)
    ctx.body ??= {
      code: 200,
      message: flag ? '修改成功' : '用户不存在'
    }
  }

  async updateUserStatus(ctx: Context) {
    const flag = await userService.updateUserStatus(ctx)
    ctx.body ??= {
      code: 200,
      message: flag ? '修改成功' : '用户不存在'
    }
  }
}

export const {
  registerCreate,
  loginCreate,
  queryUserInfo,
  getUserList,
  userExit,
  deleteUser,
  resetPassword,
  updateUserInfo,
  updateUserStatus
} = new UserInterface()
