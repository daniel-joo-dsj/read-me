import { InfrastructureError } from "./infrastructure-error.js";


export class FileDoesNotExistError extends InfrastructureError {
    readonly code = 'FILE_DOES_NOT_EXIST'
    readonly userMessage = 'File was not found.'
}