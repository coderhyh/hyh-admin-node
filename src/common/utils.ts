import crypto from 'crypto'
import tk from 'jsonwebtoken'
import { Context } from 'koa'
import os from 'os'

import { PRIVATE_KEY, PUBLIC_KEY } from '~/app/config'
import errorTypes from '~/constants/error-types'

export const password2md5 = (password: string) => {
  const md5 = crypto.createHash('md5')
  const result = md5.update(password).digest('hex')
  return result
}

export function getIpAddress() {
  const ifaces = os.networkInterfaces()
  for (const dev in ifaces) {
    const iface = ifaces[dev]
    if (iface) {
      for (let i = 0; i < iface.length; i++) {
        const { family, address, internal } = iface[i]
        if (family === 'IPv4' && address !== '127.0.0.1' && !internal) {
          return address
        }
      }
    }
  }
}

export const handlerServiceError = async (ctx: Context, fn: Function): Promise<any> => {
  try {
    return await fn()
  } catch (err) {
    console.log('handlerServiceError -----> ', err)
    ctx.app.emit('error', errorTypes.SERVER_ERROR, ctx)
    return err
  }
}

export const createToken = (userInfo: any) =>
  new Promise<string>((resolve, reject) => {
    tk.sign(userInfo, PRIVATE_KEY, { expiresIn: '12h', algorithm: 'RS256' }, (err, token) => {
      if (err) reject(err)
      resolve(token!)
    })
  })

export const verifyToken = (token: string) =>
  new Promise<Omit<User.ICreateUser, 'role' | 'nickname'>>((resolve, reject) => {
    tk.verify(token, PUBLIC_KEY, { algorithms: ['RS256'] }, (err, data) => {
      if (err) reject(err)
      resolve(data as Omit<User.ICreateUser, 'role'>)
    })
  })

export const getDataType = (data: any): App.IDataType =>
  Object.prototype.toString.call(data).match(/\[object ([a-zA-Z]+)\]/)[1]
