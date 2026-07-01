import { signal, Signal } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Small signal-based container for the loading / error / value lifecycle of an
 * async read (list or detail fetch). Reusable across feature services and
 * components without pulling in RxJS state primitives.
 *
 * Usage:
 * ```ts
 * const state = resourceState<Product[]>();
 * state.run(this.productService.list()); // Observable or Promise
 * // template: state.loading(), state.error(), state.value()
 * ```
 */
export interface ResourceState<T> {
  /** Latest successfully resolved value, or `null` before first success. */
  readonly value: Signal<T | null>;
  /** True while a run is in flight. */
  readonly loading: Signal<boolean>;
  /** Error from the most recent failed run, or `null`. */
  readonly error: Signal<unknown>;
  /** Kick off a new async read from an Observable or Promise. */
  run(source: Observable<T> | Promise<T>): void;
  /** Imperatively set the resolved value (e.g. from cached data). */
  set(value: T): void;
  /** Reset back to the initial empty state. */
  reset(): void;
}

export function resourceState<T>(initial: T | null = null): ResourceState<T> {
  const value = signal<T | null>(initial);
  const loading = signal(false);
  const error = signal<unknown>(null);

  const onSuccess = (result: T): void => {
    value.set(result);
    loading.set(false);
    error.set(null);
  };

  const onError = (err: unknown): void => {
    error.set(err);
    loading.set(false);
  };

  const run = (source: Observable<T> | Promise<T>): void => {
    loading.set(true);
    error.set(null);

    if (source instanceof Observable) {
      source.subscribe({ next: onSuccess, error: onError });
    } else {
      source.then(onSuccess).catch(onError);
    }
  };

  const set = (result: T): void => {
    onSuccess(result);
  };

  const reset = (): void => {
    value.set(initial);
    loading.set(false);
    error.set(null);
  };

  return {
    value: value.asReadonly(),
    loading: loading.asReadonly(),
    error: error.asReadonly(),
    run,
    set,
    reset,
  };
}
