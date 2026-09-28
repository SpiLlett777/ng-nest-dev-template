import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ProfileSummaryDto } from '@sl/shared/profiles';
import { UserResponseDto } from '@sl/shared/users';
import { API_CONFIG } from '../../shared';

@Injectable({
	providedIn: 'root',
})
export class ProfileService {
	#http = inject(HttpClient);
	#apiConfig = inject(API_CONFIG);

	getProfileSummary(userId?: number) {
		const path =
			userId === undefined
				? 'accounts/me/summary'
				: `accounts/profiles/${userId}`;
		return this.#http.get<ProfileSummaryDto>(
			`${this.#apiConfig.baseUrl}${path}`
		);
	}

	getMyAccount() {
		return this.#http.get<UserResponseDto>(
			`${this.#apiConfig.baseUrl}accounts/me`
		);
	}

	updateMyAccount(account: UserResponseDto) {
		return this.#http.patch<UserResponseDto>(
			`${this.#apiConfig.baseUrl}accounts/me`,
			account
		);
	}

	uploadAvatar(file: File) {
		const body = new FormData();
		body.append('file', file);
		return this.#http.post<{
			avatarUrl: string;
		}>(`${this.#apiConfig.baseUrl}accounts/me/avatar`, body);
	}

	removeAvatar() {
		return this.#http.delete<{
			avatarUrl: null;
		}>(`${this.#apiConfig.baseUrl}accounts/me/avatar`);
	}
}
