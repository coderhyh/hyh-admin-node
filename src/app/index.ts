import bodyParser from 'koa-bodyparser'
import cors from 'koa-cors'

import { handleError } from '~/common/handle-error'
import { MyKoa } from '~/common/MyKoa'
import useRouter from '~/router/index'

export interface App extends MyKoa {
  useRouter?: typeof useRouter
}

const app: App = new MyKoa()
app.useRouter = useRouter

app.use(cors({ methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] }))
app.use(bodyParser())
app.useRouter(app)

app.on('error', handleError)

export default app
