import { DomainError } from "./domain-error.js"

export class FileUploadFailedError extends DomainError {
    readonly code = 'UPLOAD_FAILED'
    readonly userMessage = 'This file could not be uploaded.'
}