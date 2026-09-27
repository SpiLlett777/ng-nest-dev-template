import * as bcrypt from 'bcrypt';
import { SeedPrismaClient } from './client';
import { daysAgo } from './dates';
import { SeedUserResult } from './types';
import type { PlatformRole } from '../../generated/prisma/enums';

export const SEED_PASSWORD = 'Admin123';

interface SeedUserInput {
  email: string;
  phone?: string;
  roles: PlatformRole[];
  firstName: string;
  lastName: string;
  middleName?: string;
  birthDate?: string;
  bio?: string;
  verified?: boolean;
}

const users: SeedUserInput[] = [
  // Платформенный персонал
  {
    email: 'admin@example.com',
    phone: '+79990000000',
    roles: ['SUPER_ADMIN'],
    firstName: 'Александр',
    lastName: 'Админов',
    bio: 'Суперадминистратор платформы.',
    verified: true,
  },
  {
    email: 'moderator@example.com',
    roles: ['MODERATOR'],
    firstName: 'Мария',
    lastName: 'Модератова',
    bio: 'Модерация профилей, услуг и кейсов.',
    verified: true,
  },
  {
    email: 'support@example.com',
    roles: ['SUPPORT'],
    firstName: 'Ольга',
    lastName: 'Поддержкина',
    bio: 'Первая линия поддержки участников.',
    verified: true,
  },
  {
    email: 'arbiter@example.com',
    roles: ['ARBITER'],
    firstName: 'Игорь',
    lastName: 'Арбитров',
    bio: 'Рассмотрение споров и апелляций.',
    verified: true,
  },
  {
    email: 'lawyer@example.com',
    roles: ['LAWYER'],
    firstName: 'Елена',
    lastName: 'Юристова',
    bio: 'Юридическая проверка шаблонов и прав.',
    verified: true,
  },
  {
    email: 'finance@example.com',
    roles: ['FINANCIAL_OPERATOR'],
    firstName: 'Виктор',
    lastName: 'Финансов',
    bio: 'Сверка платежей, выплаты и возвраты.',
    verified: true,
  },
  {
    email: 'content@example.com',
    roles: ['CONTENT_MANAGER'],
    firstName: 'Олег',
    lastName: 'Контентов',
    bio: 'Справочники, обучающие материалы, продвижение.',
    verified: true,
  },
  {
    email: 'fund@example.com',
    roles: ['FUND_REPRESENTATIVE'],
    firstName: 'Павел',
    lastName: 'Фондов',
    bio: 'Представитель фонда поддержки спорта.',
    verified: true,
  },

  // Продуктовые роли (без платформенных прав)
  {
    email: 'athlete@example.com',
    phone: '+79990000001',
    roles: [],
    firstName: 'Дмитрий',
    lastName: 'Спортсменов',
    birthDate: '1995-03-15',
    bio: 'Профессиональный атлет. Рекламные интеграции.',
    verified: true,
  },
  {
    email: 'athlete2@example.com',
    roles: [],
    firstName: 'Анна',
    lastName: 'Скороходова',
    birthDate: '1998-07-22',
    bio: 'Лёгкая атлетика, амбассадорство брендов.',
    verified: false,
  },
  {
    email: 'athlete3@example.com',
    roles: [],
    firstName: 'Николай',
    lastName: 'Пловцов',
    birthDate: '2000-11-02',
    bio: 'Плавание, корпоративные встречи.',
    verified: false,
  },
  {
    email: 'advertiser@example.com',
    phone: '+79990000002',
    roles: [],
    firstName: 'Сергей',
    lastName: 'Рекламов',
    bio: 'Маркетинг в спортивной одежде.',
    verified: true,
  },
  {
    email: 'advertiser2@example.com',
    roles: [],
    firstName: 'Татьяна',
    lastName: 'Брендова',
    bio: 'Напитки и спортивное питание.',
    verified: true,
  },
  {
    email: 'agent@example.com',
    roles: [],
    firstName: 'Андрей',
    lastName: 'Агентов',
    bio: 'Представление интересов спортсменов.',
    verified: true,
  },
  {
    email: 'parent@example.com',
    roles: [],
    firstName: 'Ирина',
    lastName: 'Родителева',
    bio: 'Законный представитель несовершеннолетнего спортсмена.',
    verified: false,
  },
];

export async function seedUsers(
  prisma: SeedPrismaClient,
): Promise<SeedUserResult[]> {
  const passwordHash = await bcrypt.hash(SEED_PASSWORD, 10);
  const result: SeedUserResult[] = [];

  for (const [index, data] of users.entries()) {
    const user = await prisma.user.create({
      data: {
        email: data.email,
        phone: data.phone ?? null,
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        middleName: data.middleName ?? null,
        birthDate: data.birthDate ? new Date(data.birthDate) : null,
        bio: data.bio ?? null,
        platformRoles: {
          create: data.roles.map((role) => ({
            role: role,
          })),
        },
        termsVersion: '1.0',
        privacyVersion: '1.0',
        emailVerifiedAt: data.verified ? new Date() : null,
        createdAt: daysAgo(180 - index * 7),
      },
      include: {
        platformRoles: true,
      },
    });

    result.push({
      nickname: '',
      username: '',
      userId: Number(user.id),
      email: user.email,
      roles: user.platformRoles.map((pr) => pr.role),
    });
  }

  console.log(`Users: ${result.length} (password: ${SEED_PASSWORD})`);
  return result;
}
