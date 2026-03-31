import fastify from 'fastify'
import { Server, IncomingMessage, ServerResponse } from 'http'
import fastifyMultipart from '@fastify/multipart'
import { initialize } from './initialize/initialize.js'
import type { InitializationProps } from './initialize/props.js'
import upload from './routes/upload.js'
import embed from './routes/embed.js'
import converse from './routes/converse.js'
import { errorHandler } from './error-handler.js'
import * as dotenv from 'dotenv'
import { FileAdapter } from './adapters/file-adapter.js'
import { EmbeddingsAdapter } from './adapters/embeddings-adapter.js'
import { ConversationAdapter } from './adapters/conversation-adapter.js'
import { createVectorStore } from './initialize/vector-store.js'
import { Pool } from 'pg'
import { createChatAgent } from '@application/agent/create.js'

dotenv.config()

// Environment Variables
const HOST = process.env.HOST!
const PORT = parseInt(process.env.PORT!)
const UPLOAD_PATH = process.env.UPLOAD_PATH!
const DB_PORT = parseInt(process.env.DB_PORT!)
const DB_CONTAINER_NAME = process.env.DB_CONTAINER_NAME!
const POSTGRES_USER = process.env.POSTGRES_USER!
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD!
const POSTGRES_DB = process.env.POSTGRES_DB!

// Reusable Pool for postgres
const pool = new Pool(
  {
    host: DB_CONTAINER_NAME,
    port: DB_PORT,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    database: POSTGRES_DB,
  }
)

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
const fileAdapter = new FileAdapter(UPLOAD_PATH, server.log);
server.register(upload, {
  fileAdapter
})

// Register embed endpoint
const vectorStore = await createVectorStore(pool);
const embeddingsAdapter = new EmbeddingsAdapter(UPLOAD_PATH, vectorStore, server.log);
server.register(embed, {
  embeddingsAdapter
})

// Register converse endpoint
const conversationAdapter = new ConversationAdapter(pool, server.log);
const agent = await createChatAgent(vectorStore, server.log)
server.register(converse, {
  conversationAdapter,
  agent
})

server.listen({ port: PORT, host: HOST}, (err, address) => {
  if (err) {
    server.log.error(err)
    process.exit(1)
  }
  server.log.info(`Server listening at ${address}`)
})