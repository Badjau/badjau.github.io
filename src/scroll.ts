export function chapterProgress(rect: Pick<DOMRect, 'top' | 'height'>, viewportHeight: number): number {
  const travel = Math.max(rect.height - viewportHeight, 1);
  return Math.min(1, Math.max(0, -rect.top / travel));
}

export function chapterIndex(progress: number, chapterCount: number): number {
  if (chapterCount <= 1) return 0;
  return Math.min(chapterCount - 1, Math.floor(progress * chapterCount));
}
