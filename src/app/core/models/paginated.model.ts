/**
 * DummyJSON list responses share a common envelope of pagination metadata plus
 * a single array field keyed by the resource name (e.g. `products`, `users`).
 *
 * `Paginated<T, K>` models that precisely: the pagination fields plus a
 * `Record<K, T[]>` for the resource-named array.
 *
 * Example: `Paginated<Product, 'products'>` -> `{ total; skip; limit; products: Product[] }`.
 */
export type Paginated<T, K extends string> = {
  total: number;
  skip: number;
  limit: number;
} & Record<K, T[]>;
