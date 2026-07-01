import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { HeaderComponent } from '../../shared/header/header';
import { FooterComponent } from '../../shared/footer/footer';
import { RECOMMENDATIONS } from '../../data/recommendations';

@Component({
  selector: 'app-recommendations',
  imports: [HeaderComponent, FooterComponent, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './recommendations.html',
})
export class RecommendationsPageComponent {
  protected readonly recommendations = signal(RECOMMENDATIONS);
}
