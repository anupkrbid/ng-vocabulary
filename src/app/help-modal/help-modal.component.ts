import { Component, Inject } from '@angular/core';

import { HelpModalOverlayRef } from './help-modal-overlay-ref.class';
import { HELP_MODAL_DIALOG_DATA } from './help-modal-overlay.tokens';

@Component({
  selector: 'app-help-modal',
  templateUrl: './help-modal.component.html',
  styleUrls: ['./help-modal.component.scss']
})
export class HelpModalComponent {

  constructor(
    public dialogRef: HelpModalOverlayRef,
    @Inject(HELP_MODAL_DIALOG_DATA) public data: any
  ) { }

}
