import { itineraryMarkup } from './itinerary-showcase';

const groups = [
  { name: 'Attendance & HR Core', number: '01', status: 'The foundation', modules: [
    ['Autonomous kiosk', 'Sensor-triggered capture · face recognition · liveness checks'],
    ['Employee administration', 'Directory · departments · branches · accounts'],
    ['Attendance operations', 'Time records · schedules · reports · activity logs'],
    ['Remote & itinerary workspace', 'Requests · review · calendars · itinerary time-ins / outs'],
    ['Supporting tools', 'Face enrollment · RFID / keypad · fingerprint fallback · announcements'],
  ] },
  { name: 'Inventory Tracking', number: '02', status: 'Connected application', modules: [
    ['Equipment workspace', 'Devices · specifications · condition · evidence photos'],
    ['People & custody', 'Employee assignments · shared holders · returns'],
    ['Lifecycle & history', 'Handovers · change history · disposal · reusable components'],
    ['Workbook tools', 'Excel import preview · approval · export'],
  ] },
  { name: 'Document Management', number: '03', status: 'Work in progress', modules: [
    ['Authoring workspace', 'Rich-text editor · drafts · versioned documents'],
    ['Signature workflow', 'Ordered participants · signature preview · confirmation · denial'],
    ['Employee folders', 'Private documents · HR inspection · public files · Seen receipts'],
    ['Document engine', 'Queued PDF rendering · private downloads · activity history'],
  ] },
];

export function ecosystemMarkup(): string {
  return `<section class="ecosystem-map ecosystem-expanded" aria-label="Application ecosystem graph"><p class="eyebrow">The ecosystem I built / system map</p><h3>One foundation. A growing workplace stack.</h3><p class="hr-intro">Three purpose-built applications, connected through the people who use them.</p>
    <div class="ecosystem-core"><small>SHARED FOUNDATION</small><strong>Employee directory & accounts</strong><span>Maintained in Attendance & HR Core · Reused by the connected applications</span></div>
    <div class="ecosystem-trunk" aria-hidden="true"><span>People & account relationships</span></div>
    <div class="ecosystem-columns">${groups.map(group => `<div class="ecosystem-column"><header><small>${group.number} / ${group.status}</small><h4>${group.name}</h4></header><ul>${group.modules.map(([title, text]) => `<li><strong>${title}</strong><span>${text}</span></li>`).join('')}</ul>${group.number === '02' ? '<a href="#/projects/inventory-system">Explore inventory ↗</a>' : ''}</div>`).join('')}</div>
    <p class="visual-caption">Solid connectors show the shared employee foundation. Grouped nodes show application modules, not separate deployments or direct connections between every module. Each app manages its own workflow records.</p>
  </section>`;
}

export function hrShowcaseMarkup(part: 'autonomous' | 'details'): string {
  const markup = `<section class="hr-autonomous"><p class="eyebrow">The flagship experience</p><h2>Walk up. Be recognized. Get on with your day.</h2><p class="hr-intro">Autonomous mode turns the kiosk into an active attendance station. Doorway sensors and the local camera agent coordinate capture, facial recognition, and feedback, while the server validates and records the attendance event.</p>
    <div class="hr-recognition"><div class="hr-face" aria-hidden="true"><svg viewBox="0 0 180 180" fill="none"><path d="M25 55V25h30m70 0h30v30M25 125v30h30m70 0h30v-30" stroke="currentColor" stroke-width="2"/><ellipse cx="90" cy="74" rx="28" ry="35" stroke="currentColor" stroke-width="1.5"/><path d="M42 142c4-39 92-39 96 0M54 74h72M90 40v70" stroke="currentColor" stroke-opacity=".4" stroke-dasharray="3 5"/></svg><span>LOCAL RECOGNITION PIPELINE</span></div><ol><li><small>01 / SENSE</small><strong>Presence starts the flow</strong><span>Doorway sensing coordinates the autonomous camera experience.</span></li><li><small>02 / RECOGNIZE</small><strong>Match the person, check liveness</strong><span>Face embeddings identify the employee; anti-spoofing adds a separate liveness check.</span></li><li><small>03 / RECORD</small><strong>Confirm the attendance event</strong><span>The server applies attendance rules and persists the accepted record.</span></li></ol></div>
    <div class="recognition-controls"><button type="button" class="media-button" data-simulate-timein>Simulate time-in</button><p data-recognition-status role="status">Demo ready / No camera access</p></div><p class="visual-caption">Illustrative sequence with fictional data. Real recognition may require a retry or fallback. Reported time-ins are operational observations.</p>
  </section>
  <section class="hr-stack"><p class="eyebrow">Engineering across the stack</p><h2>From physical presence to a durable record.</h2><div class="hr-stack-grid">
    <div><small>APPLICATION CORE</small><h3>Laravel · MySQL · Filament</h3><p>The server owns the accepted attendance record. Centralized rules and permissions keep kiosk decisions separate from durable employee records.</p></div>
    <div><small>EMPLOYEE EXPERIENCE</small><h3>Vue · Inertia · TypeScript</h3><p>Responsive kiosk and employee screens connect server workflows to clear, immediate feedback. Tailwind and Vite support the interface layer.</p></div>
    <div><small>COMPUTER VISION</small><h3>Python · FastAPI · DeepFace</h3><p>Local processing brings vision close to the kiosk. SFace embeddings identify employees, YuNet detects faces, and MiniFAS checks liveness; OpenCV and the camera agent coordinate capture.</p></div>
    <div><small>CONNECTED WORKFLOWS</small><h3>PHP · Vue · PDF tooling</h3><p>A shared directory avoids maintaining a separate employee list for every tool. PHP and PDO MySQL power inventory; Laravel, Vue, Umo, Puppeteer, and pdf-lib support the WIP document workflow.</p></div>
  </div></section>
  <section class="hr-employees"><p class="eyebrow">Interface study / fictional data</p><h2>The people behind the connected tools.</h2><p class="hr-intro">An illustrative employee tab, inspired by the directory’s searchable records, branch assignments, departments, and schedules.</p>
  <div class="employee-mock"><div class="employee-chrome"><span><i></i><i></i><i></i></span><small>WORKFORCE / EMPLOYEES</small><span class="mock-tag">Mockup</span></div><div class="employee-workspace"><aside><strong>HR Core<span>Workforce workspace</span></strong><span class="mock-active">Employees</span><span>Attendance</span><span>Itineraries</span><span>Reports</span></aside><div class="employee-content"><div class="employee-title"><div><small>PEOPLE DIRECTORY</small><h3>Employees <span>04</span></h3></div><span class="mock-tag">Shared foundation</span></div><label class="employee-search">Search employees<input type="search" data-employee-search placeholder="Try a name, branch, or department"></label><div class="employee-table-wrap"><table><caption class="sr-only">Fictional employee directory preview</caption><thead><tr><th>Employee</th><th>Department / role</th><th>Branch</th><th>Assigned time</th></tr></thead><tbody>${[
    ['AC', 'Alex Cruz', 'DEMO-001', 'Operations', 'Coordinator', 'Main office', '08:00–17:00'],
    ['SR', 'Sam Rivera', 'DEMO-002', 'IT', 'Support specialist', 'Main office', '09:00–18:00'],
    ['JL', 'Jamie Lee', 'DEMO-003', 'Field services', 'Field coordinator', 'Itinerary', '08:00–17:00'],
    ['MT', 'Morgan Tan', 'DEMO-004', 'Administration', 'Administrator', 'Remote', '09:00–18:00'],
  ].map(([initials, name, id, department, role, branch, hours]) => `<tr data-demo-employee><td><div class="employee-person"><b>${initials}</b><span><button type="button" class="employee-select" data-employee-name="${name}" aria-pressed="false">${name}</button><small>${id}</small></span></div></td><td>${department}<small>${role}</small></td><td><span class="employee-branch">${branch}</span></td><td>${hours}</td></tr>`).join('')}</tbody></table></div><p class="employee-count" role="status" data-employee-count>4 fictional employees</p></div></div><div class="employee-connections" data-employee-connections><p>Select an employee to explore their connected workspaces.</p></div></div>
    <p class="visual-caption">Portfolio reconstruction with invented names and simplified fields. It is not a screenshot and does not expose production employee records.</p>
  </section>
  ${itineraryMarkup()}`;
  const stackStart = markup.indexOf('<section class="hr-stack">');
  const employeesStart = markup.indexOf('<section class="hr-employees">');
  return part === 'autonomous' ? markup.slice(0, stackStart) : itineraryMarkup() + markup.slice(employeesStart, markup.indexOf('<section class="hr-itinerary')) + markup.slice(stackStart, employeesStart);
}

export function mountEmployeeMock(panel: HTMLElement): void {
  const search = panel.querySelector<HTMLInputElement>('[data-employee-search]')!;
  const connections = panel.querySelector<HTMLElement>('[data-employee-connections]')!;
  const examples: Record<string, [string, string]> = {
    'Alex Cruz': ['Studio laptop / Assigned', 'Equipment handover / Awaiting signature'],
    'Sam Rivera': ['Support laptop / Assigned', 'Service checklist / Draft'],
    'Jamie Lee': ['Field tablet / Assigned', 'Deployment brief / Reviewed'],
    'Morgan Tan': ['Office monitor / Assigned', 'Team announcement / Seen'],
  };
  panel.querySelectorAll<HTMLButtonElement>('[data-employee-name]').forEach(button => button.addEventListener('click', () => {
    panel.querySelectorAll('[data-employee-name]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    const name = button.dataset.employeeName!;
    const [equipment, document] = examples[name];
    connections.innerHTML = `<div class="employee-connection-heading"><strong>${name}</strong><small>Fictional cross-app demonstration</small></div><div class="employee-connection-grid"><div><small>INVENTORY</small><p>${equipment}</p></div><div><small>DOCUMENTS / WIP</small><p>${document}</p></div></div>`;
  }));
  search.addEventListener('input', () => {
    let count = 0;
    panel.querySelectorAll<HTMLTableRowElement>('[data-demo-employee]').forEach(row => {
      row.hidden = !row.textContent!.toLowerCase().includes(search.value.trim().toLowerCase());
      if (!row.hidden) count++;
    });
    panel.querySelector('[data-employee-count]')!.textContent = `${count} fictional ${count === 1 ? 'employee' : 'employees'}${count === 0 ? ' · No matches' : ''}`;
  });
}

export function mountRecognitionDemo(panel: HTMLElement): void {
  const button = panel.querySelector<HTMLButtonElement>('[data-simulate-timein]')!;
  const status = panel.querySelector<HTMLElement>('[data-recognition-status]')!;
  const stages = [...panel.querySelectorAll<HTMLElement>('.hr-recognition li')];
  button.addEventListener('click', async () => {
    button.disabled = true;
    const messages = ['Presence detected / Starting capture', 'Demo employee recognized / Liveness check passed', 'Alex Cruz / Time-in recorded / Illustrative result'];
    for (let i = 0; i < stages.length; i++) {
      if (!panel.isConnected) return;
      stages.forEach((stage, index) => stage.classList.toggle('is-current', index === i));
      status.textContent = messages[i];
      if (!matchMedia('(prefers-reduced-motion: reduce)').matches) await new Promise(resolve => setTimeout(resolve, 700));
    }
    button.disabled = false;
    button.textContent = 'Replay time-in';
  });
}
