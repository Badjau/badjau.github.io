import type { Project } from './library';
import type { KeyboardScene } from './three-scene';

export function mediaMarkup(project: Project): string {
  if (project.model) return `<section class="project-media" aria-labelledby="model-title">
    <h2 id="model-title">Take a closer look at the shape.</h2>
    <p>Explore the modeled left-hand enclosure. Rotate it to see how the curved key wells, thumb area, and shell meet.</p>
    <div class="model-stage">
      <canvas class="model-canvas" tabindex="0" role="img" aria-label="Interactive Mk1 enclosure. Drag or use the arrow keys to rotate; press Home to reset." hidden></canvas>
      <div class="model-placeholder"><span class="eyebrow">Interactive model</span><p>The shape, from another angle.</p><button class="media-button model-load" type="button">Explore in 3D</button></div>
    </div>
    <p class="media-status" role="status" aria-live="polite">The viewer loads when you open it.</p>
    <div class="model-controls" role="group" aria-label="Model controls" hidden>
      <button type="button" class="media-button" data-rotate="left" aria-label="Rotate model left">&#8592;</button>
      <button type="button" class="media-button" data-rotate="right" aria-label="Rotate model right">&#8594;</button>
      <button type="button" class="media-button" data-rotate="up" aria-label="Tilt model up">&#8593;</button>
      <button type="button" class="media-button" data-rotate="down" aria-label="Tilt model down">&#8595;</button>
      <button type="button" class="media-button model-reset">Reset view</button>
      <button type="button" class="media-button model-close">Close viewer</button>
    </div>
  </section>`;
  if (project.animation) return `<section class="project-media" aria-labelledby="oled-title">
    <h2 id="oled-title">A little life on the display.</h2>
    <figure class="oled-demo">
      <div class="oled-stage"><p class="oled-placeholder">See the raven react to typing.</p><img class="oled-animation" data-source="${project.animation.source}" alt="${project.animation.alt}" hidden loading="lazy" /></div>
      <figcaption>${project.animation.caption}</figcaption>
    </figure>
    <button class="media-button oled-toggle" type="button" aria-pressed="false">Play OLED animation</button>
    <p class="media-status" role="status" aria-live="polite">Play to load the original GIF.</p>
  </section>`;
  return '';
}

export function mountProjectMedia(project?: Project): () => void {
  let disposed = false;
  let scene: KeyboardScene | undefined;
  const status = document.querySelector<HTMLElement>('.project-media .media-status');
  const loadButton = document.querySelector<HTMLButtonElement>('.model-load');
  const canvas = document.querySelector<HTMLCanvasElement>('.model-canvas');
  const stage = document.querySelector<HTMLElement>('.model-stage');
  const placeholder = document.querySelector<HTMLElement>('.model-placeholder');
  const controls = document.querySelector<HTMLElement>('.model-controls');
  let loading = false;

  const close = () => {
    scene?.dispose();
    scene = undefined;
    if (canvas) canvas.hidden = true;
    if (placeholder) placeholder.hidden = false;
    if (controls) controls.hidden = true;
    if (loadButton) { loadButton.disabled = false; loadButton.textContent = 'Explore in 3D'; }
    loading = false;
  };
  loadButton?.addEventListener('click', async () => {
    if (loading || !project?.model || !canvas || !stage) return;
    loading = true;
    loadButton.disabled = true;
    loadButton.textContent = 'Loading model…';
    status!.textContent = 'Loading the interactive enclosure.';
    try {
      const { KeyboardScene } = await import('./three-scene');
      if (disposed) return;
      canvas.hidden = false;
      scene = new KeyboardScene(canvas, stage, {
        reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        onReady: () => {
          if (disposed) return;
          placeholder!.hidden = true;
          controls!.hidden = false;
          status!.textContent = 'Drag or use the arrow keys to rotate. Home resets the view.';
          canvas.focus({ preventScroll: true });
        },
        onError: () => {
          if (disposed) return;
          close();
          status!.textContent = 'The 3D view could not load. You can retry or explore the project photos.';
        },
      });
      scene.setPose({ rotation: [-0.2, -0.48, -0.08], position: [0, 0, 0], scale: 1 }, true);
      await scene.load(project.model);
    } catch {
      if (!disposed) {
        close();
        status!.textContent = 'The 3D view is unavailable in this browser. The project photos remain available.';
      }
    }
  });

  const rotate = (direction: string) => {
    const [yaw, pitch] = direction === 'left' ? [-0.35, 0] : direction === 'right' ? [0.35, 0] : direction === 'up' ? [0, -0.2] : [0, 0.2];
    scene?.rotate(yaw, pitch);
  };
  document.querySelectorAll<HTMLButtonElement>('[data-rotate]').forEach(button => button.addEventListener('click', () => rotate(button.dataset.rotate!)));
  document.querySelector('.model-reset')?.addEventListener('click', () => scene?.resetRotation());
  document.querySelector('.model-close')?.addEventListener('click', () => {
    close();
    status!.textContent = 'Viewer closed. Open it again to explore the model.';
    loadButton?.focus({ preventScroll: true });
  });
  canvas?.addEventListener('keydown', event => {
    const direction = ({ ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down' } as Record<string, string>)[event.key];
    if (direction) { event.preventDefault(); rotate(direction); }
    if (event.key === 'Home') { event.preventDefault(); scene?.resetRotation(); }
  });

  const toggle = document.querySelector<HTMLButtonElement>('.oled-toggle');
  const gif = document.querySelector<HTMLImageElement>('.oled-animation');
  toggle?.addEventListener('click', () => {
    if (!gif) return;
    const playing = toggle.getAttribute('aria-pressed') !== 'true';
    toggle.setAttribute('aria-pressed', String(playing));
    toggle.textContent = playing ? 'Stop OLED animation' : 'Play OLED animation';
    gif.hidden = !playing;
    document.querySelector<HTMLElement>('.oled-placeholder')!.hidden = playing;
    if (playing) {
      status!.textContent = 'Loading OLED animation.';
      gif.onload = () => { if (!disposed && !gif.hidden) status!.textContent = 'OLED animation playing.'; };
      gif.onerror = () => { if (!disposed) status!.textContent = 'The animation could not load. Stop and play to retry.'; };
      gif.src = gif.dataset.source!;
    } else {
      gif.removeAttribute('src');
      status!.textContent = 'OLED animation stopped.';
    }
  });
  return () => {
    disposed = true;
    scene?.dispose();
    if (gif) { gif.onload = null; gif.onerror = null; gif.removeAttribute('src'); }
  };
}
