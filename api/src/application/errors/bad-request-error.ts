import { InfrastructureError } from "./infrastructure-error.js"

export class BadRequestError extends InfrastructureError {
    readonly code = 'UPLOAD_FAILED'
    readonly userMessage = 'No file uploaded.'
}