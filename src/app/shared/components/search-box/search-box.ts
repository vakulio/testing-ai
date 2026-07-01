import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-box',
  imports: [FormsModule],
  templateUrl: './search-box.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBox {
  readonly placeholder = input<string>('Search…');
  readonly query = input<string>('');
  readonly queryChange = output<string>();

  onInput(value: string): void {
    this.queryChange.emit(value);
  }
}
