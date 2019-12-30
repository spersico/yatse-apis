import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import express, { Application } from 'express';
import { connect } from 'mongoose';
import 'reflect-metadata';
import exceptionMiddleware from './exceptions/Exception.middleware';
import { Controller } from './interfaces';
import corsMiddleware from './utils/cors.middleware';
import helmetMiddleware from './utils/helmet.middleware';
import loggerMiddleware from './utils/logger.middleware';

class App {
  public app: Application;

  constructor(controllers: Controller[]) {
    this.app = express();

    this.connectToTheDatabase();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(process.env.PORT, () => {
      console.log(`${process.env.NODE_ENV.toUpperCase()}: API running on port ${process.env.PORT}`);
    });
  }

  public getServer() {
    return this.app;
  }

  private initializeMiddlewares() {
    this.app.use(corsMiddleware);
    this.app.use(helmetMiddleware);
    this.app.use(bodyParser.json());
    this.app.use(cookieParser());
    this.app.use(compression());
    if (process.env.USE_LOGGER) {
      this.app.use(loggerMiddleware);
    }
  }

  private initializeErrorHandling() {
    this.app.use(exceptionMiddleware);
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use('/', controller.router);
    });
    this.app.get('/ping', (_, res) => { res.send('Ping check - ' + new Date().toUTCString()); });
  }

  private connectToTheDatabase() {
    connect(process.env.CONNECTION_STRING, { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false });
  }
}

export default App;
