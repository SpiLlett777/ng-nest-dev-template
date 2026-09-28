import { ViewportScroller } from '@angular/common';
import { afterNextRender, Directive, inject, input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

/** Resolves a route fragment when its asynchronously loaded target appears. */
@Directive({
	selector: '[slRouteAnchor]',
	standalone: true,
	host: { '[id]': 'slRouteAnchor()' },
})
export class RouteAnchorDirective {
	readonly slRouteAnchor = input.required<string>();
	readonly #route = inject(ActivatedRoute);
	readonly #router = inject(Router);
	readonly #viewport = inject(ViewportScroller);

	constructor() {
		afterNextRender(() => {
			if (this.#router.lastSuccessfulNavigation()?.trigger === 'popstate')
				return;
			const anchor = this.slRouteAnchor();
			if (this.#route.snapshot.fragment === anchor) {
				this.#viewport.scrollToAnchor(anchor);
			}
		});
	}
}
