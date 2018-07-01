import { TextureAtlas } from './texture-atlas.class';

export class AnimatedSprite {

  currentFrame = 0;

  constructor(
    public x: number = 0,
    public y: number = 0,
    public frameCount: number = 0,
    public atlas: TextureAtlas,
    public sequenceName: string = '',
    public ctx: CanvasRenderingContext2D
  ) { }

  draw = (): void => {

    if (++this.currentFrame > this.frameCount) {
      this.currentFrame = 1;
    }

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

    return this.sequenceName + zerosBtwSequenceNameAndCurrentFrame + this.currentFrame.toString();
  }
}
