import { onAstroPageLoad } from '@/libs/astro';

onAstroPageLoad<HTMLDialogElement>('[data-drawer]', (drawer) => {
  const openTrigger = drawer.nextElementSibling as HTMLButtonElement;

  drawer.addEventListener('close', () => toggleOverflow(false));
  drawer.addEventListener('click', (event) => event.target === drawer && drawer.close());
  openTrigger?.addEventListener('click', () => (toggleOverflow(true), drawer.showModal()));
});

const toggleOverflow = (hide: boolean) => {
  if (hide) document.documentElement.style.setProperty('overflow', 'hidden');
  else document.documentElement.style.removeProperty('overflow');
};
