import { cleanEnv, port, str } from 'envalid';

export default function environmentVarsValidator() {
  cleanEnv(process.env, {
    JWT_SECRET: str(),
    CORS_ENABLED: str(),
    CONNECTION_STRING: str(),
    PORT: port(),
    SALT: str(),
  });
}