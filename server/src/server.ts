import Fastify from 'fastify'
import cors from '@fastify/cors'
import { appRoutes } from './routes'
const app = Fastify()

app.register(cors, {
    origin: '*'
})
app.register(appRoutes)

app.listen({
    port: 3333,
    host: '0.0.0.0'
}).then(() => {
    console.log('HTTP server running on port 3333')
})