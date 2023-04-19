import crypto from 'crypto'
import tk from 'jsonwebtoken'
import { Context, Next } from 'koa'
import os from 'os'

import { PRIVATE_KEY, PUBLIC_KEY } from '~/app/config'
import errorTypes from '~/constants/error-types'
import { ICreateUser, IUserInfo } from '~/types/user'

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

export const handlerServiceError = (ctx: Context) => (err: any) => {
  console.log(err)
  ctx.app.emit('error', errorTypes.SERVER_ERROR, ctx)
  return err
}

export const createToken = (userInfo: any) =>
  new Promise<string>((resolve, reject) => {
    tk.sign(userInfo, PRIVATE_KEY, { expiresIn: '12h', algorithm: 'RS256' }, (err, token) => {
      if (err) reject(err)
      resolve(token!)
    })
  })

export const verifyToken = (token: string) =>
  new Promise<Omit<ICreateUser, 'role' | 'nickname'>>((resolve, reject) => {
    tk.verify(token, PUBLIC_KEY, { algorithms: ['RS256'] }, (err, data) => {
      if (err) reject(err)
      resolve(data as Omit<ICreateUser, 'role'>)
    })
  })
