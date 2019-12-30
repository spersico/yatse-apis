import { cleanEnv, port, str } from 'envalid';

export default function environmentVarsValidator() {
  cleanEnv(process.env, {
    JWT_SECRET: str(),
    CONNECTION_STRING: str(),
    PORT: port(),
  });
}
