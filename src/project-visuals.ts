import type { Project } from './library';
import { attendanceMarkup, mountAttendanceDemo } from './attendance-demo';
import { inventoryMarkup, mountInventoryDemo } from './inventory-demo';

const svgStart = (label: string, viewBox = '0 0 640 300') => `<svg class="project-diagram" viewBox="${viewBox}" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg">`;

function mk1(): string {
  return `<div class="visual-panel" data-visual="mk1">
    <div class="visual-heading"><p class="eyebrow">Design, explained</p><h2>A shell shaped around the keys.</h2><p>The curves connect several key positions into one enclosure. Open the schematic to see the fit problem inside.</p></div>
    <div class="visual-options" role="group" aria-label="Enclosure diagram view"><button type="button" data-enclosure="assembled" aria-pressed="true">Together</button><button type="button" data-enclosure="exploded" aria-pressed="false">Look inside</button></div>
    <figure>
      ${svgStart('Conceptual side section of a sculpted keyboard enclosure, showing key positions, the electronics space, and the bottom cover')}
        <defs><pattern id="shell-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><path d="M0 0v8" stroke="currentColor" stroke-opacity=".15" stroke-width="2"/></pattern></defs>
        <path class="diagram-guide" d="M65 249H575"/>
        <g class="shell-top">
          <path class="diagram-fill" d="M92 155Q106 112 142 124Q210 166 280 140Q348 116 389 141Q419 158 447 184L516 186Q545 189 546 218H89Z"/>
          <path d="M92 155Q106 112 142 124Q210 166 280 140Q348 116 389 141Q419 158 447 184L516 186Q545 189 546 218" class="diagram-line"/>
          <path d="M92 155Q106 112 142 124Q210 166 280 140Q348 116 389 141Q419 158 447 184L516 186Q545 189 546 218H89Z" fill="url(#shell-hatch)"/>
          <g class="diagram-key"><rect x="120" y="100" width="49" height="25" rx="5" transform="rotate(24 145 112)"/><rect x="191" y="123" width="49" height="25" rx="5" transform="rotate(7 215 135)"/><rect x="263" y="115" width="49" height="25" rx="5" transform="rotate(-11 287 127)"/><rect x="336" y="108" width="49" height="25" rx="5" transform="rotate(10 360 120)"/><rect x="456" y="160" width="49" height="25" rx="5" transform="rotate(11 480 172)"/></g>
        </g>
        <g class="shell-inside"><rect x="170" y="185" width="130" height="20" rx="4" class="diagram-component"/><rect x="325" y="177" width="50" height="27" rx="4" class="diagram-component"/><path d="M300 194H315V189H325" class="diagram-line"/></g>
        <g class="shell-base"><path d="M89 225H546" class="diagram-line"/><circle cx="120" cy="225" r="5" class="diagram-dot"/><circle cx="516" cy="225" r="5" class="diagram-dot"/></g>
        <path d="M438 65L372 116" class="diagram-guide"/><text x="441" y="61" class="diagram-label">Key positions</text>
      </svg>
      <figcaption class="visual-caption">Illustrative side section, not the actual CAD geometry. Explore the 3D model below for the real form.</figcaption>
    </figure>
    <p class="visual-explanation" aria-live="polite">Together: a continuous outer shell follows the changing height and angle of the keys.</p>
    <div class="visual-legend"><span><i class="legend-shell"></i>Sculpted shell</span><span><i class="legend-parts"></i>Space for electronics</span><span><i class="legend-base"></i>Bottom cover</span></div>
  </div>`;
}

function keyGroup(side: 'left' | 'right'): string {
  const startX = side === 'left' ? 105 : 343;
  return `<g class="keyboard-half keyboard-half--${side}"><rect x="${startX - 14}" y="65" width="210" height="153" rx="19" class="diagram-fill"/>${Array.from({ length: 18 }, (_, i) => `<g><rect x="${startX + (i % 6) * 31}" y="${79 + Math.floor(i / 6) * 35}" width="25" height="28" rx="4" class="diagram-key"/><text x="${startX + (i % 6) * 31 + 12.5}" y="${97 + Math.floor(i / 6) * 35}" class="key-label" data-key="${side}-${i}"></text></g>`).join('')}<rect x="${startX + (side === 'left' ? 106 : 27)}" y="190" width="62" height="12" rx="3" class="diagram-component"/></g>`;
}

function raven(): string {
  return `<div class="visual-panel" data-visual="raven">
    <div class="visual-heading"><p class="eyebrow">Try the idea</p><h2>Same keys. Different possibilities.</h2><p>Move the halves apart, then change the layer. Placement changes where the keys sit; a layer changes what they do.</p></div>
    <div class="visual-options" role="group" aria-label="Illustrative keyboard layer"><button type="button" data-layer="letters" aria-pressed="true">Letters</button><button type="button" data-layer="numbers" aria-pressed="false">Numbers</button><button type="button" data-layer="navigation" aria-pressed="false">Navigation</button></div>
    <figure>${svgStart('Illustrative split keyboard with adjustable spacing and switchable key labels')}${keyGroup('left')}${keyGroup('right')}<path d="M274 254h92m-85-7-7 7 7 7m78-14 7 7-7 7" class="diagram-guide"/></svg><figcaption class="visual-caption">Concept diagram. Key positions and assignments are illustrative, not Raven's exact layout or keymap.</figcaption></figure>
    <div class="spacing-control"><label for="keyboard-spacing">Space between the halves</label><input id="keyboard-spacing" type="range" min="0" max="100" value="40" aria-describedby="spacing-help"/><span id="spacing-help">Try a closer or wider arrangement.</span></div>
    <p class="visual-explanation" aria-live="polite">Letters: the familiar typing layer. The same physical keys can also handle numbers and navigation.</p>
  </div>`;
}

const comparisons = {
  latency: { label: 'Mean extraction API time', before: 33.839, after: 15.728, max: 40, unit: 's', reduction: '53.5% faster', note: 'Mean of three calls per version on the same image. Time excludes queueing, upload, saving, and human review.' },
  tokens: { label: 'Mean total tokens per extraction', before: 6515, after: 2536.3333333333335, max: 8000, unit: 'tokens', reduction: '61.1% fewer tokens', note: 'Reported input plus output tokens in the same earlier comparison. Token reduction is not a measured billing saving.' },
};

function barChart(mode: keyof typeof comparisons): string {
  const data = comparisons[mode];
  const format = (value: number) => mode === 'latency' ? `${value.toFixed(2)} s` : `${Math.round(value).toLocaleString('en-US')} tokens`;
  const axis = mode === 'latency' ? [0, 10, 20, 30, 40] : [0, 2000, 4000, 6000, 8000];
  return `${svgStart(`${data.label}: earlier baseline ${format(data.before)}, optimized ${format(data.after)}`, '0 0 640 275')}
    ${axis.map(tick => `<path d="M${46 + tick / data.max * 544} 42v168" class="chart-grid"/><text x="${46 + tick / data.max * 544}" y="240" class="axis-label">${mode === 'tokens' && tick ? `${tick / 1000}k` : tick}</text>`).join('')}
    <text x="46" y="30" class="chart-label">Earlier baseline</text><rect x="46" y="48" width="${data.before / data.max * 544}" height="45" rx="3" class="chart-before"/><text x="${56 + data.before / data.max * 544}" y="76" class="chart-value">${format(data.before)}</text>
    <text x="46" y="137" class="chart-label">Optimized version</text><rect x="46" y="155" width="${data.after / data.max * 544}" height="45" rx="3" class="chart-after"/><text x="${56 + data.after / data.max * 544}" y="183" class="chart-value">${format(data.after)}</text>
    <text x="590" y="265" text-anchor="end" class="axis-unit">${mode === 'latency' ? 'Seconds · lower is better' : 'Tokens · lower is better'}</text>
  </svg>`;
}

function manualChart(lines: number, secondsPerLine: number): string {
  const manual = lines * secondsPerLine;
  const automated = 15;
  const peak = Math.max(manual, automated);
  const magnitude = 10 ** Math.floor(Math.log10(peak));
  const maximum = Math.ceil(peak / magnitude) * magnitude;
  const format = (value: number) => value.toLocaleString('en-US', { maximumFractionDigits: 1 });
  return `${svgStart(`Estimated time for ${lines} ${lines === 1 ? 'line' : 'lines'}: manual entry ${format(manual)} seconds, automated parsing 15 seconds`, '0 0 640 275')}
    ${Array.from({ length: 5 }, (_, index) => {
      const value = index * maximum / 4;
      return `<path d="M${46 + index * 110} 42v168" class="chart-grid"/><text x="${46 + index * 110}" y="240" class="axis-label">${value >= 1000 ? `${format(value / 1000)}k` : format(value)}</text>`;
    }).join('')}
    <text x="46" y="30" class="chart-label">Manual entry · estimated</text><rect x="46" y="48" width="${manual / maximum * 440}" height="45" rx="3" class="chart-before"/><text x="${56 + manual / maximum * 440}" y="76" class="chart-value">${format(manual)} s</text>
    <text x="46" y="137" class="chart-label">Automated parsing · assumed</text><rect x="46" y="155" width="${automated / maximum * 440}" height="45" rx="3" class="chart-after"/><text x="${56 + automated / maximum * 440}" y="183" class="chart-value">15 s</text>
    <text x="486" y="265" text-anchor="end" class="axis-unit">Seconds · starts at zero</text>
  </svg>`;
}

function manualCalculator(): string {
  return `<section class="manual-calculator" aria-labelledby="manual-title">
    <p class="eyebrow">Try your own scenario</p><h3 id="manual-title">When is automation quicker?</h3>
    <p class="calculator-intro">Start with a 10-line document at 5 seconds per line, against a fixed 15-second automated run. Try a single line, too.</p>
    <div class="calculator-inputs">
      <div><label for="document-lines">Lines in the document</label><input id="document-lines" type="number" inputmode="numeric" min="1" max="10000" step="1" value="10" required aria-describedby="calculator-assumptions calculator-error" /></div>
      <div><label for="manual-seconds">Manual seconds per line</label><input id="manual-seconds" type="number" inputmode="decimal" min="0.1" max="300" step="0.1" value="5" required aria-describedby="calculator-assumptions calculator-error" /></div>
    </div>
    <p id="calculator-error" class="calculator-error" role="alert" hidden></p>
    <figure class="manual-comparison-chart">${manualChart(10, 5)}<figcaption class="visual-caption">A calculated scenario, separate from the measured benchmark above. Both bars use the same zero-based scale.</figcaption></figure>
    <div class="manual-results"><p class="calculator-result" role="status" aria-live="polite">Automated parsing is 3.33× faster in this scenario.</p><p class="calculator-difference">35 seconds saved · 70% less time than manual entry.</p><p class="calculator-breakeven">At 5 seconds per line, the two methods tie at 3 lines.</p></div>
    <p id="calculator-assumptions" class="visual-caption">Manual time = lines × seconds per line. Automated time is held at 15 seconds as requested for this estimate; it is not a measured result for every document size. Uploads, queueing, corrections, and review are excluded. This compares processing time, not accuracy or total staff workload.</p>
  </section>`;
}

function parsing(): string {
  return `<div class="visual-panel" data-visual="document-parsing">
    <div class="visual-heading"><p class="eyebrow">The work, simplified</p><h2>From an image to an exception.</h2><p>Automation takes the first pass. Staff spend their attention on the entries that need a closer look.</p></div>
    <ol class="workflow" aria-label="Simplified parsing workflow"><li><span>01</span><strong>Submit</strong><p>Image or typed input</p></li><li><span>02</span><strong>Parse</strong><p>Extract structured fields</p></li><li><span>03</span><strong>Validate</strong><p>Check the results</p></li><li><span>04</span><strong>Route</strong><p>Eligible entries to the website; flagged entries to review</p></li></ol>
    <div class="chart-heading"><h3>Less work for each extraction.</h3><span class="chart-reduction">53.5% faster</span></div>
    <div class="visual-options" role="group" aria-label="Benchmark chart metric"><button type="button" data-chart="latency" aria-pressed="true">Extraction time</button><button type="button" data-chart="tokens" aria-pressed="false">Token usage</button></div>
    <figure class="benchmark-chart">${barChart('latency')}<figcaption class="visual-caption">Earlier matched comparison · 16 October 2026 · three calls per version · one repeated image.</figcaption></figure>
    <p class="chart-context" aria-live="polite">${comparisons.latency.note}</p>
    <p class="visual-caption">The later 8.41-second result is a separate sample, shown in the benchmark table below. Neither study measures hours of staff work against seconds of API time.</p>
    ${manualCalculator()}
  </div>`;
}

const improvements: Record<string, { title: string; body: string; check: string }[]> = {
  mk1: [
    { title: 'Cleaner assembly', body: 'Explore modeled insert pockets and mounting clearances, so the hardware has a more deliberate home.', check: 'Check: a trial assembly with the actual hardware.' },
    { title: 'More predictable printing', body: 'Review curved transitions and wall thickness before committing to another full enclosure.', check: 'Check: small test prints at difficult sections.' },
    { title: 'Fit, backed by observation', body: 'Compare key access and half placement during everyday tasks rather than assuming every curve helps.', check: 'Check: documented fit feedback; no comfort score yet.' },
  ],
  raven: [
    { title: 'Easier layer discovery', body: 'Explore clearer on-screen cues for what the active layer makes available.', check: 'Check: can a new user find common controls?' },
    { title: 'More legible feedback', body: 'Try different information priorities and text sizes on the small displays.', check: 'Check: reading the display at normal desk distance.' },
    { title: 'Measured power use', body: 'Measure active and idle consumption before choosing further display or sleep changes.', check: 'Check: repeatable runtime measurements; no battery-life claim yet.' },
  ],
  'document-parsing': [
    { title: 'A broader accuracy sample', body: 'Expand beyond the repeated benchmark image to verified samples from different writers and image conditions.', check: 'Check: exact transcriptions and errors left unflagged.' },
    { title: 'End-to-end timings', body: 'Measure the full journey from submission to usable website data, including the time spent waiting.', check: 'Check: median and 95th-percentile turnaround.' },
    { title: 'Peak demand, tested', body: 'Test realistic submission bursts and record how quickly the queue recovers.', check: 'Check: completion rate, queue delay, and duplicate handling.' },
  ],
};

export function visualMarkup(project: Project): string {
  const content = project.id === 'attendance-hr-core' ? attendanceMarkup() : project.id === 'mk1' ? mk1() : project.id === 'raven' ? raven() : project.id === 'document-parsing' ? parsing() : project.id === 'inventory-system' ? inventoryMarkup() : '';
  return content ? `<section class="project-visuals" aria-label="Project visualization">${content}</section>` : '';
}

export function improvementMarkup(project: Project): string {
  const items = improvements[project.id];
  return items ? `<section class="improvement-section" aria-labelledby="improvements-title"><p class="eyebrow">Proposed next steps</p><h2 id="improvements-title">Where this could go next.</h2><p class="improvement-intro">Opportunities to explore, with a way to check whether they help. These are directions for future work.</p><ol class="improvement-list">${items.map((item, i) => `<li><span class="improvement-number">0${i + 1}</span><div><h3>${item.title}</h3><p>${item.body}</p><span class="improvement-check">${item.check}</span></div></li>`).join('')}</ol></section>` : '';
}

export function mountProjectVisuals(): void {
  const panel = document.querySelector<HTMLElement>('.visual-panel');
  if (!panel) return;
  if (panel.dataset.visual === 'inventory') mountInventoryDemo(panel);
  if (panel.dataset.visual === 'attendance') mountAttendanceDemo(panel);
  const linesInput = panel.querySelector<HTMLInputElement>('#document-lines');
  const secondsInput = panel.querySelector<HTMLInputElement>('#manual-seconds');
  if (linesInput && secondsInput) {
    const updateComparison = () => {
      const lines = linesInput.valueAsNumber;
      const seconds = secondsInput.valueAsNumber;
      const validLines = linesInput.validity.valid && Number.isInteger(lines);
      const validSeconds = secondsInput.validity.valid && Number.isFinite(seconds);
      linesInput.setAttribute('aria-invalid', String(!validLines));
      secondsInput.setAttribute('aria-invalid', String(!validSeconds));
      const valid = validLines && validSeconds;
      const error = panel.querySelector<HTMLElement>('#calculator-error')!;
      const figure = panel.querySelector<HTMLElement>('.manual-comparison-chart')!;
      const results = panel.querySelector<HTMLElement>('.manual-results')!;
      error.hidden = valid;
      figure.hidden = results.hidden = !valid;
      if (!valid) {
        error.textContent = !validLines ? 'Enter a whole number of lines from 1 to 10,000.' : 'Enter seconds per line from 0.1 to 300, in steps of 0.1.';
        return;
      }
      figure.querySelector('svg')!.outerHTML = manualChart(lines, seconds);
      const manual = lines * seconds;
      const automated = 15;
      const difference = Math.abs(manual - automated);
      const format = (value: number) => value.toLocaleString('en-US', { maximumFractionDigits: 2 });
      const result = results.querySelector('.calculator-result')!;
      const detail = results.querySelector('.calculator-difference')!;
      if (Math.abs(manual - automated) < 0.000001) {
        result.textContent = 'Both take 15 seconds. Neither has a time advantage.';
        detail.textContent = '0 seconds saved · equal processing time in this scenario.';
      } else {
        const automationWins = manual > automated;
        const ratio = automationWins ? manual / automated : automated / manual;
        const percent = difference / Math.max(manual, automated) * 100;
        result.textContent = `${automationWins ? 'Automated parsing' : 'Manual entry'} is ${format(ratio)}× faster in this scenario.`;
        detail.textContent = `${format(difference)} ${Math.abs(difference - 1) < 0.000001 ? 'second' : 'seconds'} saved · ${format(percent)}% less time than ${automationWins ? 'manual entry' : 'automated parsing'}.`;
      }
      const breakeven = 15 / seconds;
      const threshold = Number.isInteger(breakeven)
        ? `the two methods tie at ${format(breakeven)} ${breakeven === 1 ? 'line' : 'lines'}.`
        : `automated parsing becomes quicker at ${Math.ceil(breakeven)} ${Math.ceil(breakeven) === 1 ? 'line' : 'lines'}.`;
      results.querySelector('.calculator-breakeven')!.textContent = `At ${format(seconds)} ${seconds === 1 ? 'second' : 'seconds'} per line, ${threshold}`;
    };
    linesInput.addEventListener('input', updateComparison);
    secondsInput.addEventListener('input', updateComparison);
    updateComparison();
  }
  panel.querySelectorAll<HTMLButtonElement>('[data-enclosure]').forEach(button => button.addEventListener('click', () => {
    const open = button.dataset.enclosure === 'exploded';
    panel.classList.toggle('is-exploded', open);
    panel.querySelectorAll<HTMLButtonElement>('[data-enclosure]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    panel.querySelector('.visual-explanation')!.textContent = open
      ? 'Inside: separate layers reveal the fit problem. Keys above, electronics within, and a removable cover below.'
      : 'Together: a continuous outer shell follows the changing height and angle of the keys.';
  }));

  const labels = {
    letters: ['Q W E R T Y A S D F G H Z X C V B N', 'U I O P J K L M ; , . / H J K L ; :'],
    numbers: ['1 2 3 4 5 6 7 8 9 0 + − 1 2 3 4 5 6', '7 8 9 0 + − 1 2 3 4 5 6 7 8 9 0 + −'],
    navigation: ['Esc Tab ↑ End PgU Ins ← ↓ → Home PgD Del Esc Tab ↑ End PgU Ins', 'Home ↑ End PgU Ins Del ← ↓ → PgD Tab Esc Home ↑ End PgU Ins Del'],
  };
  const setLayer = (mode: keyof typeof labels) => {
    const texts = labels[mode].map(side => side.split(' '));
    panel.querySelectorAll<SVGTextElement>('[data-key]').forEach(key => {
      const [side, index] = key.dataset.key!.split('-');
      key.textContent = texts[side === 'left' ? 0 : 1][Number(index)];
    });
  };
  if (panel.dataset.visual === 'raven') setLayer('letters');
  panel.querySelectorAll<HTMLButtonElement>('[data-layer]').forEach(button => button.addEventListener('click', () => {
    const mode = button.dataset.layer as keyof typeof labels;
    setLayer(mode);
    panel.querySelectorAll<HTMLButtonElement>('[data-layer]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    panel.querySelector('.visual-explanation')!.textContent = mode === 'letters'
      ? 'Letters: the familiar typing layer. The same physical keys can also handle numbers and navigation.'
      : mode === 'numbers' ? 'Numbers: the physical keys stay in place; their assignments change to numerical controls.'
        : 'Navigation: arrows and movement controls use the same keys, rather than a separate navigation cluster.';
  }));
  const slider = panel.querySelector<HTMLInputElement>('#keyboard-spacing');
  const setSpacing = () => {
    const offset = Number(slider!.value) * 0.48;
    panel.querySelector('.keyboard-half--left')?.setAttribute('transform', `translate(${-offset} 0)`);
    panel.querySelector('.keyboard-half--right')?.setAttribute('transform', `translate(${offset} 0)`);
  };
  if (slider) { setSpacing(); slider.addEventListener('input', setSpacing); }

  panel.querySelectorAll<HTMLButtonElement>('[data-chart]').forEach(button => button.addEventListener('click', () => {
    const mode = button.dataset.chart as keyof typeof comparisons;
    panel.querySelectorAll<HTMLButtonElement>('[data-chart]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    const figure = panel.querySelector('.benchmark-chart')!;
    figure.querySelector('svg')!.outerHTML = barChart(mode);
    panel.querySelector('.chart-reduction')!.textContent = comparisons[mode].reduction;
    panel.querySelector('.chart-context')!.textContent = comparisons[mode].note;
  }));
}
