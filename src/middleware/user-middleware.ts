import { Context, Next } from 'koa'

import { password2md5 } from '~/common/utils'
import errorTypes from '~/constants/error-types'
import userService from '~/service/user-service'

class UserMiddleware {
  async registerVerifyParams(ctx: Context, next: Next) {
    const { username, password } = ctx.request.body as User.ICreateUser
    const userNameReg = /^[a-zA-Z\d.]{6,16}$/g
    const passWordReg = /^[\da-zA-z_.]{6,16}$/g
    if (!userNameReg.test(username) || !passWordReg.test(password)) {
      ctx.app.emit('error', errorTypes.USERNAME_OR_PASSWORD_INCONFORMITY, ctx)
      return
    }

    const res = await userService.getUserByName(username, ctx)
    if (Array.isArray(res) && res.length) {
      ctx.app.emit('error', errorTypes.USER_ALREADY_EXISTS, ctx)
      return
    }
    await next()
  }

  async loginVerifyParams(ctx: Context, next: Next) {
    const user = ctx.request.body as Omit<User.IUserAccount, 'id'>
    user.password = password2md5(user.password)
    const res: User.IUserInfo[] = await userService.getUserInfoByAccount(user, ctx)
    if (!res.length) {
      ctx.app.emit('error', errorTypes.USERNAME_OR_PASSWORD_ERROR, ctx)
      return
    }
    ctx.userInfo = res[0]
    await next()
  }

  async verifyUpdateUserGrade(ctx: Context, next: Next) {
    const { role } = ctx.userInfo as User.IUserInfo
    const userId: number = ctx.params.userId
    const [{ role: paramsRole }]: User.IUserInfo[] = await userService.getUserInfoById([userId], ctx)

    if (role.grade <= paramsRole.grade) {
      // 修改者的权限 >= 被修改者当前的权限
      await next()
    } else ctx.app.emit('error', errorTypes.INSUFFICIENT_PRIVILEGES_GRADE, ctx)
  }
  async verifyDeleteUserGrade(ctx: Context, next: Next) {
    const { role } = ctx.userInfo as User.IUserInfo
    const { userIds } = ctx.request.body as { userIds: number[] }
    const userInfos: User.IUserInfo[] = await userService.getUserInfoById(userIds, ctx)
    const flag = userInfos.every((e) => role.grade <= e.role.grade)

    if (flag) await next()
    else ctx.app.emit('error', errorTypes.INSUFFICIENT_PRIVILEGES_GRADE, ctx)
  }
}
export const { registerVerifyParams, loginVerifyParams, verifyUpdateUserGrade, verifyDeleteUserGrade } =
  new UserMiddleware()
