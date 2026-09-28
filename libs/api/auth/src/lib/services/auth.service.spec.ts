import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaMainService } from '@sl/api/database-main';
import { AuthService } from './auth.service';

describe('AuthService', () => {
	let service: AuthService;

	const prismaMock = {
		user: {
			findUnique: jest.fn(),
			create: jest.fn(),
		},
		userSession: {
			deleteMany: jest.fn(),
			findMany: jest.fn(),
			create: jest.fn(),
			update: jest.fn(),
		},
	};

	const jwtMock = {
		signAsync: jest.fn(),
	};

	const configMock = {
		get: jest.fn(),
	};

	beforeEach(async () => {
		const moduleRef: TestingModule = await Test.createTestingModule({
			providers: [
				AuthService,
				{ provide: PrismaMainService, useValue: prismaMock },
				{ provide: JwtService, useValue: jwtMock },
				{ provide: ConfigService, useValue: configMock },
			],
		}).compile();

		service = moduleRef.get<AuthService>(AuthService);

		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
