export interface JwtTokenPayload {
  sub: string;
  accountId: string;
  sid?: string;
}
