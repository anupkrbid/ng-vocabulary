import { Frame } from './frame.class';

export class TextureAtlas {
  public frames: { [index: string]: Frame } = {};
  public taLoadComplete = false;
  public image: HTMLImageElement = new Image();
  public atlasName = '';
  private _imageFile = '';
  private _jsonFile = '';
  private _loadCallback: () => void;

  constructor(atlasName: string, loadCallback: () => void) {
    this.atlasName = atlasName;
    this._imageFile = atlasName;
    this._jsonFile = atlasName.replace('.png', '') + '.json';

    this._loadCallback = loadCallback;
    this._loadJSON();
  }

  protected _loadJSON = () => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        this.image.onload = this.onImageLoad;
        this.image.onerror = this.onImageError;
        this.image.src = this._imageFile;

        this._onRead(JSON.parse(xhr.responseText));
      } else {
        this._onError(xhr);
      }
    };
    xhr.open('GET', this._jsonFile, true);
    xhr.send();
  }

  protected _onRead = (data: any) => {
    let temp_frame: Frame;
    const obj = data.frames;
    for (const frame_name in obj) {
      if (obj.hasOwnProperty(frame_name)) {
        const sprite_data: any = data.frames[frame_name];

        temp_frame = new Frame(
          sprite_data.frame.x,
          sprite_data.frame.y,
          sprite_data.frame.w,
          sprite_data.frame.h,
          sprite_data.spriteSourceSize.x,
          sprite_data.spriteSourceSize.y
        );

        this.frames[frame_name] = temp_frame;
      }
    }
  }

  protected _onError = (xhr: XMLHttpRequest) => {
    console.log('FAILED TO LOAD ATLAS: ' + this._jsonFile);
  }

  private onImageLoad = () => {
    this.taLoadComplete = true;
    this._loadCallback();
  }

  private onImageError = () => {
    console.log('IMAGE LOAD ERROR');
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
