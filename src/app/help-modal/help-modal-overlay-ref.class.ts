import { OverlayRef } from '@angular/cdk/overlay';

export class HelpModalOverlayRef {

  constructor(private overlayRef: OverlayRef) { }

  close(): void {
    this.overlayRef.dispose();
  }
}
