export interface Tag {
  slug: string;
  label: string;
  count: number;
}

export const TAGS: Tag[] = [
  { slug: 'angular', label: 'angular', count: 12 },
  { slug: 'angular-builder', label: 'angular builder', count: 1 },
  { slug: 'angular-cdk', label: 'angular cdk', count: 3 },
  { slug: 'angular-cli', label: 'angular cli', count: 1 },
  { slug: 'angular-hint', label: 'angular hint', count: 1 },
  { slug: 'angular-overlay', label: 'angular overlay', count: 1 },
  { slug: 'angular-portal', label: 'angular portal', count: 1 },
  { slug: 'pwa', label: 'PWA', count: 1 },
  { slug: 'rxjs', label: 'rxjs', count: 3 },
  { slug: 'service-worker', label: 'Service Worker', count: 1 },
  { slug: 'signals', label: 'signals', count: 2 },
];
