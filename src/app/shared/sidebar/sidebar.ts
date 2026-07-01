import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TAGS } from '../../data/tags';
import { UiStateService } from '../ui-state.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink],
  templateUrl: './sidebar.html',
})
export class SidebarComponent {
  protected readonly tags = TAGS;
  protected readonly uiState = inject(UiStateService);

  protected onSearch(): void {
    // Search is not implemented yet.
  }
}
