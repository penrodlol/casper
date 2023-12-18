import { onAstroPageLoad } from '@/libs/astro';

onAstroPageLoad('[data-navigation-menu]', (component) => {
  const id = component.dataset.navigationMenu;

  component
    .querySelectorAll<HTMLUListElement>('[data-navigation-menu-dropdown]')
    .forEach((dropdown) => {
      const trigger = dropdown.querySelector('button');
      const links = dropdown.querySelector('ul');
      if (!trigger || !links) return;

      trigger.setAttribute('aria-controls', `navigation-menu-dropdown-links-${id}`);
      links.setAttribute('id', `navigation-menu-dropdown-links-${id}`);

      dropdown.addEventListener('mouseenter', () => trigger.setAttribute('aria-expanded', 'true'));
      dropdown.addEventListener('mouseleave', () => trigger.setAttribute('aria-expanded', 'false'));
      dropdown.addEventListener('focusin', () => trigger.setAttribute('aria-expanded', 'true'));
      dropdown.addEventListener('focusout', () => trigger.setAttribute('aria-expanded', 'false'));
    });
});
