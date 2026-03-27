import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('3000').transform(Number),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().default('file:./dev.db'),
  AUTH_TOKEN: z.string().min(1, 'AUTH_TOKEN is required'),
});

const env = envSchema.safeParse(process.env);

if (!env.success) {
  console.error('❌ Invalid environment variables:', env.error.format());
  process.exit(1);
}

const config = {
  port: env.data.PORT,
  nodeEnv: env.data.NODE_ENV,
  databaseUrl: env.data.DATABASE_URL,
  authToken: env.data.AUTH_TOKEN,
};

export default config;
