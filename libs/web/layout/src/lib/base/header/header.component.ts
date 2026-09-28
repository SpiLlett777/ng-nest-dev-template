import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
	selector: 'sl-header',
	imports: [RouterLink, ReactiveFormsModule],
	templateUrl: './header.component.html',
	styleUrl: './header.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {}
