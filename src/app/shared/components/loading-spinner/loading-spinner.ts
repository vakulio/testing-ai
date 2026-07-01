import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingSpinner {}
