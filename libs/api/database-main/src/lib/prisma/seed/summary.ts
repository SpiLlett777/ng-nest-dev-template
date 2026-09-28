import { SeedPrismaClient } from './client';
import { SEED_PASSWORD } from './users';

export async function printSeedSummary(prisma: SeedPrismaClient) {
	const [users, sessions] = await Promise.all([
		prisma.user.count(),
		prisma.userSession.count(),
	]);

	console.table({
		users,
		sessions,
	});
	console.log('\nDemo credentials:');
	console.log(`  admin@example.com / ${SEED_PASSWORD}`);
	console.log(`  user@example.com / ${SEED_PASSWORD}`);
}
