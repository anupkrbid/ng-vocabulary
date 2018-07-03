export class Frame {

  constructor(
    public x: number = 0,
    public y: number = 0,
    public w: number = 1,
    public h: number = 1,
    public ox: number = 0, // offset x
    public oy: number = 0 // offset y
  ) {}

  set(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
