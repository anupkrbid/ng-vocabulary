import { Frame } from './frame.class';

export class TextureAtlas {

  image: HTMLImageElement = new Image();

  constructor(
    public frames: { [index: string]: Frame } = {},
    public spriteImagePath: string
  ) {
    this.loadSpriteImage();
  }

  protected loadSpriteImage = () => {

    this.image.onload = () => console.log('Image Loaded');
    this.image.onerror = () => console.error('SPRITE IMAGE LOAD ERROR', this.spriteImagePath);
    this.image.src = this.spriteImagePath;

    this.readSpriteSheet(this.frames);
  }

  protected readSpriteSheet = (frames: { [index: string]: Frame }) => {

    let tempFrame: Frame;
    const obj = frames;

    for (const frame in frames) {
      if (obj.hasOwnProperty(frame)) {
        const spriteData: any = frames[frame];

        tempFrame = new Frame(
          spriteData.frame.x,
          spriteData.frame.y,
          spriteData.frame.w,
          spriteData.frame.h,
          spriteData.spriteSourceSize.x,
          spriteData.spriteSourceSize.y
        );

        this.frames[frame] = tempFrame;
      }
    }
  }

  public containsFrame = (frameName: string): boolean => {
    if (
      this.frames[frameName] !== undefined &&
      this.frames[frameName] !== null
    ) {
      return true;
    }
    return false;
  }
}
