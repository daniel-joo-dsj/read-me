import fastify from 'fastify'
import { Server, IncomingMessage, ServerResponse } from 'http'
import fastifyMultipart from '@fastify/multipart'
import { initialize } from './initialize/initialize.js'
import type { InitializationProps } from './initialize/props.js'
import upload from './routes/upload.js'
import embed from './routes/embed.js'
import { errorHandler } from './error-handler.js'
import * as dotenv from 'dotenv'
import { FileAdapter } from './adapters/file-adapter.js'
import { EmbeddingsAdapter } from './adapters/embeddings-adapter.js'
import { createVectorStore } from './initialize/vector-store.js'


dotenv.config()

// Environment Variables
const UPLOAD_PATH = process.env.UPLOAD_PATH!


// Initialize server
const server: fastify.FastifyInstance<Server, IncomingMessage, ServerResponse> = fastify({
    logger: true
})

const initializationProps : InitializationProps = {
  dirPath: UPLOAD_PATH,
  fastify: server
}

initialize(initializationProps)
server.setErrorHandler(errorHandler)
server.register(fastifyMultipart)

// Register upload endpoint
const fileAdapter = new FileAdapter(UPLOAD_PATH);
server.register(upload, {
  fileAdapter
})

// Register embed endpoint
const vectorStore = await createVectorStore();
const embeddingsAdapter = new EmbeddingsAdapter(UPLOAD_PATH, vectorStore);
server.register(embed, {
  embeddingsAdapter
})

server.listen({ port: parseInt(process.env.PORT!), host: process.env.HOST!}, (err, address) => {
  if (err) {
    server.log.error(err)
    process.exit(1)
  }
  server.log.info(`Server listening at ${address}`)
})