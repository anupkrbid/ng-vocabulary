import {
  Injectable,
  Inject,
  OnInit,
  Injector,
  ComponentRef
} from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';

import { HelpModalComponent } from './help-modal.component';
import { HelpModalOverlayRef } from './help-modal-overlay-ref.class';
import { HELP_MODAL_DIALOG_DATA } from './help-modal-overlay.tokens';

// Each property can be overridden by the consumer
interface HelpModalDialogConfig {
  panelClass?: string;
  hasBackdrop?: boolean;
  backdropClass?: string;
  data?: any;
}

const DEFAULT_CONFIG: HelpModalDialogConfig = {
  hasBackdrop: true,
  backdropClass: 'dark-backdrop',
  panelClass: 'help-dialog-panel',
  data: {}
};

@Injectable({
  providedIn: 'root'
})
export class HelpModalService {
  // Inject overlay and injector service
  constructor(private injector: Injector, private overlay: Overlay) {}

  open(config: HelpModalDialogConfig = {}) {
    // Override default configuration
    const dialogConfig = { ...DEFAULT_CONFIG, ...config };

    // Returns an OverlayRef (which is a PortalHost)
    const overlayRef = this.createOverlay(dialogConfig);

    // Instantiate remote control
    const dialogRef = new HelpModalOverlayRef(overlayRef);

    // Subscribe to a stream that emits when the backdrop was clicked
    overlayRef.backdropClick().subscribe(() => dialogRef.close());

    const overlayComponent = this.attachDialogContainer(
      overlayRef,
      dialogConfig,
      dialogRef
    );

    // Pass the instance of the overlay component to the remote control
    dialogRef.componentInstance = overlayComponent;

    // Create ComponentPortal that can be attached to a PortalHost
    // const helpModalPortal = new ComponentPortal(HelpModalComponent);

    // Attach ComponentPortal to PortalHost
    // overlayRef.attach(helpModalPortal);

    // Return remote control
    return dialogRef;
  }

  private createInjector(
    config: HelpModalDialogConfig,
    dialogRef: HelpModalOverlayRef
  ): PortalInjector {
    // Instantiate new WeakMap for our custom injection tokens
    const injectionTokens = new WeakMap();

    // Set custom injection tokens
    injectionTokens.set(HelpModalOverlayRef, dialogRef);
    injectionTokens.set(HELP_MODAL_DIALOG_DATA, config.data);

    // Instantiate new PortalInjector
    return new PortalInjector(this.injector, injectionTokens);
  }

  private getOverlayConfig(config: HelpModalDialogConfig): OverlayConfig {
    const positionStrategy = this.overlay
      .position()
      .global()
      .centerHorizontally()
      .centerVertically();

    const overlayConfig = new OverlayConfig({
      hasBackdrop: config.hasBackdrop,
      backdropClass: config.backdropClass,
      panelClass: config.panelClass,
      // Other strategies are .noop() -> default, .reposition(), or .close()
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy
    });

    return overlayConfig;
  }

  private createOverlay(config: HelpModalDialogConfig) {
    // Returns an OverlayConfig
    const overlayConfig = this.getOverlayConfig(config);

    // Returns an OverlayRef
    return this.overlay.create(overlayConfig);
  }

  private attachDialogContainer(
    overlayRef: OverlayRef,
    config: HelpModalDialogConfig,
    dialogRef: HelpModalOverlayRef
  ) {
    const injector = this.createInjector(config, dialogRef);

    const containerPortal = new ComponentPortal(
      HelpModalComponent,
      null,
      injector
    );
    const containerRef: ComponentRef<HelpModalComponent> = overlayRef.attach(
      containerPortal
    );

    return containerRef.instance;
  }
}
