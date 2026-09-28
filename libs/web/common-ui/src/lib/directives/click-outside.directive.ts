import {
	Directive,
	ElementRef,
	HostListener,
	inject,
	output,
} from '@angular/core';

@Directive({
	selector: '[slClickOutside]',
})
export class ClickOutsideDirective {
	#elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

	slClickOutside = output<void>();

	@HostListener('document:pointerdown', ['$event.target'])
	onDocumentPointerDown(target: EventTarget | null) {
		if (!(target instanceof Node)) return;
		if (this.#elementRef.nativeElement.contains(target)) return;
		this.slClickOutside.emit();
	}
}
