import type { File } from '../types/interfaces.js'
import { InvalidFileTypeError } from '../types/errors.js';


export function validatePdf(file: File) {
    // Check if the uploaded file is a PDF
    if (file.mimetype !== 'application/pdf') {
        throw new InvalidFileTypeError(file.mimetype)
    }
}