import { Component, input } from '@angular/core';
import { HeaderComponent } from '../../../shared/header/header';
import { FooterComponent } from '../../../shared/footer/footer';

@Component({
  selector: 'app-legal-stub',
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './legal-stub.html',
})
export class LegalStubPageComponent {
  title = input.required<string>();
}
