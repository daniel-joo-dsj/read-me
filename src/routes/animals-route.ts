import type { FastifyInstance, FastifyRequest, RouteShorthandOptions, FastifyReply } from 'fastify'
import type { Db } from 'mongodb'
import type { AnimalParams } from '../types/animal.js'


async function animals (fastify: FastifyInstance, options: RouteShorthandOptions) {
  const database: Db = fastify.mongo.db!
  const collection = database.collection('test_collection') //  TODOl\: pass in colleciton as parameter
  
  const animalBodyJsonSchema = {
    type: 'object',
    required: ['animal'],
    properties: {
      animal: { type: 'string' },
    },
  }


  fastify.get('/animals', async (request, reply) => {
    const result = await collection.find().toArray()
    if (result.length === 0) {
      throw new Error('No documents found')
    }
    return result
  })

  fastify.get('/animals/:animal', async (request: FastifyRequest<{ Params: AnimalParams }>, reply: FastifyReply) => {
    const result = await collection.findOne({ animal: request.params.animal })
    if (!result) {
      throw new Error('Invalid value')
    }
    return result
  })


  const schema = {
    body: animalBodyJsonSchema,
  }

  fastify.post('/animals', { schema }, async (request: FastifyRequest<{ Body: AnimalParams }>, reply) => {
    // we can use the `request.body` object to get the data sent by the client
    const result = await collection.insertOne({ animal: request.body.animal })
    return result
  })
}

export default animals;