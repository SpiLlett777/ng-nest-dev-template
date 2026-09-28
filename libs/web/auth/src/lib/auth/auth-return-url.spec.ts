import { authReturnUrl } from './auth-return-url';

describe('Authentication return URL', () => {
	it('preserves an internal deal route and its query', () => {
		expect(authReturnUrl('/deals/123?tab=contract')).toBe(
			'/deals/123?tab=contract'
		);
	});

	it('preserves an internal catalog route', () => {
		expect(authReturnUrl('/catalog?discipline=swimming')).toBe(
			'/catalog?discipline=swimming'
		);
	});

	it('preserves a public athlete profile route', () => {
		expect(authReturnUrl('/athletes/abc-123')).toBe('/athletes/abc-123');
	});

	it('rejects external destinations', () => {
		for (const value of [
			null,
			'https://example.org',
			'//example.org',
			'/\\example.org',
		])
			expect(authReturnUrl(value)).toBe('/');
	});
});
