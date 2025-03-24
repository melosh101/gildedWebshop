import env from "../env"
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";


const db = drizzle(env.DATABASE_URL, {
    schema: schema,
});

export default db;