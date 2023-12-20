import { onAstroPageLoad } from '@/libs/astro';

onAstroPageLoad<HTMLDivElement>('[data-toast]', (toast) => {
  const openTrigger = toast.nextElementSibling as HTMLButtonElement;
  const closeTriggers = toast.querySelectorAll<HTMLButtonElement>('[slot="toast-close"]');

  openTrigger?.addEventListener('click', () => toast.setAttribute('data-state', 'open'));

  closeTriggers?.forEach((closeTrigger) => {
    closeTrigger?.addEventListener('click', () => toast.setAttribute('data-state', 'closed'));
  });
});
