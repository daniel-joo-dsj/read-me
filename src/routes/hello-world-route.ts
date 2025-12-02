import type { FastifyInstance, RouteShorthandOptions } from 'fastify'

async function helloWorld (fastify: FastifyInstance, options: RouteShorthandOptions) {
    fastify.get('/', async (request, reply) => {
        return { hello: 'world'}
  })
}


export default helloWorld;