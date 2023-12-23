import { onAstroPageLoad } from '@/libs/astro';

onAstroPageLoad<HTMLDivElement>('[data-select]', (select) => {
  const id = select.dataset.select as string;
  const trigger = select.querySelector('[role="combobox"]') as HTMLButtonElement;
  const overlay = select.querySelector('[data-overlay]') as HTMLDivElement;
  const options = select.querySelector('[role="listbox"]') as HTMLUListElement;

  trigger?.setAttribute('aria-controls', id);
  trigger?.setAttribute('aria-activedescendant', '');
  options?.setAttribute('id', id);
  options
    ?.querySelectorAll('[role="option"]')
    .forEach((option) => option.setAttribute('id', `${id}-${option.getAttribute('value')}`));

  trigger.addEventListener('click', () => {
    const isOpen = select.getAttribute('data-state') === 'open';
    select.setAttribute('data-state', isOpen ? 'closed' : 'open');

    if (!isOpen) return trigger.setAttribute('aria-activedescendant', '');
    const selected = options.querySelector('[aria-selected="true"]') as HTMLSpanElement;
    if (selected) trigger.setAttribute('aria-activedescendant', selected.id);
  });

  overlay.addEventListener('click', () => select.setAttribute('data-state', 'closed'));

  options.addEventListener('click', (event) => {
    const option = (event.target as HTMLElement).closest('[role="option"]') as HTMLLIElement;
    if (!option) return;

    (trigger.firstElementChild as HTMLSpanElement).textContent = option.textContent;
    select.setAttribute('data-state', 'closed');
    options.querySelector('[aria-selected="true"]')?.setAttribute('aria-selected', 'false');
    option.setAttribute('aria-selected', 'true');
  });
});
