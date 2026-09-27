import { UserStatus } from '../models/user-access';
import { PlatformRole } from '@sl/api/database-main';

export interface UserResponseDto {
  id: string;
  email: string;
  phone: string | null;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  birthDate: string | null;
  status: UserStatus;
  roles: PlatformRole[];
  emailVerifiedAt: string | null;
  phoneVerifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
