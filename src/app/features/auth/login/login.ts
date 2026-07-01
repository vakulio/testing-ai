import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';

/**
 * Public login page. Submits the reactive form via {@link AuthService.login}
 * and, on success, redirects to the `returnUrl` query param (bound to an
 * `input()` via `withComponentInputBinding()`) or `/products`.
 */
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  /** Bound from the `returnUrl` query param; defaults to the products page. */
  readonly returnUrl = input('/products');

  readonly submitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    username: ['emilys', Validators.required],
    password: ['emilyspass', Validators.required],
  });

  submit(): void {
    if (this.form.invalid || this.submitting()) {
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set(null);

    const { username, password } = this.form.getRawValue();
    this.auth.login(username, password).subscribe({
      next: () => {
        this.router.navigateByUrl(this.returnUrl() || '/products');
      },
      error: () => {
        this.submitting.set(false);
        this.errorMessage.set('Invalid username or password. Please try again.');
      },
    });
  }
}
