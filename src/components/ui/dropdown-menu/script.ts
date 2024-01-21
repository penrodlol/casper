import { onAstroPageLoad } from '@/libs/astro';

type DropdownMenu = HTMLDivElement;
type Overlay = HTMLDivElement;
type Trigger = HTMLButtonElement;
type Content = HTMLDivElement;
type Item = HTMLDivElement;
type Items = NodeListOf<Item>;
type Targets = { dropdownMenu: DropdownMenu; trigger: Trigger; content: Content; items: Items };

onAstroPageLoad<DropdownMenu>('[data-dropdown-menu]', (dropdownMenu) => {
  const overlay = dropdownMenu.querySelector<Overlay>('[data-overlay]');
  const trigger = dropdownMenu.querySelector<Trigger>('[slot="dropdown-menu-trigger"]');
  const content = dropdownMenu.querySelector<Content>('[role="menu"]');
  const items = dropdownMenu.querySelectorAll<Item>('[role="menuitem"]');
  if (!overlay || !trigger || !content || !items) return;

  const targets: Targets = { dropdownMenu, trigger, content, items };

  trigger.setAttribute('aria-haspopup', 'true');
  trigger.setAttribute('aria-expanded', 'false');
  trigger.setAttribute('aria-controls', content.id);
  content.setAttribute('aria-labelledby', trigger.id);

  overlay.addEventListener('click', () => setOpen(targets, false));
  trigger.addEventListener('click', () => setOpen(targets));
});

function setOpen({ dropdownMenu, trigger }: Targets, override?: boolean) {
  const next = override ?? dropdownMenu.getAttribute('data-open') !== 'true';
  dropdownMenu.setAttribute('data-open', `${next}`);
  trigger.setAttribute('aria-expanded', `${next}`);
}
