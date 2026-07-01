import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Tutorial } from '../../data/tutorials';

@Component({
  selector: 'app-tutorial-card',
  imports: [RouterLink],
  templateUrl: './tutorial-card.html',
})
export class TutorialCardComponent {
  tutorial = input.required<Tutorial>();
}
