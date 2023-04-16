import mysql from 'mysql2'

import config from './config'

const pool = mysql.createPool({
  host: config.MYSQL_HOST,
  port: config.MYSQL_PORT as unknown as number,
  database: config.MYSQL_DATABASE,
  user: config.MYSQL_USER,
  password: config.MYSQL_PASSWORD
})

pool.getConnection((err, conn) => {
  conn.connect((err) => {
    err ? console.log('数据库连接失败', err) : console.log('数据库连接成功')
  })
})

export default pool.promise()
