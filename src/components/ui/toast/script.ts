import { onAstroPageLoad } from '@/libs/astro';

type Toast = HTMLDivElement;

let autoClose!: NodeJS.Timeout;

onAstroPageLoad<Toast>('[data-toast]', (toast) => {
  const duration = Number(toast.dataset.duration);
  const openTrigger = toast.nextElementSibling as HTMLButtonElement;
  const closeTriggers = toast.querySelectorAll<HTMLButtonElement>('[slot="toast-close"]');

  openTrigger?.addEventListener('click', () => {
    document.querySelectorAll<Toast>('[data-toast]').forEach((_toast) => close(_toast, autoClose));
    toast.setAttribute('data-state', 'open');
    if (duration !== Infinity) autoClose = setTimeout(() => close(toast), duration);
  });

  closeTriggers?.forEach((closeTrigger) => {
    closeTrigger?.addEventListener('click', () => close(toast, autoClose));
  });
});

function close(toast: Toast, autoClose?: NodeJS.Timeout) {
  toast.setAttribute('data-state', 'closed');
  if (autoClose) clearTimeout(autoClose);
}
