import { Request } from 'express';

export interface RefreshPayload {
  userId: string;
  accountId: string;
  sessionId: string;
}

export interface RefreshRequest extends Request {
  user: RefreshPayload;
}
