import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TAGS } from '../../data/tags';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink],
  templateUrl: './sidebar.html',
})
export class SidebarComponent {
  protected readonly tags = TAGS;

  protected onSearch(): void {
    // Search is not implemented yet.
  }
}
