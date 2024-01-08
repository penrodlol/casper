import { onAstroPageLoad } from '@/libs/astro';

onAstroPageLoad<HTMLDialogElement>('[data-popover]', (popover) => {
  const openTrigger = popover.nextElementSibling as HTMLButtonElement;
  const closeTriggers = popover.querySelectorAll<HTMLButtonElement>('[slot="popover-close"]');
  const offset = Number(popover.dataset.offset ?? '0');

  popover.addEventListener('click', (event) => event.target === popover && popover.close());
  closeTriggers.forEach((trigger) => trigger.addEventListener('click', () => popover.close()));

  popover.addEventListener('close', () => {
    toggleOverflow(false);
    window.removeEventListener('resize', () => setPosition(popover, openTrigger, offset));
  });

  openTrigger.addEventListener('click', () => {
    popover.showModal();
    toggleOverflow(true);
    setPosition(popover, openTrigger, offset);
    window.addEventListener('resize', () => setPosition(popover, openTrigger, offset));
  });
});

function setPosition(popover: HTMLDialogElement, openTrigger: HTMLButtonElement, offset: number) {
  const { bottom, left, width } = openTrigger.getBoundingClientRect();
  popover.style.setProperty('--top', `${bottom + offset}px`);
  popover.style.setProperty('--left', `${left - popover.offsetWidth / 2 + width / 2}px`);
}

function toggleOverflow(hide: boolean) {
  if (hide) document.documentElement.style.setProperty('overflow', 'hidden');
  else document.documentElement.style.removeProperty('overflow');
}
