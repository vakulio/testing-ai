import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UiStateService {
  readonly isMenuOpen = signal(false);

  toggle(): void {
    this.isMenuOpen.update((open) => !open);
  }

  close(): void {
    this.isMenuOpen.set(false);
  }
}
