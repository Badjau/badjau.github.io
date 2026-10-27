export function inventoryMarkup(): string {
  return `<div class="visual-panel inventory-demo" data-visual="inventory">
    <div class="visual-heading"><p class="eyebrow">Try a handover</p><h2>One device. A continuing story.</h2><p>Assign this sample laptop, return it, then search for a previous holder to see how its history stays connected.</p></div>
    <p class="visual-caption">Interactive illustration with fictional data. Changes stay on this page and reset when you leave.</p>
    <label class="inventory-label" for="inventory-search">Search device or holder</label>
    <input id="inventory-search" type="search" placeholder="Try Laptop, INV-001, or Alex" />
    <p class="inventory-empty" role="status" hidden>No matching equipment. Try a device name, asset tag, or previous holder.</p>
    <div class="inventory-device">
      <div class="inventory-device-heading"><div><span class="eyebrow">INV-001 · Laptop</span><h3>Studio laptop</h3></div><span class="inventory-badge">Available</span></div>
      <dl class="inventory-summary"><dt>Current holder</dt><dd class="inventory-holder">Available pool</dd><dt>Condition</dt><dd>Good</dd></dl>
      <form class="inventory-assignment"><label class="inventory-label" for="inventory-person">Assign to</label><select id="inventory-person"><option>Alex Rivera</option><option>Sam Cruz</option><option>Design department (shared)</option></select><div class="visual-options"><button type="submit">Assign device</button><button type="button" data-inventory-return disabled>Return to pool</button></div></form>
      <div class="inventory-history"><h3>Handover history</h3><ol><li>Device registered in the available pool.</li></ol></div>
    </div>
    <p class="inventory-feedback visual-explanation" role="status" aria-live="polite">Ready for its first handover.</p>
    <button type="button" class="media-button" data-inventory-reset>Reset demo</button>
    <p class="inventory-source">Based on <a href="https://github.com/Badjau/inventory-system/blob/main/app/InventoryService.php" target="_blank" rel="noreferrer"><code>InventoryService::assign()</code> and <code>history()</code></a>, plus the project's device and holder search. This preview simulates those behaviors in the browser.</p>
  </div>`;
}

export function mountInventoryDemo(panel: HTMLElement): void {
  const search = panel.querySelector<HTMLInputElement>('#inventory-search')!;
  const person = panel.querySelector<HTMLSelectElement>('#inventory-person')!;
  const returnButton = panel.querySelector<HTMLButtonElement>('[data-inventory-return]')!;
  const feedback = panel.querySelector<HTMLElement>('.inventory-feedback')!;
  const history = panel.querySelector<HTMLOListElement>('.inventory-history ol')!;
  let holder = '';
  let previousHolders: string[] = [];
  const filter = () => {
    const matches = ['Studio laptop', 'INV-001', 'Laptop', holder, ...previousHolders].join(' ').toLowerCase().includes(search.value.trim().toLowerCase());
    panel.querySelector<HTMLElement>('.inventory-device')!.hidden = !matches;
    panel.querySelector<HTMLElement>('.inventory-empty')!.hidden = matches;
  };
  const update = (message: string) => {
    panel.querySelector('.inventory-holder')!.textContent = holder || 'Available pool';
    panel.querySelector('.inventory-badge')!.textContent = holder ? 'Assigned' : 'Available';
    returnButton.disabled = !holder;
    feedback.textContent = message;
    filter();
  };
  const record = (message: string) => {
    const item = document.createElement('li');
    item.textContent = message;
    history.prepend(item);
    update(message);
  };
  panel.querySelector('form')!.addEventListener('submit', event => {
    event.preventDefault();
    const next = person.value;
    if (holder === next) { feedback.textContent = `Already assigned to ${next}. Choose a different holder or return the device.`; return; }
    const from = holder || 'Available pool';
    holder = next;
    previousHolders.push(next);
    record(`${from} → ${holder}. Handover recorded.`);
  });
  returnButton.addEventListener('click', () => {
    if (!holder) return;
    const from = holder;
    holder = '';
    record(`${from} → Available pool. Return recorded; history preserved.`);
  });
  search.addEventListener('input', filter);
  panel.querySelector('[data-inventory-reset]')!.addEventListener('click', () => {
    holder = '';
    previousHolders = [];
    search.value = '';
    person.selectedIndex = 0;
    history.innerHTML = '<li>Device registered in the available pool.</li>';
    update('Demo reset. Ready for its first handover.');
  });
}
