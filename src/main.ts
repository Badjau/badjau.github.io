import gsap from 'gsap';
import './style.css';
import { keyboardProject } from './project';
import type { KeyboardScene } from './three-scene';

const project = keyboardProject;
const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('App root is missing.');

app.innerHTML = `
  <header class="site-header" aria-label="Primary navigation">
    <a class="wordmark" href="#top" aria-label="Badjau, back to title">B<span>—</span>J</a>
    <a class="header-link" href="https://github.com/Badjau" target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a>
  </header>

  <main id="top" class="experience">
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero-grid" aria-hidden="true"></div>
      <div class="hero-orbit hero-orbit--one" aria-hidden="true"></div>
      <div class="hero-orbit hero-orbit--two" aria-hidden="true"></div>
      <p class="hero-kicker reveal">Independent maker · developer</p>
      <h1 id="hero-title" class="hero-title reveal">Badjau</h1>
      <div class="hero-bottom reveal">
        <p>I make things I actually use,<br />across software, electronics, and 3D fabrication.</p>
        <a class="scroll-cue" href="#project-story"><span>Selected project</span><span class="scroll-cue__line" aria-hidden="true"></span><span>Scroll</span></a>
      </div>
    </section>

    <section id="project-story" class="project" aria-labelledby="project-title" aria-hidden="true">
      <div class="story">
        <div class="model-stage" aria-label="Interactive 3D model of the left TBK-Micro Mk1 keyboard split">
          <img class="model-fallback" src="${project.model.fallbackImage}" alt="Finished TBK-Micro Mk1 split ergonomic keyboard" />
          <canvas class="model-canvas" aria-hidden="true"></canvas>
          <div class="model-status" role="status">Loading model <span></span></div>
          <p class="drag-hint"><span aria-hidden="true">↔</span> Drag to explore</p>
          <p class="model-index" aria-hidden="true"><span>01</span> / 04</p>
        </div>

        <div class="project-copy">
          <header class="project-intro">
            <div><p class="eyebrow">${project.eyebrow}</p><h2 id="project-title">${project.title}</h2></div>
            <p>${project.subtitle}</p>
          </header>
          <div class="chapters" aria-live="polite">
            ${project.chapters.map((chapter, index) => `
              <article class="chapter${index === 0 ? ' is-active' : ''}" data-chapter="${index}" id="${chapter.id}" aria-hidden="${index !== 0}">
                <div class="chapter-rule" aria-hidden="true"></div>
                <div class="chapter-meta"><span>${chapter.index}</span><span>${chapter.label}</span></div>
                <h3>${chapter.title}</h3>
                <p class="chapter-body">${chapter.body}</p>
                <p class="chapter-detail">${chapter.detail}</p>
              </article>
            `).join('')}
          </div>
          <nav class="project-nav" aria-label="Project chapters">
            <button class="chapter-button chapter-button--prev" type="button" aria-label="Previous chapter">←</button>
            <p><span class="current-chapter">01</span> / 04</p>
            <button class="chapter-button chapter-button--next" type="button" aria-label="Next chapter">→</button>
            <a class="project-link" href="${project.repositoryUrl}" target="_blank" rel="noreferrer">View on GitHub ↗</a>
          </nav>
        </div>
      </div>
    </section>
  </main>
`;

const hero = document.querySelector<HTMLElement>('.hero');
const projectView = document.querySelector<HTMLElement>('.project');
const canvas = document.querySelector<HTMLCanvasElement>('.model-canvas');
const stage = document.querySelector<HTMLElement>('.model-stage');
const status = document.querySelector<HTMLElement>('.model-status');
const indexLabel = document.querySelector<HTMLElement>('.model-index span');
const currentChapter = document.querySelector<HTMLElement>('.current-chapter');
const chapters = [...document.querySelectorAll<HTMLElement>('.chapter')];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!hero || !projectView || !canvas || !stage || !status || !indexLabel || !currentChapter) {
  throw new Error('Project experience markup is incomplete.');
}

let scene: KeyboardScene | undefined;
let activeChapter = 0;
let projectIsOpen = false;
let inputLocked = false;
let wheelDistance = 0;
let touchStartY = 0;

async function initializeScene(): Promise<void> {
  try {
    const { KeyboardScene: KeyboardSceneConstructor } = await import('./three-scene');
    scene = new KeyboardSceneConstructor(canvas!, stage!, {
      reducedMotion,
      onReady: () => {
        stage!.classList.add('is-ready');
        status!.textContent = '3D model ready';
        window.setTimeout(() => status!.setAttribute('hidden', ''), 500);
      },
      onError: () => {
        stage!.classList.add('has-fallback');
        status!.textContent = 'Showing project image';
      },
    });
    scene.setPose(project.chapters[activeChapter].pose, true);
    await scene.load(project.model.source);
  } catch {
    stage!.classList.add('has-fallback');
    status!.textContent = 'Showing project image';
  }
}

if ('requestIdleCallback' in window) {
  window.requestIdleCallback(() => initializeScene(), { timeout: 900 });
} else {
  globalThis.setTimeout(() => initializeScene(), 180);
}

function lockInput(): void {
  inputLocked = true;
  window.setTimeout(() => { inputLocked = false; }, reducedMotion ? 40 : 760);
}

function showProject(open: boolean): void {
  if (projectIsOpen === open) return;
  projectIsOpen = open;
  document.body.classList.toggle('show-project', open);
  hero!.setAttribute('aria-hidden', String(open));
  projectView!.setAttribute('aria-hidden', String(!open));
  history.replaceState(null, '', open ? '#project-story' : '#top');
  lockInput();
}

function activateChapter(index: number): void {
  const nextIndex = Math.max(0, Math.min(project.chapters.length - 1, index));
  if (nextIndex === activeChapter) return;
  activeChapter = nextIndex;
  chapters.forEach((chapter, chapterIndex) => {
    const active = chapterIndex === activeChapter;
    chapter.classList.toggle('is-active', active);
    chapter.setAttribute('aria-hidden', String(!active));
  });
  indexLabel!.textContent = project.chapters[activeChapter].index;
  currentChapter!.textContent = project.chapters[activeChapter].index;
  scene?.setPose(project.chapters[activeChapter].pose, reducedMotion);
  scene?.setScrollProgress(activeChapter / Math.max(project.chapters.length - 1, 1));
  lockInput();
}

function move(direction: 1 | -1): void {
  if (inputLocked) return;
  if (!projectIsOpen) {
    if (direction > 0) showProject(true);
    return;
  }
  if (direction < 0 && activeChapter === 0) {
    showProject(false);
    return;
  }
  activateChapter(activeChapter + direction);
}

window.addEventListener('wheel', (event) => {
  event.preventDefault();
  if (inputLocked) return;
  wheelDistance += event.deltaY;
  if (Math.abs(wheelDistance) < 28) return;
  move(wheelDistance > 0 ? 1 : -1);
  wheelDistance = 0;
}, { passive: false });

window.addEventListener('keydown', (event) => {
  if (['ArrowDown', 'ArrowRight', 'PageDown', ' '].includes(event.key)) {
    event.preventDefault();
    move(1);
  } else if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(event.key)) {
    event.preventDefault();
    move(-1);
  } else if (event.key === 'Home') {
    event.preventDefault();
    showProject(false);
  }
});

window.addEventListener('touchstart', (event) => { touchStartY = event.touches[0]?.clientY ?? 0; }, { passive: true });
window.addEventListener('touchend', (event) => {
  const endY = event.changedTouches[0]?.clientY ?? touchStartY;
  if (Math.abs(touchStartY - endY) > 44) move(touchStartY > endY ? 1 : -1);
}, { passive: true });

document.querySelector('.scroll-cue')?.addEventListener('click', (event) => {
  event.preventDefault();
  showProject(true);
});
document.querySelector('.wordmark')?.addEventListener('click', (event) => {
  event.preventDefault();
  showProject(false);
});
document.querySelector('.chapter-button--prev')?.addEventListener('click', () => move(-1));
document.querySelector('.chapter-button--next')?.addEventListener('click', () => move(1));

if (location.hash === '#project-story') showProject(true);
if (!reducedMotion) gsap.from('.reveal', { y: 28, opacity: 0, duration: 1, stagger: 0.12, ease: 'power3.out' });

window.addEventListener('pagehide', () => scene?.dispose(), { once: true });
