
import { NextFunction, Request, Response, Router } from 'express';
import { PostNotFoundException } from '../exceptions/PostExceptions';

import authMiddleware from '../auth/auth.middleware';
import { AuthenticatedRequest, Controller } from '../interfaces';
import { defaultModifier } from '../utils/mongooseToJsonModifier';
import validationMiddleware from '../utils/validation.middleware';
import { Post, PostDTO, postModel } from './post';

class PostController implements Controller {
  public path = '/posts';
  public router = Router();
  private post = postModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.getAllPosts);
    this.router.get(`${this.path}/:id`, this.getPostById);
    this.router
      .all(`${this.path}/*`, authMiddleware)
      .patch(`${this.path}/:id`, validationMiddleware(PostDTO, true), this.modifyPost)
      .delete(`${this.path}/:id`, this.deletePost)
      .post(this.path, authMiddleware, validationMiddleware(PostDTO), this.createPost);
  }

  private getAllPosts = async (request: Request, response: Response) => {
    const posts = await this.post.find();
    // .populate('author', '-password'); // to return the object with it's references included
    response.send(posts.map(post => post.toJSON(defaultModifier)));
  }

  private getPostById = async (request: Request, response: Response, next: NextFunction) => {
    const id = request.params.id;
    const post = await this.post.findById(id);
    if (post) {
      response.send(post.toJSON(defaultModifier));
    } else {
      next(new PostNotFoundException(id));
    }
  }

  private modifyPost = async (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
    const postData: Post = request.body;
    const post = await this.post.findByIdAndUpdate(request.params.id, postData, { new: true });
    if (post) {
      response.send(post.toJSON(defaultModifier));
    } else {
      next(new PostNotFoundException(request.params.id));
    }
  }

  private createPost = async (request: AuthenticatedRequest, response: Response) => {
    const postData: PostDTO = request.body;
    const createdPost = new this.post({ ...postData, author: request.userId });
    const savedPost = await createdPost.save();
    // await savedPost.populate('author', '-password').execPopulate(); // to return the object with it's references included
    response.send(savedPost.toJSON(defaultModifier));
  }

  private deletePost = async (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
    const successResponse = await this.post.findByIdAndDelete(request.params.id);
    if (successResponse) {
      response.sendStatus(204);
    } else {
      next(new PostNotFoundException(request.params.id));
    }
  }
}

export default PostController;
