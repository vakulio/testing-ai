import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header';
import { FooterComponent } from '../../shared/footer/footer';
import { SidebarComponent } from '../../shared/sidebar/sidebar';
import { TutorialCardComponent } from '../../shared/tutorial-card/tutorial-card';
import { TUTORIALS } from '../../data/tutorials';

@Component({
  selector: 'app-tutorials',
  imports: [HeaderComponent, FooterComponent, SidebarComponent, TutorialCardComponent],
  templateUrl: './tutorials.html',
})
export class TutorialsPageComponent {
  private readonly route = inject(ActivatedRoute);

  protected readonly tutorials = computed(() => {
    const tag = this.route.snapshot.queryParamMap.get('tag');
    if (!tag) {
      return TUTORIALS;
    }
    return TUTORIALS.filter((t) =>
      t.categories.some((c) => c.toLowerCase().replace(/\s+/g, '-') === tag),
    );
  });
}
