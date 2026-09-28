import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { SeoService } from './seo.service';
import { SEO_CONFIG } from './seo.token';

describe('SeoService', () => {
	let service: SeoService;
	let document: Document;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				SeoService,
				{
					provide: SEO_CONFIG,
					useValue: {
						siteName: 'SportLink',
						siteUrl: 'https://sport-link.ru/',
						defaultImage: '/assets/imgs/og-cover.png',
						locale: 'ru_RU',
					},
				},
			],
		});
		service = TestBed.inject(SeoService);
		document = TestBed.inject(DOCUMENT);
	});

	it('updates title, metadata and canonical URL', () => {
		service.update(
			{
				title: 'Сделки',
				description: 'Список сделок и этапов исполнения.',
				index: true,
				canonicalPath: '/deals',
			},
			'/deals?page=2'
		);

		expect(document.title).toBe('Сделки | SportLink');
		expect(
			document
				.querySelector('meta[name="description"]')
				?.getAttribute('content')
		).toBe('Список сделок и этапов исполнения.');
		expect(
			document.querySelector('meta[name="robots"]')?.getAttribute('content')
		).toBe('index, follow');
		expect(
			document.querySelector('link[rel="canonical"]')?.getAttribute('href')
		).toBe('https://sport-link.ru/deals');
		expect(
			document.querySelector('meta[property="og:url"]')?.getAttribute('content')
		).toBe('https://sport-link.ru/deals');
	});

	it('reuses an existing canonical and removes stale structured data on navigation', () => {
		document.head
			.querySelectorAll(
				'link[rel="canonical"], script[type="application/ld+json"]'
			)
			.forEach(node => node.remove());

		const canonical = document.createElement('link');
		canonical.rel = 'canonical';
		canonical.href = 'https://sport-link.ru/athletes/abc-123';
		document.head.appendChild(canonical);

		service.update(
			{
				title: 'Профиль спортсмена',
				description: 'Публичный профиль спортсмена.',
				index: true,
				structuredData: {
					'@type': 'Person',
					name: '</script>',
				},
			},
			'/athletes/abc-123'
		);

		expect(document.querySelectorAll('link[rel="canonical"]')).toHaveLength(1);
		expect(
			document.querySelectorAll('script[type="application/ld+json"]')
		).toHaveLength(1);

		service.update(
			{ title: 'Каталог', description: 'Каталог спортсменов.', index: true },
			'/catalog'
		);

		expect(
			document.querySelectorAll('script[type="application/ld+json"]')
		).toHaveLength(0);
	});
});
