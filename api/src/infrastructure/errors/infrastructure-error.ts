export abstract class InfrastructureError extends Error {
    abstract readonly code: string
    abstract readonly userMessage: string
}