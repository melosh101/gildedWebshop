import z from "zod";

const envSchma = z.object({
    PORT: z.string().default("8080"),
    NODE_ENV: z.string().default("development"),
    DATABASE_URL: z.string().default(""),
});

const env = envSchma.parse(process.env);

export default env;