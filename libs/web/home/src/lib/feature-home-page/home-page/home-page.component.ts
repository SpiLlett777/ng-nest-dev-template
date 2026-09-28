import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SvgComponent } from '@sl/web/common-ui';

@Component({
	selector: 'sl-home-page',
	imports: [RouterLink, SvgComponent],
	templateUrl: './home-page.component.html',
	styleUrl: './home-page.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {}
