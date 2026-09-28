import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

@Injectable()
export class PrismaMainService
	extends PrismaClient
	implements OnModuleInit, OnModuleDestroy
{
	constructor(private readonly config: ConfigService) {
		const connectionString = config.get<string>('MAIN_DATABASE_URL');

		if (!connectionString) throw new Error('MAIN_DATABASE_URL is not defined');

		const adapter = new PrismaPg({ connectionString });
		super({ adapter });
	}

	async onModuleInit() {
		await this.$connect();
	}

	async onModuleDestroy() {
		await this.$disconnect();
	}
}
