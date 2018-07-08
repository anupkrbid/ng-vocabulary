import { Component, Inject, EventEmitter } from '@angular/core';

import { HelpModalOverlayRef } from './help-modal-overlay-ref.class';
import { HELP_MODAL_DIALOG_DATA } from './help-modal-overlay.tokens';
import {
  trigger,
  state,
  style,
  transition,
  animate,
  AnimationEvent
} from '@angular/animations';

// Reusable animation timings
const ANIMATION_TIMINGS = '400ms cubic-bezier(0.25, 0.8, 0.25, 1)';

@Component({
  selector: 'app-help-modal',
  templateUrl: './help-modal.component.html',
  styleUrls: ['./help-modal.component.scss'],
  animations: [
    trigger('fade', [
      state('fadeOut', style({ opacity: 0 })),
      state('fadeIn', style({ opacity: 1 })),
      transition('* => fadeIn', animate(ANIMATION_TIMINGS))
    ]),
    trigger('slideContent', [
      state(
        'void',
        style({ transform: 'translate3d(0, 25%, 0) scale(0.9)', opacity: 0 })
      ),
      state('enter', style({ transform: 'none', opacity: 1 })),
      state(
        'leave',
        style({ transform: 'translate3d(0, 25%, 0)', opacity: 0 })
      ),
      transition('* => *', animate(ANIMATION_TIMINGS))
    ])
  ]
})
export class HelpModalComponent {

  animationState: 'void' | 'enter' | 'leave' = 'enter';
  animationStateChanged = new EventEmitter<AnimationEvent>();

  constructor(
    public dialogRef: HelpModalOverlayRef,
    @Inject(HELP_MODAL_DIALOG_DATA) public data: any
  ) {}

  onAnimationStart(event: AnimationEvent) {
    this.animationStateChanged.emit(event);
  }

  onAnimationDone(event: AnimationEvent) {
    this.animationStateChanged.emit(event);
  }

  startExitAnimation() {
    this.animationState = 'leave';
  }

  closeModal() {
    this.dialogRef.close();
  }
}
