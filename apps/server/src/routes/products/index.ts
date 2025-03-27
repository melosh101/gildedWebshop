import { FastifyPluginAsync } from "fastify"
import db from "../../db";
import z from "zod";
import { productTable } from "../../db/schema";
import { and, eq, sql } from "drizzle-orm";
import { TProduct } from "../..";

const productListParams = z.object({
  page: z.coerce.number().min(1).default(1),
  count: z.coerce.number().min(1).default(20),
  gender: z.string().optional(),
  category: z.string().optional(),
})

const productParams = z.object({
  id: z.coerce.number()
})

const products: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/', async function (request, reply) {
    const body = productParams.safeParse(request.query);

    if(body.success === false) {
      reply.status(400).send(body.error);
      return;
    }

    const product = await db.query.productTable.findFirst({
      where: eq(productTable.id, body.data.id),
      with: {
        productVariant: true
      }
    })
    return product;
  })

  fastify.get('/list', async function (request, reply) {
    const body = productListParams.safeParse(request.query);

    if(body.success === false) {
      reply.status(400).send(body.error);
      return;
    }

    const filter = [];
    if(body.data.gender !== undefined) {
      filter.push(eq(productTable.gender, body.data.gender as TProduct["gender"]));
    }
    if(body.data.category !== undefined) {
      filter.push(eq(productTable.category, body.data.category as TProduct["category"]));
    }

    const prods = await db.query.productTable.findMany({
      with: {
        productVariant: true
      },
      where: and(...filter),
      orderBy: (t, {asc}) => [asc(t.id)], 
      limit: 20,
      offset: (body.data.page - 1) * 20
    });
    console.log("counting")
    const [totalProds] = await db.select({count: sql`count(*)`.mapWith(Number)}).from(productTable).where(and(...filter));
    console.log(totalProds.count);
    return {
      pageSize: body.data.count,
      page: body.data.page,
      maxPages: Math.ceil(totalProds.count / body.data.count),
      data: prods
    };
  })
}

export default products;
