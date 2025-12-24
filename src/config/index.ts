import dotenv from 'dotenv';

dotenv.config();

function requiredEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`${name} environment variable is required`);
  return v;
}

export const config = {
  port: Number(process.env.PORT ?? 5000),
  mongodbUri: requiredEnv('MONGODB_URI'),
  uploadsDir: 'uploads',
};
