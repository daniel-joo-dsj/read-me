import fastify from 'fastify'
import { Server, IncomingMessage, ServerResponse } from 'http'
import fastifyMultipart from '@fastify/multipart'
import { initialize } from '../services/initialize.js'
import type { InitializationProps } from '../types/interfaces.js'
import uploadPDF from '../routes/upload-pdf.js'
import createChunks from '../routes/create-chunks.js'
import * as dotenv from 'dotenv'

dotenv.config()

// Initialize server
const server: fastify.FastifyInstance<Server, IncomingMessage, ServerResponse> = fastify({
    logger: true
})

const initializationProps : InitializationProps = {
  dirPath: process.env.UPLOAD_PATH!,
  fastify: server
}

initialize(initializationProps)

// Register endpoints
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