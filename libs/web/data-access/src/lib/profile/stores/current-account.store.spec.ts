import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { ProfileService } from '../services';
import { CurrentAccountStore } from './current-account.store';
import { ProfileSummaryDto } from '@sl/shared/profiles';
import { UserResponseDto, UserStatus } from '@sl/shared/users';
import { PlatformRole } from '@sl/api/database-main';

describe('CurrentAccountStore', () => {
  it('keeps the active profile request when the same user is authenticated again', () => {
    const profileRequest = new Subject<ProfileSummaryDto>();
    const profileService = {
      getProfileSummary: jest.fn(() => profileRequest),
    };

    TestBed.configureTestingModule({
      providers: [
        CurrentAccountStore,
        { provide: ProfileService, useValue: profileService },
      ],
    });

    const store = TestBed.inject(CurrentAccountStore);

    const user: UserResponseDto = {
      id: 'u-1',
      email: 'athlete@example.com',
      phone: '+79990000001',
      username: 'dimasport',
      firstName: 'Дмитрий',
      lastName: 'Спортсменов',
      middleName: null,
      avatarUrl: null,
      bio: 'Профессиональный атлет. Рекламные интеграции.',
      birthDate: '1995-03-15T00:00:00.000Z',
      status: UserStatus.ACTIVE,
      roles: [PlatformRole.CONTENT_MANAGER],
      emailVerifiedAt: '2026-01-10T00:00:00.000Z',
      phoneVerifiedAt: null,
      createdAt: '2026-08-01T00:00:00.000Z',
      updatedAt: '2026-08-01T00:00:00.000Z',
    };

    const profile: ProfileSummaryDto = {
      avatarUrl: '/avatars/u-1/avatar.png',
      createdAt: '2026-08-01T00:00:00.000Z',
      username: 'tikitaka',
      bio: 'Легендарная персона, сильнейший атлет',
    };

    store.authenticate(user);
    store.authenticate(user);
    profileRequest.next(profile);

    expect(profileService.getProfileSummary).toHaveBeenCalledTimes(1);
    expect(store.profile()).toEqual(profile);
    expect(store.isProfileLoading()).toBe(false);
  });
});
