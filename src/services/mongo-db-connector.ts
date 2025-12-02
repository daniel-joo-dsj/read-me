import fastifyPlugin from 'fastify-plugin'
import fastifyMongo from '@fastify/mongodb'
import type { FastifyInstance, FastifyPluginOptions } from 'fastify'


async function mongoDBConnector (fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.register(fastifyMongo, {
    url: options.url
  })
}

export default fastifyPlugin(mongoDBConnector)