import type { Logger } from '../types/logger.js';
import * as fs from 'fs/promises';
import type { File } from '../types/interfaces.js'
import { FileUploadFailedError } from '../types/errors.js';
import { validatePdf } from '../domain/validateFile.js'

export async function uploadFile(filepath: string, logger: Logger, file: File ) {
    try {
        validatePdf(file);
        await fs.writeFile(filepath + file.filename, file.buffer); // Save file to directory
    } catch (error) {
        logger.error('Upload failed', error);
        throw new FileUploadFailedError();
    }
}