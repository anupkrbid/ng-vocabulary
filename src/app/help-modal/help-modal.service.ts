import { Injectable } from '@angular/core';
import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';

import { HelpModalComponent } from './help-modal.component';

// Each property can be overridden by the consumer
interface HelpDialogConfig {
  panelClass?: string;
  hasBackdrop?: boolean;
  backdropClass?: string;
}

const DEFAULT_CONFIG: HelpDialogConfig = {
  hasBackdrop: true,
  backdropClass: 'dark-backdrop',
  panelClass: 'help-dialog-panel'
};

@Injectable({
  providedIn: 'root'
})
export class HelpModalService {

  // Inject overlay service
  constructor(private overlay: Overlay) { }

  open(config: HelpDialogConfig = {}) {

    // Override default configuration
    const dialogConfig = { ...DEFAULT_CONFIG, ...config };

    // Returns an OverlayRef (which is a PortalHost)
    const overlayRef = this.createOverlay(dialogConfig);

    // Create ComponentPortal that can be attached to a PortalHost
    const helpModalPortal = new ComponentPortal(HelpModalComponent);

    // Attach ComponentPortal to PortalHost
    overlayRef.attach(helpModalPortal);
  }

  private getOverlayConfig(config: HelpDialogConfig): OverlayConfig {
    const positionStrategy = this.overlay.position()
      .global()
      .centerHorizontally()
      .centerVertically();

    const overlayConfig = new OverlayConfig({
      hasBackdrop: config.hasBackdrop,
      backdropClass: config.backdropClass,
      panelClass: config.panelClass,
      // Other strategies are .noop(), .reposition(), or .close()
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy
    });

    return overlayConfig;
  }

  private createOverlay(config: HelpDialogConfig) {
    // Returns an OverlayConfig
    const overlayConfig = this.getOverlayConfig(config);

    // Returns an OverlayRef
    return this.overlay.create(overlayConfig);
  }
}
