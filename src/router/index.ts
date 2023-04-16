import fs from 'fs'
import type Koa from 'koa'
import type Router from 'koa-router'
import path from 'path'

const routerFilenames = fs.readdirSync(__dirname + '/src')

export default (app: Koa) => {
  try {
    routerFilenames.forEach((file) => {
      const basePath = path.resolve(__dirname, './src')
      const router: Router = require(`${basePath}/${file}`)
      app.use(router.routes())
      app.use(router.allowedMethods())
    })
  } catch (err) {
    console.log(err)
  }
}
