import { FastifyPluginAsync } from 'fastify'
import db from '../db'

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/', async function (request, reply) {
    return { root: true }
  })

  fastify.get("/health", async function (req, res) {
    return { status: "ok" }
  })
}

export default root;
