import { disconnectSeedClient, prisma } from './seed/client';
import { resetDatabase } from './seed/reset';
import { assertDevelopmentSeedAllowed } from './seed/seed-environment';
import { seedSessions } from './seed/sessions';
import { printSeedSummary } from './seed/summary';
import { seedUsers } from './seed/users';

async function main() {
	assertDevelopmentSeedAllowed();
	console.log('Resetting development database...');
	await resetDatabase(prisma);

	const accounts = await seedUsers(prisma);
	await seedSessions(prisma, accounts);
	await printSeedSummary(prisma);
}

main()
	.catch((error: unknown) => {
		console.error('Seed failed:', error);
		process.exitCode = 1;
	})
	.finally(disconnectSeedClient);
