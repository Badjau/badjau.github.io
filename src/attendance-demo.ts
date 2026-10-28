import { mountItineraryDemo } from './itinerary-showcase';
import { ecosystemMarkup, hrShowcaseMarkup, mountEmployeeMock, mountRecognitionDemo } from './hr-showcase';

export function attendanceMarkup(): string {
  return `<div class="visual-panel attendance-demo" data-visual="attendance">
    ${hrShowcaseMarkup('autonomous')}<section class="attendance-calculator"><div class="visual-heading"><p class="eyebrow">Explore the time saved</p><h2>Small seconds. A team-wide difference.</h2><p>Compare hand logging or the previous fingerprint scanner with the current attendance system.</p></div>
    <p class="attendance-assumption">Includes one time-in and one time-out per employee per day, assuming both take the same time.</p>
    <div class="calculator-inputs">
      <div><label for="attendance-people">Employees</label><input id="attendance-people" type="number" min="1" max="100000" step="1" value="100"></div>
      <div><label for="attendance-days">Working days</label><input id="attendance-days" type="number" min="1" max="366" step="1" value="22"></div>
      <div><label for="attendance-before">Previous method: seconds per attendance action</label><input id="attendance-before" type="range" min="5" max="10" step="0.5" value="7.5"><output for="attendance-before" data-before-value>7.5 seconds</output></div>
      <div><label for="attendance-after">Current system: seconds per attendance action</label><input id="attendance-after" type="range" min="1" max="3" step="0.5" value="2"><output for="attendance-after" data-after-value>2 seconds</output></div>
    </div>
    <label class="attendance-outlier"><input type="checkbox" data-slow-case> Explore a 60-second previous action (occasional slow case)</label>
    <div class="manual-results" aria-live="polite" aria-atomic="true" data-attendance-results></div>
    <p class="visual-caption">Total employee time = employees × working days × daily actions × seconds per action. Cumulative employee time, not elapsed queue time or payroll savings. Timings are reported time-in observations; time-out uses the same assumed timing.</p>
    </section>
    ${ecosystemMarkup()}
    ${hrShowcaseMarkup('details')}
  </div>`;
}

export function mountAttendanceDemo(panel: HTMLElement): void {
  mountEmployeeMock(panel);
  mountRecognitionDemo(panel);
  mountItineraryDemo(panel);
  const input = (id: string) => panel.querySelector<HTMLInputElement>(`#attendance-${id}`)!;
  const slow = panel.querySelector<HTMLInputElement>('[data-slow-case]')!;
  const results = panel.querySelector<HTMLElement>('[data-attendance-results]')!;
  const minutes = (seconds: number) => seconds < 3600
    ? `${(seconds / 60).toLocaleString(undefined, { maximumFractionDigits: 1 })} min`
    : `${Math.floor(Math.round(seconds / 60) / 60)} hr ${Math.round(seconds / 60) % 60} min`;
  const update = () => {
    const people = input('people').valueAsNumber;
    const days = input('days').valueAsNumber;
    const before = slow.checked ? 60 : input('before').valueAsNumber;
    const after = input('after').valueAsNumber;
    input('before').disabled = slow.checked;
    panel.querySelector('[data-before-value]')!.textContent = `${before} seconds${slow.checked ? ' · slow case' : ''}`;
    panel.querySelector('[data-after-value]')!.textContent = `${after} seconds`;
    if (!input('people').validity.valid || !input('days').validity.valid || !Number.isFinite(people * days)) {
      results.textContent = 'Enter a whole employee count from 1 to 100,000 and working days from 1 to 366.';
      return;
    }
    const actions = 2;
    const events = people * days * actions;
    results.innerHTML = `<p class="calculator-result"><strong>${minutes(events * (before - after))} saved</strong> across the team over ${days} working days.</p><p class="calculator-difference">${(before - after).toFixed(1)} seconds saved per action · ${Math.round((1 - after / before) * 100)}% less time</p><p class="attendance-action-count">${events.toLocaleString()} actions · Time-in + time-out</p><div class="attendance-bars"><div>Previous method <strong>${minutes(events * before)}</strong><span style="width:100%"></span></div><div>Current system <strong>${minutes(events * after)}</strong><span style="width:${after / before * 100}%"></span></div></div>${slow.checked ? '<p class="visual-caption">Slow-case scenario: assumes every selected attendance action took 60 seconds before. This does not represent the typical employee.</p>' : ''}`;
  };
  panel.querySelectorAll('.calculator-inputs input, [data-slow-case]').forEach(control => control.addEventListener('input', update));
  update();
}
