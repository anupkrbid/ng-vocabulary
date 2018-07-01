import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-vault',
  templateUrl: './vault.component.html',
  styleUrls: ['./vault.component.scss']
})
export class VaultComponent implements AfterViewInit  {

  @Input() width = 512;
  @Input() height = 418;
  @ViewChild('vault') canvas: ElementRef;
  cx: CanvasRenderingContext2D;
  constructor() { }

  ngAfterViewInit () {
    // get the context
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.cx = canvasEl.getContext('2d');

    // set the width and height
    canvasEl.width = this.width;
    canvasEl.height = this.height;

    // this.loadAndDrawImage('http://www.w3.org/html/logo/img/mark-word-icon.png');
    this.loadAndDrawImage('../../assets/image/sprite/lock0001.png');
  }

  loadAndDrawImage(url) {
      // Create an image object. This is not attached to the DOM and is not part of the page.
      const image = new Image();

      // When the image has loaded, draw it to the canvas
      image.onload = () => {
          // draw image... from (0, 0) and image size (512, 418)
          this.cx.drawImage(image, 0, 0, 512, 418);
      };

      // Now set the source of the image that we want to load
      image.src = url;
  }
  // https://webplatform.github.io/docs/concepts/programming/drawing_images_onto_canvas/
  // https://www.html5canvastutorials.com/tutorials/html5-canvas-image-size/
}
