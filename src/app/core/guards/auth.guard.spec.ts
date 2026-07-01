import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  provideRouter,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';

import { authGuard } from './auth.guard';

function run(url: string): boolean | UrlTree {
  const route = {} as ActivatedRouteSnapshot;
  const state = { url } as RouterStateSnapshot;
  return TestBed.runInInjectionContext(() => authGuard(route, state)) as boolean | UrlTree;
}

describe('authGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('allows navigation when a token is present', () => {
    localStorage.setItem('accessToken', 'a-token');

    expect(run('/products')).toBe(true);
  });

  it('redirects to /login with returnUrl (UrlTree) when no token', () => {
    const result = run('/products/42');

    expect(result instanceof UrlTree).toBe(true);
    const tree = result as UrlTree;
    expect(tree.root.children['primary'].segments.map((s) => s.path)).toEqual(['login']);
    expect(tree.queryParams['returnUrl']).toBe('/products/42');
  });
});
