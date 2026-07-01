import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { HeaderComponent } from '../../shared/header/header';
import { FooterComponent } from '../../shared/footer/footer';
import { TutorialCardComponent } from '../../shared/tutorial-card/tutorial-card';
import { TUTORIALS } from '../../data/tutorials';

@Component({
  selector: 'app-tutorials',
  imports: [HeaderComponent, FooterComponent, TutorialCardComponent, MatButtonModule],
  templateUrl: './tutorials.html',
})
export class TutorialsPageComponent {
  private readonly route = inject(ActivatedRoute);

  protected readonly tag = computed(() => this.route.snapshot.queryParamMap.get('tag'));

  protected readonly tutorials = computed(() => {
    const tag = this.tag();
    if (!tag) {
      return TUTORIALS;
    }
    return TUTORIALS.filter((t) =>
      t.categories.some((c) => c.toLowerCase().replace(/\s+/g, '-') === tag),
    );
  });
}
