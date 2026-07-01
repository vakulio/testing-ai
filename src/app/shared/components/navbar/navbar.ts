import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Navbar {
  /**
   * Currently authenticated user, if any. When absent the user chip and
   * logout control are hidden so an unresolved or failed /auth/me call
   * never crashes the shell.
   */
  readonly user = input<User | null>(null);

  readonly logout = output<void>();
}
