export interface GetSessionsDto {
  sessions: {
    id: string;
    isCurrent?: boolean;
    userAgent: string | null;
    ip: string | null;
    createdAt: string;
    lastUsedAt: string;
    expiresAt: string;
  }[];
}
