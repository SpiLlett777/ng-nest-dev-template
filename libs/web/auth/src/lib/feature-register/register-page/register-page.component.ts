import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
	FormControl,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { authConfig } from '@sl/shared/auth';
import {
	FormInputComponent,
	LabeledCheckboxComponent,
	LabeledFormFieldWrapperComponent,
} from '@sl/web/common-ui';
import { AuthService, RegisterData } from '@sl/web/data-access/auth';
import { firstValueFrom, tap } from 'rxjs';
import { authReturnUrl } from '../../auth/auth-return-url';
import {
	validateEmail,
	validatePassword,
	validateUsername,
} from '../../validators';

@Component({
	selector: 'sl-signup-page',
	imports: [
		FormInputComponent,
		LabeledCheckboxComponent,
		LabeledFormFieldWrapperComponent,
		RouterLink,
		FormsModule,
		ReactiveFormsModule,
	],
	templateUrl: './register-page.component.html',
	styleUrl: './register-page.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterPageComponent {
	#router = inject(Router);
	readonly #route = inject(ActivatedRoute);
	#authService = inject(AuthService);

	authConfig = authConfig;

	registerForm = new FormGroup({
		username: new FormControl('', {
			nonNullable: true,
			validators: [validateUsername],
		}),
		email: new FormControl('', {
			nonNullable: true,
			validators: [validateEmail],
		}),
		password: new FormControl('', {
			nonNullable: true,
			validators: [validatePassword],
		}),
	});

	register() {
		this.registerForm.markAllAsTouched();
		this.registerForm.updateValueAndValidity();

		if (!this.registerForm.valid) return;

		const formValue = this.registerForm.value;

		const data: RegisterData = {
			username: formValue.username ?? '',
			email: formValue.email ?? '',
			password: formValue.password ?? '',
		};

		firstValueFrom(
			this.#authService.register(data).pipe(
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
