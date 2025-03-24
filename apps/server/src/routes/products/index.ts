import { FastifyPluginAsync } from "fastify"
import db from "../../db";
import z from "zod";

const productList = z.object({
  page: z.number().min(1).default(1),
  count: z.number().min(1).default(20)
})

const products: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/', async function (request, reply) {
    return { hello: 'world' }
  })

  fastify.get('/list', async function (request, reply) {
    const body = productList.safeParse(request.query);

    if(body.success === false) {
      reply.status(400).send(body.error);
      return;
    }

    const prods = db.query.productTable.findMany({
      with: {
        productVariant: true
      },
      limit: 20,
      offset: (body.data.page - 1) * 20
    })

    return prods;
  })
}

export default products;
