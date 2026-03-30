import type { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify'
import type { FilenameParams } from '@application/file/filename-params.js';


async function embed (fastify: FastifyInstance, options: FastifyPluginOptions) {
    const { embeddingsAdapter } = options;

    fastify.get('/embed/:filename', async (request : FastifyRequest<{Params : FilenameParams}>, reply: FastifyReply) => {
        await embeddingsAdapter.embed(request.params.filename);
        return reply.status(201).send('File embedded successfully.')
    })
}

export default embed;