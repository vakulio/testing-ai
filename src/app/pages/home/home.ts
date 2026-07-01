import { Component, signal } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header';
import { FooterComponent } from '../../shared/footer/footer';
import { TutorialCardComponent } from '../../shared/tutorial-card/tutorial-card';
import { TUTORIALS } from '../../data/tutorials';

@Component({
  selector: 'app-home',
  imports: [HeaderComponent, FooterComponent, TutorialCardComponent],
  templateUrl: './home.html',
})
export class HomePageComponent {
  protected readonly tutorials = signal(TUTORIALS);
}
