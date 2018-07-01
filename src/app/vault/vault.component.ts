import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild
} from '@angular/core';

import { AnimatedSprite } from './helper-classes/animated-sprite.class';
import { TextureAtlas } from './helper-classes/texture-atlas.class';
import { VaultService } from './vault.service';

@Component({
  selector: 'app-vault',
  templateUrl: './vault.component.html',
  styleUrls: ['./vault.component.scss']
})
export class VaultComponent implements AfterViewInit {
  @Input() width = 516;
  @Input() height = 418;
  @ViewChild('vault') canvas: ElementRef;
  ctx: CanvasRenderingContext2D;
  atlas: TextureAtlas;
  sprite: AnimatedSprite;

  constructor(private vaultService: VaultService) {}

  ngAfterViewInit() {
    // get the context
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.ctx = canvasEl.getContext('2d');

    // set the width and height
    canvasEl.width = this.width;
    canvasEl.height = this.height;

    // this.loadAndDrawImage('../../assets/image/photo_ring.jpg');

    this.atlas = new TextureAtlas(
      '../../assets/db/vault-sprite.png',
      this.gameLoop.bind(this)
    );
    this.sprite = new AnimatedSprite(
      0,
      0,
      456,
      this.atlas,
      'lock',
      this.ctx
    );
  }

  gameLoop(): void {

    requestAnimationFrame(() => this.gameLoop());

    this.ctx.clearRect(0, 0, this.width, this.height);
    this.sprite.draw();
  }

  loadAndDrawImage(url) {
    // Create an image object. This is not attached to the DOM and is not part of the page.
    const image = new Image();

    // When the image has loaded, draw it to the canvas
    image.onload = () => {
      // draw image... from (0, 0) and image size (512, 418)
      this.ctx.drawImage(image, 0, 0, 516, 418);
    };

    // Now set the source of the image that we want to load
    image.src = url;
  }
}
