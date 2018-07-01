import { TextureAtlas } from './texture-atlas.class';

export class AnimatedSprite {
  public x = 0;
  public y = 0;
  public frameCount = 0;
  public atlas: TextureAtlas;
  public sequenceName = '';
  public ctx: CanvasRenderingContext2D;
  public currentFrame = 0;

  constructor(
    x: number,
    y: number,
    frame_count: number,
    atlas: TextureAtlas,
    sequence_name: string,
    ctx: CanvasRenderingContext2D
  ) {
    this.x = x;
    this.y = y;
    this.frameCount = frame_count;
    this.atlas = atlas;
    this.sequenceName = sequence_name;
    this.ctx = ctx;
  }

  public draw = (): void => {

    // this.currentFrame++;
    if (++this.currentFrame > this.frameCount) {
      this.currentFrame = 1;
    }

    this.ctx.save();
    this.ctx.translate(this.x, this.y);
    this.ctx.drawImage(
      this.atlas.image,
      this.atlas.frames[this.getFrameString()].x,
      this.atlas.frames[this.getFrameString()].y,
      this.atlas.frames[this.getFrameString()].w,
      this.atlas.frames[this.getFrameString()].h,
      this.atlas.frames[this.getFrameString()].ox,
      this.atlas.frames[this.getFrameString()].oy,
      this.atlas.frames[this.getFrameString()].w,
      this.atlas.frames[this.getFrameString()].h
    );
    this.ctx.restore();
  }

  public getFrameString = (): string => {

    let str: string;
    switch (this.currentFrame.toString().length) {
      case 1: {
        str = '000';
        break;
      }
      case 2: {
        str = '00';
        break;
      }
      case 3: {
        str = '0';
        break;
      }
      default: {
        str = '';
      }
    }

    return this.sequenceName + str + this.currentFrame.toString();
  }
}
