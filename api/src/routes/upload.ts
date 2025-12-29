import type { FastifyInstance, FastifyPluginOptions } from 'fastify'
import * as fs from 'fs/promises';

async function upload (fastify: FastifyInstance, options: FastifyPluginOptions) {
    fastify.post('/upload', async (request, reply) => {
        try {
            const data = await request.file();

            // Check if the file is uploaded
            if (!data) {
                return reply.code(400).send('No file uploaded.');
            }

            // Check if the uploaded file is a PDF
            if (data.mimetype !== 'application/pdf') {
                return reply.code(400).send('Only PDF files are allowed.');
            }

            const filename = data.filename;

            await fs.writeFile(options.filepath + filename, await data.toBuffer()); // Save file to directory
            reply.send({ message: 'PDF uploaded successfully', filename })
        } catch (error) {
            fastify.log.error(error);
            reply.code(500).send('Error uploading PDF.');
        }
    })
}

export default upload;