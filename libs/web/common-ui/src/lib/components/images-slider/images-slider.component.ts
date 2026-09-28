import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SliderItemInterface } from '@sl/web/data-access/shared';
import { SvgComponent } from '../svg/svg.component';

@Component({
	selector: 'sl-images-slider',
	imports: [SvgComponent],
	templateUrl: './images-slider.component.html',
	styleUrl: './images-slider.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImagesSliderComponent {
	slides = input.required<SliderItemInterface[]>();
	showNavigation = input(true);
}
