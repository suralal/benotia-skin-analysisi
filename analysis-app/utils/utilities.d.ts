export declare const TRIANGULATION: number[];

export declare function drawMesh(
  predictions: any[],
  ctx: CanvasRenderingContext2D,
  scaleX?: number,
  scaleY?: number
): void;

export declare function drawSkinIssueDots(
  predictions: any[],
  ctx: CanvasRenderingContext2D,
  scaleX?: number,
  scaleY?: number,
  skinIssues?: any
): void;

export declare function analyzeSkin(canvas: HTMLCanvasElement): Promise<{
  acne: { score: number; severity: string };
  hyperpigmentation: { score: number; severity: string };
  overall: { score: number; grade: string };
}>;
