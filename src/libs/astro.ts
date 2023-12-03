export const onAstroPageLoad = <T extends HTMLElement>(
  selector: string,
  callback: (component: T) => void,
) =>
  document.addEventListener(
    'astro:page-load',
    () => document.querySelectorAll<T>(selector)?.forEach((target) => callback(target)),
  );
