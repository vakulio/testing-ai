import { Component, signal } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header';
import { FooterComponent } from '../../shared/footer/footer';
import { RECOMMENDATIONS } from '../../data/recommendations';

@Component({
  selector: 'app-recommendations',
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './recommendations.html',
})
export class RecommendationsPageComponent {
  protected readonly recommendations = signal(RECOMMENDATIONS);
}
