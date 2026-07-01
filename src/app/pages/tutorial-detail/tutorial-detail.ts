import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header';
import { FooterComponent } from '../../shared/footer/footer';
import { TUTORIALS } from '../../data/tutorials';
import { TUTORIAL_BODY } from '../../data/tutorial-content';

@Component({
  selector: 'app-tutorial-detail',
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './tutorial-detail.html',
})
export class TutorialDetailPageComponent {
  private readonly route = inject(ActivatedRoute);

  private readonly slug = this.route.snapshot.paramMap.get('slug') ?? '';

  protected readonly tutorial = TUTORIALS.find((t) => t.slug === this.slug) ?? null;
  protected readonly body = TUTORIAL_BODY[this.slug] ?? null;
}
