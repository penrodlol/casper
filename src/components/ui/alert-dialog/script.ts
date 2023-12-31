import { onAstroPageLoad } from '@/libs/astro';

onAstroPageLoad<HTMLDialogElement>('[data-alert-dialog]', (dialog) => {
  const openTrigger = dialog.nextElementSibling as HTMLButtonElement;
  const closeTriggers = dialog.querySelectorAll<HTMLButtonElement>('[slot="alert-dialog-close"]');

  dialog.addEventListener('close', () => toggleOverflow(false));
  openTrigger?.addEventListener('click', () => (dialog.showModal(), toggleOverflow(true)));
  closeTriggers?.forEach((t) => t.addEventListener('click', () => dialog.close(t.value)));
});

function toggleOverflow(hide: boolean) {
  if (hide) document.documentElement.style.setProperty('overflow', 'hidden');
  else document.documentElement.style.removeProperty('overflow');
}
