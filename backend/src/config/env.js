import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const requiredVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
];

const missing = requiredVars.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
  process.exit(1);
}

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5000,
  mongodbUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 5 * 1024 * 1024,
  uploadDir: process.env.UPLOAD_DIR || 'uploads',
  logLevel: process.env.LOG_LEVEL || 'info',
  isDev: (process.env.NODE_ENV || 'development') === 'development',
  isProd: process.env.NODE_ENV === 'production',
};

export default env;
