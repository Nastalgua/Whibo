export type Point = {
  x: number,
  y: number
}

export type Draw = {
  ctx: CanvasRenderingContext2D,
  currentPoint: Point,
  prevPoint: Point | null,
  color: string
}

export type SharedDraw = {
  currentPoint: Point,
  prevPoint: Point | null,
  color: string
}