import { Component, inject, input, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UiStateService } from '../ui-state.service';
import { SidebarComponent } from '../sidebar/sidebar';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, SidebarComponent],
  templateUrl: './header.html',
})
export class HeaderComponent {
  variant = input<'blog' | 'courses'>('blog');

  protected readonly uiState = inject(UiStateService);
  protected readonly mobileMenuOpen = signal(false);

  protected toggleMenu(): void {
    if (this.variant() === 'blog') {
      this.uiState.toggle();
    } else {
      this.mobileMenuOpen.update((open) => !open);
    }
  }
}
