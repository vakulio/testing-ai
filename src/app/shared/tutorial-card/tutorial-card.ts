import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Tutorial } from '../../data/tutorials';

@Component({
  selector: 'app-tutorial-card',
  imports: [RouterLink],
  templateUrl: './tutorial-card.html',
})
export class TutorialCardComponent {
  tutorial = input.required<Tutorial>();

  protected readonly day = computed(() => this.tutorial().date.split(' ')[0]);
  protected readonly month = computed(() => this.tutorial().date.split(' ')[1]);
}
