import './style.css';
import { projects, type Project } from './library';
import { mediaMarkup, mountProjectMedia } from './project-media';
import { visualMarkup, improvementMarkup, mountProjectVisuals } from './project-visuals';

let disposeMedia = () => {};

const app = document.querySelector<HTMLDivElement>('#app')!;
let filter = 'All projects';
const url = (p: Project) => `#/projects/${p.id}`;
function card(p: Project, i: number): string {
  return `<article class="project-card" data-category="${p.category}"><a class="card-link" href="${url(p)}" aria-label="View ${p.title}"><div class="card-image"><img src="${p.image}" alt="${p.alt}" width="1200" height="900" loading="lazy" /><span class="card-open" aria-hidden="true">â†—</span>${p.private ? '<span class="private-label">Private project</span>' : ''}</div><div class="card-meta"><span>${p.category}</span><span>0${i + 1}</span></div><h3>${p.title}</h3><p>${p.cardDescription ?? p.description}</p><span class="card-caption">${p.caption}</span></a></article>`;
}
function library(): string {
  return `<section class="intro"><p class="eyebrow">Independent maker & developer</p><h1 tabindex="-1">Useful things.<br /><span>Thoughtfully made.</span></h1><p class="intro-copy">A collection of personal builds and practical software.<br class="desktop-break" /> From the first idea to something used every day.</p></section><section id="work" class="work" aria-labelledby="work-title"><div class="section-top"><h2 id="work-title">Project library <span>03</span></h2><p>A few things I've been working on.</p></div><div class="library-toolbar"><div class="filters" role="group" aria-label="Filter projects">${['All projects', 'Hardware', 'Software'].map(label => `<button type="button" data-filter="${label}" aria-pressed="${filter === label}">${label}</button>`).join('')}</div><span class="result-count" role="status" aria-live="polite"></span></div><div class="project-grid">${projects.map(card).join('')}</div></section><section id="about" class="about"><p class="eyebrow">A little about me</p><div><h2>Curiosity, made tangible.</h2><p>I'm Badjau. I make things I actually use, across software, electronics, and 3D fabrication. I enjoy working through the details that turn an idea into something useful.</p><a class="text-link" href="https://github.com/Badjau" target="_blank" rel="noreferrer">More on GitHub â†—</a></div></section>`;
}
function detail(p: Project): string {
  const next = projects[(projects.indexOf(p) + 1) % projects.length];
  return `<article class="project-detail"><a class="back-link" href="#work">â† All projects</a><header class="detail-header"><p class="eyebrow">${p.category} / ${p.caption}</p><h1 tabindex="-1">${p.title}</h1><p>${p.description}</p></header><figure class="detail-image ${p.id}"><img src="${p.image}" alt="${p.alt}" width="1200" height="900" />${p.private ? '<figcaption>Abstract project illustration</figcaption>' : ''}</figure><div class="detail-layout"><aside><h2>At a glance</h2><dl><dt>Focus</dt><dd>${p.focus}</dd><dt>Project</dt><dd>${p.private ? 'Confidential work' : 'Personal build'}</dd></dl>${p.repository ? `<a class="text-link" href="${p.repository}" target="_blank" rel="noreferrer">View repository â†—</a>` : '<p class="confidential-note">Code and product details are private.</p>'}</aside><div class="detail-story">${p.metrics ? `<div class="metrics">${p.metrics.map(m => `<div><strong>${m.value}</strong><span>${m.label}</span></div>`).join('')}</div>` : ''}${p.sections.map((s, index) => `<section><h2>${s.title}</h2><p>${s.body}</p></section>${index === 0 ? visualMarkup(p) : ''}`).join('')}${improvementMarkup(p)}${mediaMarkup(p)}${p.benchmark ? `<section class="benchmark"><p class="eyebrow">Measured performance</p><h2>A closer look at the numbers.</h2><table aria-label="Focused extraction benchmark"><tbody>${p.benchmark.rows.map(row => `<tr><th scope="row">${row.label}</th><td>${row.value}</td></tr>`).join('' )}</tbody></table><p class="benchmark-note">${p.benchmark.note}</p></section>` : ''}${p.secondaryImage ? `<figure class="process-image"><img src="${p.secondaryImage}" alt="${p.secondaryAlt}" loading="lazy" /><figcaption>${p.secondaryAlt}</figcaption></figure>` : ''}</div></div><nav class="detail-navigation" aria-label="Browse projects"><a href="#work">â† All projects</a><a href="${url(next)}"><span>Next project</span>${next.title} â†’</a></nav></article>`;
}
function applyFilter(): void {
  let count = 0;
  document.querySelectorAll<HTMLElement>('.project-card').forEach(card => {card.hidden = filter !== 'All projects' && card.dataset.category !== filter; if (!card.hidden) count++;});
  document.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.filter === filter)));
  const status = document.querySelector('.result-count');
  if (status) status.textContent = `${count} ${count === 1 ? 'project' : 'projects'}`;
}
function render(): void {
  disposeMedia();
  // Plain anchor navigation stays native; only project routes replace the page.
  const slug = location.hash.match(/^#\/projects\/([^/]+)$/)?.[1];
  const project = projects.find(p => p.id === slug);
  document.title = project ? `${project.title} â€” Badjau` : 'Badjau â€” Selected work';
  app.innerHTML = `<header class="site-header"><a class="wordmark" href="#top" aria-label="Badjau home">badjau<span>.</span></a><nav aria-label="Main navigation"><a href="#work" ${!project && location.hash !== '#about' ? 'aria-current="page"' : ''}>Work</a><a href="#about" ${location.hash === '#about' ? 'aria-current="page"' : ''}>About</a><a href="https://github.com/Badjau" target="_blank" rel="noreferrer">GitHub â†—</a></nav></header><main id="main-content" tabindex="-1">${project ? detail(project) : slug ? '<section class="not-found"><h1 tabindex="-1">Project not found.</h1><a class="text-link" href="#work">â† Browse all projects</a></section>' : library()}</main><footer><a href="#top">badjau.</a><p>Made with care. Always a work in progress.</p><a href="https://github.com/Badjau" target="_blank" rel="noreferrer">GitHub â†—</a></footer>`;
  document.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach(b => b.addEventListener('click', () => {filter = b.dataset.filter!; applyFilter();}));
  applyFilter();
  disposeMedia = mountProjectMedia(project);
  mountProjectVisuals();
  if (project || slug) { window.scrollTo(0, 0); document.querySelector<HTMLElement>('h1')?.focus({preventScroll:true}); }
  else if (['#work', '#about', '#main-content'].includes(location.hash)) {
    const target = document.querySelector<HTMLElement>(location.hash);
    target?.scrollIntoView();
    if (location.hash === '#main-content') target?.focus({ preventScroll: true });
  }
  else window.scrollTo(0, 0);
}
window.addEventListener('pagehide', () => disposeMedia());
window.addEventListener('hashchange', render);
render();
