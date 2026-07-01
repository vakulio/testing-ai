import { Paginated } from './paginated.model';

export interface CommentUser {
  id: number;
  username: string;
  fullName: string;
}

export interface Comment {
  id: number;
  body: string;
  postId: number;
  likes: number;
  user: CommentUser;
}

export type CommentsResponse = Paginated<Comment, 'comments'>;
