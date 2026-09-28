import { UserRoleType } from '@sl/shared/users';

export interface AccessPayload {
  userId: string;
  profileId: string;
  role: UserRoleType;
}

export interface AccessRequest extends Request {
  user: AccessPayload;
}

export interface OptionalAccessRequest extends Request {
  user?: AccessPayload;
}
