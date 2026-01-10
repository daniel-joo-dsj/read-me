import { DomainError } from "./domain-error.js"

export class InvalidFileTypeError extends DomainError {
    readonly code = 'INVALID_FILE_TYPE'
    readonly userMessage = 'This file type is not supported.'

    constructor(public readonly receivedType: string) {
        super(`Invalid file type: ${receivedType}`)
    }
}