import { INestApplication } from '@nestjs/common';
import { setupFilters } from './setup-filters';
import { setupPipes } from './setup-pipes';
import { setupSwagger } from './setup-swagger';

export function setupApp(app: INestApplication) {
	setupFilters(app);
	setupSwagger(app);
	setupPipes(app);
}
