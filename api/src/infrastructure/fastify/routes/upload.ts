import type { FastifyInstance, FastifyPluginOptions } from 'fastify'


async function upload (fastify: FastifyInstance, options: FastifyPluginOptions) {
    const { fileAdapter } = options;

    fastify.post('/upload', async (request, reply) => {
       await fileAdapter.upload(request)
       return reply.status(201).send('File uploaded successfully.')
    })
}

export default upload;