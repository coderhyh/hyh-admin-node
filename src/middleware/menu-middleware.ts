import { Context, Next } from 'koa'

import errorTypes from '~/constants/error-types'
import { MENU_TYPE } from '~/enums/menu.enum'
import menuService from '~/service/menu-service'

class MenuMiddleware {
  /**
   * @description 1. 目录的上级可以是目录
                  2. 菜单的上级是目录，不可以是其他的 包括自己
                  3. 权限的上级是菜单，不可以是其他的 包括自己
   */
  async verifyMenuType(ctx: Context, next: Next) {
    try {
      const { type, parentId } = ctx.request.body as Menu.IMenuItem
      const err_msg = errorTypes.MENU_TYPE_BAD
      const message1 = `[${MENU_TYPE[type]}] 类型的上级不可以是 [主类目]`
      if (parentId === null || !parentId) {
        if (type === 'permission')
          return ctx.app.emit('error', { ...err_msg, message: err_msg.message + message1 }, ctx)
        return await next()
      }

      const list: Menu.IMenuItem[] = await menuService.getMenuItemById(parentId, ctx)
      const parentType = list[0].type
      const mapMenuType: { [k in Menu.MenuType]: number } = {
        directory: 3,
        menu: 2,
        permission: 1
      }
      const curNum = mapMenuType[type]
      const parentNum = mapMenuType[parentType]
      let flag = true
      const message2 = `[${MENU_TYPE[type]}] 类型的上级不可以是 [${MENU_TYPE[parentType]}]`
      if (type === 'directory') {
        flag = curNum <= parentNum
      } else if (type === 'menu') {
        flag = curNum < parentNum
      } else if (type === 'permission') {
        flag = parentNum === 2
      }
      flag ? await next() : ctx.app.emit('error', { ...err_msg, message: err_msg.message + message2 }, ctx)
    } catch (error) {
      console.log(error)
    }
  }
}

export const { verifyMenuType } = new MenuMiddleware()
