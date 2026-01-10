import type { FastifyRequest } from 'fastify';
import type { File } from '../../../types/interfaces.js'
import { BadRequestError } from '../../../types/errors.js';

export async function adaptFile(request: FastifyRequest) : Promise<File> {
    const file = await request.file();
    if (!file) {
        throw new BadRequestError()
    }
    const buffer = await file.toBuffer()
    return {
        buffer,
        filename: file.filename,
        mimetype: file.mimetype,
        size: buffer.length
    } as File
}