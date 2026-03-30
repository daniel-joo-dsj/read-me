import { ApplicationError } from "./application-error.js"

export class InvalidFileTypeError extends ApplicationError {
    readonly code = 'INVALID_FILE_TYPE'
    readonly userMessage = 'This file type is not supported.'

    constructor(public readonly receivedType: string) {
        super(`Invalid file type: ${receivedType}`)
    }
}