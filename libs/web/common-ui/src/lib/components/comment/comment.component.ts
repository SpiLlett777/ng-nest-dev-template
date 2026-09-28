import { DatePipe } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	input,
	output,
} from '@angular/core';
import { CommentItem } from '@sl/web/data-access/shared';
import { SvgComponent } from '../index';

@Component({
	selector: 'sl-comment',
	imports: [SvgComponent, DatePipe],
	templateUrl: './comment.component.html',
	styleUrl: './comment.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentComponent {
	comment = input.required<CommentItem>();
	depth = input.required<number>();
	replyRequested = output<number>();
}
