import crypto from 'crypto'
import os from 'os'

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
