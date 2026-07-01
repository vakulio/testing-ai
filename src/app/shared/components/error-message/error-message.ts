import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-error-message',
  templateUrl: './error-message.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorMessage {
  readonly message = input<string>('Something went wrong. Please try again.');
}
