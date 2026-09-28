import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SvgComponent } from '@sl/web/common-ui';

@Component({
	selector: 'sl-footer',
	imports: [RouterLink, SvgComponent],
	templateUrl: './footer.component.html',
	styleUrl: './footer.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {}
