import type { Logger } from './logger.js';
import * as fs from 'fs/promises';
import type { File } from '@domain/files/file.js';
import { FileUploadFailedError } from '@domain/errors/file-upload-failed-error.js';
import { validateFile } from '@domain/files/validate-file.js';


export async function uploadFile(uploadPath: string, logger: Logger, file: File ) {
    try {
        validateFile(file);
        await fs.writeFile(uploadPath + file.filename, file.buffer); // Save file to directory
    } catch (error) {
        logger.error('Upload failed', error);
        throw new FileUploadFailedError();
    }
}