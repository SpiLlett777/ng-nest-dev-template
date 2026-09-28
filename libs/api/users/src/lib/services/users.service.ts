import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaMainService } from '@sl/api/database-main';
import { UserResponseDto } from '@sl/shared/users';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaMainService) {}

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId.toString() },
      include: {
        platformRoles: true,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    const result: UserResponseDto = {
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      birthDate: user.birthDate?.toDateString() ?? null,
      createdAt: user.createdAt.toDateString(),
      emailVerifiedAt: user.emailVerifiedAt?.toDateString() ?? null,
      firstName: user.firstName,
      lastName: user.lastName,
      middleName: user.middleName,
      phone: user.phone,
      phoneVerifiedAt: user.phoneVerifiedAt?.toDateString() ?? null,
      updatedAt: '',
      id: user.id,
      email: user.email,
      username: user.username,
      roles: user.platformRoles.map((pr) => pr.role),
      status: user.status,
    };

    return result;
  }

  getUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        status: true,
      },
    });
  }
}
