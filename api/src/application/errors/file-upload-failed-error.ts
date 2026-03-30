import { ApplicationError } from "./application-error.js"

export class FileUploadFailedError extends ApplicationError {
    readonly code = 'UPLOAD_FAILED'
    readonly userMessage = 'This file could not be uploaded.'
}