import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ModalHostComponent, ToastHostComponent } from '@sl/web/common-ui';
import { NavigationManagerComponent } from '@sl/web/shared';

@Component({
	selector: 'app-root',
	imports: [
		RouterOutlet,
		NavigationManagerComponent,
		ModalHostComponent,
		ToastHostComponent,
	],
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
