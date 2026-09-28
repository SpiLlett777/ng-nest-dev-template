import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { jwtStrategies } from '../consts';

@Injectable()
export class JwtAccessGuard extends AuthGuard(jwtStrategies.access.name) {}
