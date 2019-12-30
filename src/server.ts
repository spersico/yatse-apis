import 'dotenv/config';
import App from './app';
import AuthenticationController from './auth/authentication.controller';
import PostController from './post/post.controller';
import UserController from './user/user.controller';
import environmentVarsValidator from './utils/environmentVarsValidator';

environmentVarsValidator();

const app = new App(
  [
    new PostController(),
    new AuthenticationController(),
    new UserController(),
  ],
);

app.listen();
