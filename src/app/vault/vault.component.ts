import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { map, take, retry } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { AnimatedSprite } from './helper-classes/animated-sprite.class';
import { Frame } from './helper-classes/frame.class';
import { TextureAtlas } from './helper-classes/texture-atlas.class';
import { VaultService } from './vault.service';

@Component({
  selector: 'app-vault',
  templateUrl: './vault.component.html',
  styleUrls: ['./vault.component.scss']
})
export class VaultComponent implements AfterViewInit, OnDestroy {

  @Input() width = 516;
  @Input() height = 418;
  @ViewChild('vault') canvas: ElementRef;
  ctx: CanvasRenderingContext2D;
  atlas: TextureAtlas;
  sprite: AnimatedSprite;
  animationSubscription: Subscription;

  constructor(private vaultService: VaultService) {}

  ngAfterViewInit() {
    // get the context
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.ctx = canvasEl.getContext('2d');

    // set the width and height
    canvasEl.width = this.width;
    canvasEl.height = this.height;

    // initial vault image after canvas load
    this.loadAndDrawImage('../../assets/image/lock0001.png');

    this.vaultService
      .getVaultSpriteSheet()
      .pipe(
        take(1),
        retry(3),
        map(data => data.frames)
      )
      .subscribe((frames: { [index: string]: Frame }) => {
        const striteImagepath = '../../assets/image/vault-sprite.png';
        this.atlas = new TextureAtlas(frames, striteImagepath);
        this.sprite = new AnimatedSprite(0, 0, this.atlas, 'lock', this.ctx);
      });

    this.animationSubscription =
      this.vaultService.executeAnimation
        .subscribe(
          data => this.sprite.setFrameRangeAndAnimationEndCallback(data)
        );
  }

  loadAndDrawImage(url) {
    // Create an image object. This is not attached to the DOM and is not part of the page.
    const image: HTMLImageElement = new Image();

    // When the image has loaded, draw it to the canvas
    image.onload = () => {
      // draw image... from (0, 0) and image size (512, 418)
      this.ctx.drawImage(image, 0, 0, 516, 418);
    };

    // Now set the source of the image that we want to load
    image.src = url;
  }

  ngOnDestroy() {
    this.animationSubscription.unsubscribe();
  }
}
