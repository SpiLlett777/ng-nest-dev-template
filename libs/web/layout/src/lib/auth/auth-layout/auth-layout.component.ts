import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../../base/footer/footer.component';
import { HeaderComponent } from '../../base/header/header.component';

@Component({
	selector: 'sl-auth-layout',
	imports: [RouterOutlet, HeaderComponent, FooterComponent],
	templateUrl: './auth-layout.component.html',
	styleUrl: './auth-layout.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthLayoutComponent {}
