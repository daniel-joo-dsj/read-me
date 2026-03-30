import { InfrastructureError } from "./infrastructure-error.js"


export class SQLInsertionError extends InfrastructureError {
    readonly code = 'INSERT_FAILED'
    readonly userMessage = 'Could not insert into database.'

    constructor(public readonly receivedQuery: string) {
        super(`Invalid query: ${receivedQuery}`)
    }
}
