import type { FastifyRequest } from 'fastify';
import type { File } from '@domain/files/file.js'
import { BadRequestError } from '@infrastructure/errors/bad-request-error.js';
import { uploadFile } from '@application/upload-file.js';
import type { Logger } from '@application/logger.js';


export class FileAdapter {
    uploadPath: string;
    logger: Logger;

    constructor(uploadPath: string, logger: Logger) {
        this.uploadPath = uploadPath;
        this.logger = logger;
    }
    async #adaptFile(request: FastifyRequest) : Promise<File> {
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
    async upload(request: FastifyRequest ) {
        const file = await this.#adaptFile(request);
        await uploadFile(this.uploadPath, this.logger, file);
    }   
}
