import { Paginated } from './paginated.model';

export interface PostReactions {
  likes: number;
  dislikes: number;
}

export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
  tags: string[];
  reactions: PostReactions;
  views: number;
}

export type PostsResponse = Paginated<Post, 'posts'>;
