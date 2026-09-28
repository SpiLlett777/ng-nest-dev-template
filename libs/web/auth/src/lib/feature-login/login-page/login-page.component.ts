import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { authConfig } from '@sl/shared/auth';
import {
	FormInputComponent,
	LabeledCheckboxComponent,
	LabeledFormFieldWrapperComponent,
} from '@sl/web/common-ui';
import { AuthService, LoginData } from '@sl/web/data-access/auth';
import { firstValueFrom, tap } from 'rxjs';
import { authReturnUrl } from '../../auth/auth-return-url';
import { validateEmail } from '../../validators';

@Component({
	selector: 'sl-login-page',
	imports: [
		FormInputComponent,
		LabeledFormFieldWrapperComponent,
		LabeledCheckboxComponent,
		RouterLink,
		ReactiveFormsModule,
	],
	templateUrl: './login-page.component.html',
	styleUrl: './login-page.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent {
	#router = inject(Router);
	readonly #route = inject(ActivatedRoute);
	#authService = inject(AuthService);

	authConfig = authConfig;

	loginForm = new FormGroup({
		email: new FormControl<string | null>('', {
			validators: [validateEmail],
		}),
		password: new FormControl<string | null>('', {
			validators: [Validators.required],
		}),
	});

	login() {
		this.loginForm.markAsTouched();
		this.loginForm.updateValueAndValidity();

		if (!this.loginForm.valid) return;

		const formValue = this.loginForm.value;

		const data: LoginData = {
			email: formValue.email ?? '',
			password: formValue.password ?? '',
		};

		firstValueFrom(
			this.#authService.login(data).pipe(
				tap(res => {
					if (!res) return;

					this.#router
						.navigateByUrl(
							authReturnUrl(this.#route.snapshot.queryParamMap.get('returnUrl'))
						)
						.then();
				})
			)
		).then();
	}
}
