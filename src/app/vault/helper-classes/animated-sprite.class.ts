import { TextureAtlas } from './texture-atlas.class';

export class AnimatedSprite {
  currentFrame: number;
  lastFrame: number;
  callbackOnAnimationEnd: any;
  animationId: number;

  constructor(
    public x: number = 0,
    public y: number = 0,
    public atlas: TextureAtlas,
    public sequenceName: string = '',
    public ctx: CanvasRenderingContext2D
  ) {}

  setFrameRangeAndAnimationEndCallback(data: any) {
    this.currentFrame = data.startFrame;
    this.lastFrame = data.endFrame;
    this.callbackOnAnimationEnd = data.callbackOnAnimationEnd;
    this.animationId = requestAnimationFrame(() => this.gameLoop());
  }

  gameLoop(): void {
    this.ctx.clearRect(0, 0, 516, 418);
    this.draw();

    if (this.currentFrame <= this.lastFrame) {
      this.animationId = requestAnimationFrame(() => this.gameLoop());
    } else {
      cancelAnimationFrame(this.animationId);
      this.callbackOnAnimationEnd.callback(
        this.callbackOnAnimationEnd.arg1,
        this.callbackOnAnimationEnd.arg2,
        this.callbackOnAnimationEnd.arg3
      );
    }
  }

  draw = (): void => {
    if (this.currentFrame <= this.lastFrame) {
      this.ctx.save();
      this.ctx.translate(this.x, this.y);
      this.ctx.drawImage(
        this.atlas.image,
        this.atlas.frames[this.getFrameName()].x,
        this.atlas.frames[this.getFrameName()].y,
        this.atlas.frames[this.getFrameName()].w,
        this.atlas.frames[this.getFrameName()].h,
        this.atlas.frames[this.getFrameName()].ox,
        this.atlas.frames[this.getFrameName()].oy,
        this.atlas.frames[this.getFrameName()].w,
        this.atlas.frames[this.getFrameName()].h
      );
      this.ctx.restore();
      this.currentFrame++;
    }
  }

  getFrameName = (): string => {
    let zerosBtwSequenceNameAndCurrentFrame: string;
    switch (this.currentFrame.toString().length) {
      case 1: {
        zerosBtwSequenceNameAndCurrentFrame = '000';
        break;
      }
      case 2: {
        zerosBtwSequenceNameAndCurrentFrame = '00';
        break;
      }
      case 3: {
        zerosBtwSequenceNameAndCurrentFrame = '0';
        break;
      }
      default: {
        zerosBtwSequenceNameAndCurrentFrame = '';
      }
    }

    return (
      this.sequenceName +
      zerosBtwSequenceNameAndCurrentFrame +
      this.currentFrame.toString()
    );
  }
}
