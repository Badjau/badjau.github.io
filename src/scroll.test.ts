import { describe, expect, it } from 'vitest';
import { chapterIndex, chapterProgress } from './scroll';

describe('scroll mapping', () => {
  it('clamps story progress', () => {
    expect(chapterProgress({ top: 100, height: 4000 }, 1000)).toBe(0);
    expect(chapterProgress({ top: -1500, height: 4000 }, 1000)).toBe(0.5);
    expect(chapterProgress({ top: -4000, height: 4000 }, 1000)).toBe(1);
  });

  it('maps the final position to the final chapter', () => {
    expect(chapterIndex(0, 4)).toBe(0);
    expect(chapterIndex(0.51, 4)).toBe(2);
    expect(chapterIndex(1, 4)).toBe(3);
  });
});
