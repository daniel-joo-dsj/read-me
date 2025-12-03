import fastify from 'fastify'
import { Server, IncomingMessage, ServerResponse } from 'http'
import fastifyMultipart from '@fastify/multipart'
import mongoDBConnector from '../services/mongo-db-connector.js'
import animals from '../routes/animals-route.js'
import helloWorld from '../routes/hello-world-route.js'
import uploadPDF from '../routes/upload-pdf-route.js'
import createChunks from '../routes/create-chunks-route.js'
import * as dotenv from 'dotenv'

dotenv.config()


const server: fastify.FastifyInstance<Server, IncomingMessage, ServerResponse> = fastify({
    logger: true
})


server.register(mongoDBConnector, {
  'url': process.env.MONGO_DB_URL
})
server.register(helloWorld)
server.register(animals)
server.register(fastifyMultipart)
server.register(uploadPDF, {
  'filepath': process.env.UPLOAD_PATH
})
server.register(createChunks, {
  'path': process.env.UPLOAD_PATH
})

server.listen({ port: parseInt(process.env.PORT!), host: process.env.HOST!}, (err, address) => {
  if (err) {
    server.log.error(err)
    process.exit(1)
  }
  server.log.info(`Server listening at ${address}`)
})