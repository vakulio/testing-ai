import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { TAGS } from '../../data/tags';
import { UiStateService } from '../ui-state.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatChipsModule],
  templateUrl: './sidebar.html',
})
export class SidebarComponent {
  protected readonly tags = TAGS;
  protected readonly uiState = inject(UiStateService);

  protected onSearch(): void {
    // Search is not implemented yet.
  }
}
