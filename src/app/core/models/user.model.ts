import { Paginated } from './paginated.model';

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  maidenName?: string;
  age?: number;
  phone?: string;
  birthDate?: string;
  bloodGroup?: string;
  height?: number;
  weight?: number;
  eyeColor?: string;
  role?: string;
}

export type UsersResponse = Paginated<User, 'users'>;
