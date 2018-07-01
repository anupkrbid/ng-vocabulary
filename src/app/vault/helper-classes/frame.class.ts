export class Frame {
  x: number;
  y: number;
  w: number;
  h: number;

  ox: number; // OFFSET X
  oy: number; // OFFSET Y

  constructor(
    x: number = 0,
    y: number = 0,
    w: number = 1,
    h: number = 1,
    ox: number = 0,
    oy: number = 0
  ) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.ox = ox;
    this.oy = oy;
  }

  set(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
