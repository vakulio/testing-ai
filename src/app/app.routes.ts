import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },
  { path: '', pathMatch: 'full', redirectTo: 'products' },
  {
    path: 'products',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/products/product-list/product-list').then((m) => m.ProductList),
  },
  {
    path: 'products/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/products/product-detail/product-detail').then((m) => m.ProductDetail),
  },
  {
    path: 'users',
    canActivate: [authGuard],
    loadComponent: () => import('./features/users/user-list/user-list').then((m) => m.UserList),
  },
  {
    path: 'users/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/users/user-detail/user-detail').then((m) => m.UserDetail),
  },
  {
    path: 'posts',
    canActivate: [authGuard],
    loadComponent: () => import('./features/posts/post-list/post-list').then((m) => m.PostList),
  },
  {
    path: 'posts/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/posts/post-detail/post-detail').then((m) => m.PostDetail),
  },
  {
    path: 'comments',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/comments/comment-list/comment-list').then((m) => m.CommentList),
  },
  {
    path: 'carts',
    canActivate: [authGuard],
    loadComponent: () => import('./features/carts/cart-list/cart-list').then((m) => m.CartList),
  },
  {
    path: 'carts/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/carts/cart-detail/cart-detail').then((m) => m.CartDetail),
  },
];
