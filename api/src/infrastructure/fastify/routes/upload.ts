import type { FastifyInstance, FastifyPluginOptions } from 'fastify'


async function upload (fastify: FastifyInstance, options: FastifyPluginOptions) {
    const { fileAdapter } = options;

    fastify.post('/upload', async (request, reply) => {
        fileAdapter.upload(request, fastify.log)
        reply.send({ message: 'File uploaded successfully'})
    })
}

export default upload;