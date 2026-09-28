import {
	ChangeDetectionStrategy,
	Component,
	DestroyRef,
	inject,
	signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SuccessToastComponent, ToastService } from '@sl/web/common-ui';
import {
	CurrentAccountStore,
	ProfileService,
} from '@sl/web/data-access/profile';
import { finalize } from 'rxjs';

@Component({
	selector: 'sl-profile-page-edit',
	imports: [ReactiveFormsModule, RouterLink],
	templateUrl: './profile-page-edit.component.html',
	styleUrl: './profile-page-edit.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePageEditComponent {
	#profileService = inject(ProfileService);
	#currentAccountStore = inject(CurrentAccountStore);
	#toastService = inject(ToastService);
	#router = inject(Router);
	#route = inject(ActivatedRoute);
	#destroyRef = inject(DestroyRef);

	readonly isLoading = signal(true);
	readonly isSaving = signal(false);
	readonly statusMessage = signal<string | null>(null);
	readonly form = new FormGroup({
		username: new FormControl('', {
			nonNullable: true,
			validators: [
				Validators.required,
				Validators.minLength(2),
				Validators.maxLength(128),
			],
		}),
		firstName: new FormControl('', { nonNullable: true }),
		bio: new FormControl('', { nonNullable: true }),
	});

	constructor() {
		this.#profileService
			.getMyAccount()
			.pipe(
				finalize(() => this.isLoading.set(false)),
				takeUntilDestroyed(this.#destroyRef)
			)
			.subscribe({
				next: account => {
					this.form.patchValue({
						username: account.username ?? '',
						firstName: account.firstName ?? '',
						bio: account.bio ?? '',
					});
				},
				error: () => this.statusMessage.set('Не удалось загрузить профиль.'),
			});
	}

	save() {
		if (this.form.invalid || this.isSaving()) {
			this.form.markAllAsTouched();
			return;
		}

		const value = this.form.getRawValue();
		this.isSaving.set(true);
		this.statusMessage.set(null);
		this.#profileService
			.updateMyAccount({
				username: value.username.trim() || null,
				firstName: value.firstName.trim() || null,
				bio: value.bio.trim() || null,
				id: '',
				email: '',
				phone: null,
				lastName: null,
				middleName: null,
				avatarUrl: null,
				birthDate: null,
				status: 'ACTIVE',
				roles: [],
				emailVerifiedAt: null,
				phoneVerifiedAt: null,
				createdAt: '',
				updatedAt: '',
			})
			.pipe(
				finalize(() => this.isSaving.set(false)),
				takeUntilDestroyed(this.#destroyRef)
			)
			.subscribe({
				next: account => {
					this.#currentAccountStore.updateProfile({
						username: account.username ?? null,
						bio: account.bio ?? null,
					});
					this.#toastService.show(SuccessToastComponent, {
						message: 'Изменения профиля сохранены',
					});
					void this.#router.navigate([''], {
						relativeTo: this.#route,
					});
				},
				error: () => this.statusMessage.set('Не удалось сохранить профиль.'),
			});
	}
}
