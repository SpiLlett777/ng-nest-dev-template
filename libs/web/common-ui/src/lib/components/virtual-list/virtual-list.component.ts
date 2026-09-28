import { NgTemplateOutlet } from '@angular/common';
import {
	afterNextRender,
	AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	computed,
	ContentChild,
	ElementRef,
	inject,
	Injector,
	input,
	OnDestroy,
	signal,
	TemplateRef,
} from '@angular/core';

export interface VirtualListItemContext<T> {
	$implicit: T;
	index: number;
}

interface VisibleItem<T> {
	item: T;
	index: number;
}

@Component({
	selector: 'sl-virtual-list',
	imports: [NgTemplateOutlet],
	templateUrl: './virtual-list.component.html',
	styleUrl: './virtual-list.component.scss',
	host: {
		'(scroll)': 'onScroll($event)',
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VirtualListComponent<T> implements AfterViewInit, OnDestroy {
	#elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
	#injector = inject(Injector);
	#scrollTop = signal(0);
	#viewportHeight = signal(0);
	#resizeObserver?: ResizeObserver;

	items = input.required<readonly T[]>();
	itemHeight = input(32);
	overscan = input(5);

	@ContentChild(TemplateRef)
	itemTemplate: TemplateRef<VirtualListItemContext<T>> | null = null;

	totalHeight = computed(() => this.items().length * this.itemHeight());

	visibleItems = computed<VisibleItem<T>[]>(() => {
		const itemHeight = this.itemHeight();
		const overscan = this.overscan();
		const scrollTop = Math.min(
			this.#scrollTop(),
			Math.max(0, this.totalHeight() - this.#viewportHeight())
		);
		const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
		const end = Math.min(
			this.items().length,
			Math.ceil((scrollTop + this.#viewportHeight()) / itemHeight) + overscan
		);

		return this.items()
			.slice(start, end)
			.map((item, offset) => ({ item, index: start + offset }));
	});

	offset = computed(() => {
		const firstItem = this.visibleItems()[0];
		return (firstItem?.index ?? 0) * this.itemHeight();
	});

	ngAfterViewInit(): void {
		this.#resizeObserver = new ResizeObserver(([entry]) => {
			this.#viewportHeight.set(entry.contentRect.height);
		});
		this.#resizeObserver.observe(this.#elementRef.nativeElement);
	}

	ngOnDestroy(): void {
		this.#resizeObserver?.disconnect();
	}

	scrollToIndex(index: number) {
		afterNextRender(
			() => {
				if (index < 0 || index >= this.items().length) return;
				const element = this.#elementRef.nativeElement;
				const top = index * this.itemHeight();
				const bottom = top + this.itemHeight();
				if (top < element.scrollTop) element.scrollTop = top;
				else if (bottom > element.scrollTop + element.clientHeight) {
					element.scrollTop = bottom - element.clientHeight;
				}
				this.#scrollTop.set(element.scrollTop);
			},
			{ injector: this.#injector }
		);
	}

	onScroll(event: Event): void {
		const target = event.target;
		if (!(target instanceof HTMLElement)) return;
		this.#scrollTop.set(target.scrollTop);
	}
}
