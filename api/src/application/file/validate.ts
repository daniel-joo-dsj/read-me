import type { File } from './file.js'
import { InvalidFileTypeError } from '../errors/invalid-file-type-error.js';


export function validateFile(file: File) {
    // Check if the uploaded file is a PDF
    if (file.mimetype !== 'application/pdf') {
        throw new InvalidFileTypeError(file.mimetype)
    }
}