import { IsString } from 'class-validator';
import { Document, model, Schema } from 'mongoose';

export class PostDTO {
  @IsString()
  public content: string;

  @IsString()
  public title: string;
}

export interface Post {
  author: string;
  content: string;
  title: string;
}

const postSchema = new Schema({
  author: {
    ref: 'User',
    type: Schema.Types.ObjectId,
  },
  content: String,
  title: String,
});

export const postModel = model<Post & Document>('Post', postSchema);
