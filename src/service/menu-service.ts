import { Context } from 'koa'

import connection from '~/app/database'
import { handlerServiceError } from '~/common/utils'

class PermissionService {
  async getPermissionListSelect(ctx: Context) {
    const s = `
      SELECT page, route, JSON_ARRAYAGG(
          JSON_OBJECT('id', id, 'page', page, 'route', route, 'control', control, 'handle', handle, 'description', description)
        ) children 
      FROM sys_menu 
      GROUP BY page, route
    `
    return handlerServiceError(ctx, async () => {
      const res = await connection.execute(s)
      return res[0]
    })
  }
}

export default new PermissionService()
