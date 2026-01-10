import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify'
import { DomainError } from '@domain/errors/domain-error.js'
import { InfrastructureError } from '@application/errors/infrastructure-error.js'

export function errorHandler(
  error: FastifyError,
  _req: FastifyRequest,
  reply: FastifyReply
) {
  if (error instanceof DomainError) {
    reply.status(400).send({
      error: error.code,
      message: error.userMessage,
    })
    return
  }

  if (error instanceof InfrastructureError) {
    reply.status(401).send({
      error: error.code,
      message: error.userMessage,
    })
    return
  }

  reply.status(500).send({
    error: 'INTERNAL_SERVER_ERROR',
    message: 'Something went wrong.',
  })
}