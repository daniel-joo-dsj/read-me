// Domain
export abstract class DomainError extends Error {
    abstract readonly code: string
    abstract readonly userMessage: string
}

export class InvalidFileTypeError extends DomainError {
    readonly code = 'INVALID_FILE_TYPE'
    readonly userMessage = 'This file type is not supported.'

    constructor(public readonly receivedType: string) {
        super(`Invalid file type: ${receivedType}`)
    }
}
export class FileUploadFailedError extends DomainError {
    readonly code = 'UPLOAD_FAILED'
    readonly userMessage = 'This file could not be uploaded.'
}

// Infrastructure
export abstract class InfrastructureError extends Error {
    abstract readonly code: string
    abstract readonly userMessage: string
}

export class BadRequestError extends InfrastructureError {
    readonly code = 'UPLOAD_FAILED'
    readonly userMessage = 'No file uploaded.'
}