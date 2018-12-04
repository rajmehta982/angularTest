import { Comment } from './comment.ts'

export class Dish{
  id: string;
  name : string;
  image : string;
  category : string;
  label : string;
  featured : boolean;
  price : string ;
  description : string ;
  comments: Comment[];
}
