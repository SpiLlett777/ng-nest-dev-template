import { DatePipe } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	DestroyRef,
	inject,
	signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
	AbstractControl,
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { authConfig } from '@sl/shared/auth';
import { validatePassword } from '@sl/web/auth';
import { AccountSettingsStore } from '@sl/web/data-access/auth';

@Component({
	selector: 'sl-account-settings',
	standalone: true,
	imports: [ReactiveFormsModule, DatePipe, RouterLink],
	providers: [AccountSettingsStore],
	templateUrl: './account-settings.component.html',
	styleUrl: './account-settings.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountSettingsComponent {
	readonly store = inject(AccountSettingsStore);
	readonly activeSection = signal<'password' | 'sessions'>('password');
	readonly #destroyRef = inject(DestroyRef);
	readonly passwordRules = authConfig.password;
	readonly form = new FormGroup(
		{
			currentPassword: new FormControl('', {
				nonNullable: true,
				validators: [Validators.required],
			}),
			newPassword: new FormControl('', {
				nonNullable: true,
				validators: [validatePassword],
			}),
			confirmation: new FormControl('', {
				nonNullable: true,
				validators: [Validators.required],
			}),
		},
		{ validators: passwordsMatch }
	);

	constructor() {
		this.store.loadSessions();
	}

	savePassword() {
		if (this.store.busy()) return;
		this.form.markAllAsTouched();
		if (this.form.invalid) return;
		const { currentPassword, newPassword } = this.form.getRawValue();

		this.store
			.changePassword({ currentPassword, newPassword })
			.pipe(takeUntilDestroyed(this.#destroyRef))
			.subscribe({
				next: () => this.form.reset(),
				error: () => {
					/* The store exposes the error beside the form. */
				},
			});
	}
}

function passwordsMatch(control: AbstractControl) {
	return control.get('newPassword')?.value ===
		control.get('confirmation')?.value
		? null
		: { passwordMismatch: true };
}
