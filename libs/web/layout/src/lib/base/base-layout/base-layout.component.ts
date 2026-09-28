import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';

@Component({
	selector: 'sl-base-layout',
	imports: [RouterOutlet, HeaderComponent, FooterComponent],
	templateUrl: './base-layout.component.html',
	styleUrl: './base-layout.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseLayoutComponent {}
