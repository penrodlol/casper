import { onAstroPageLoad } from '@/libs/astro';

onAstroPageLoad<HTMLDivElement>('[data-collapsible]', (root) => {
  const trigger = root.querySelector<HTMLButtonElement>('[slot="collapsible-trigger"]');
  const content = root.querySelector<HTMLDivElement>('[data-collapsible-content]');
  if (!trigger || !content) return;

  trigger.setAttribute('aria-expanded', root.dataset.open ? 'true' : 'false');
  trigger.setAttribute('aria-controls', content.id);
  trigger.addEventListener('click', () => {
    root.setAttribute('data-state', root.dataset.state === 'open' ? 'closed' : 'open');
    trigger.setAttribute('aria-expanded', root.dataset.state === 'open' ? 'true' : 'false');
  });
});
