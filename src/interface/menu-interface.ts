import { Context } from 'koa'

import menuService from '~/service/menu-service'

class PermissionInterface {
  async getMenuTree(ctx: Context) {
    const menuTree = await menuService.getMenuTree(ctx)
    ctx.body ??= {
      code: 200,
      menuTree
    }
  }
  async getMenuTreeSelect(ctx: Context) {
    const menuTreeSelect = await menuService.getMenuTreeSelect(ctx)
    ctx.body ??= {
      code: 200,
      menuTreeSelect
    }
  }
  async getMenu(ctx: Context) {
    const menu = await menuService.getMenu(ctx)
    ctx.body ??= {
      code: 200,
      menu
    }
  }
  async createMenu(ctx: Context) {
    await menuService.createMenu(ctx)
    ctx.body ??= {
      code: 200,
      message: '添加成功'
    }
  }
  async updateMenu(ctx: Context) {
    const flag = await menuService.updateMenu(ctx)
    ctx.body ??= {
      code: 200,
      message: flag ? '修改成功' : '用户不存在'
    }
  }
  async deleteMenu(ctx: Context) {
    const flag = await menuService.deleteMenu(ctx)
    ctx.body ??= {
      code: 200,
      message: flag ? '删除成功' : '角色不存在'
    }
  }
}

export const { getMenuTree, getMenuTreeSelect, getMenu, createMenu, updateMenu, deleteMenu } = new PermissionInterface()
