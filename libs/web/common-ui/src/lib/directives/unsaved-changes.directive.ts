import { Directive, input } from '@angular/core';

/** Browser-level protection shared by editors; in-app navigation uses route guards. */
@Directive({
	selector: '[slUnsavedChanges]',
	standalone: true,
	host: { '(window:beforeunload)': 'beforeUnload($event)' },
})
export class UnsavedChangesDirective {
	readonly slUnsavedChanges = input(false);
	beforeUnload(event: BeforeUnloadEvent) {
		if (this.slUnsavedChanges()) event.preventDefault();
	}
}
