import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

export const PRIVATE_KEY = fs.readFileSync(path.resolve(__dirname, './keys/private.key'))
export const PUBLIC_KEY = fs.readFileSync(path.resolve(__dirname, './keys/public.key'))

dotenv.config()

export default process.env
