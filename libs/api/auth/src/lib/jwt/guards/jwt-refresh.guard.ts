import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { jwtStrategies } from '../consts';

@Injectable()
export class JwtRefreshGuard extends AuthGuard(jwtStrategies.refresh.name) {}
