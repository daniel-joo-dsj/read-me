import type { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { uploadFile } from '../../../application/uploadFile.js';
import { adaptFile } from '../adapters/fileAdapter.js';

async function upload (fastify: FastifyInstance, options: FastifyPluginOptions) {
    fastify.post('/upload', async (request, reply) => {
        // Adapt Fastify Request file to one readable to domain
        const applicationFile = await adaptFile(request)

        // Upload file
        await uploadFile(options.filepath, fastify.log, applicationFile)
        reply.send({ message: 'PDF uploaded successfully'})
    })
}

export default upload;