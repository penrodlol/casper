import { onAstroPageLoad } from '@/libs/astro';

type Menubar = HTMLDivElement;
type Overlay = HTMLDivElement;
type Item = HTMLDivElement;
type Items = NodeListOf<Item>;
type Trigger = HTMLButtonElement;
type Content = HTMLDivElement;

onAstroPageLoad<Menubar>('[data-menubar]', (menubar) => {
  const overlays = menubar.querySelectorAll<Overlay>('[data-overlay]');
  const items = menubar.querySelectorAll<Item>('[data-menu]');

  overlays.forEach((overlay) => overlay.addEventListener('click', () => setOpen(menubar, false)));

  items.forEach((item, index) => {
    const trigger = item.querySelector<Trigger>('[data-menubar-trigger]');
    const content = item.querySelector<Content>('[role="menu"]');
    if (!trigger || !content) return;

    item.setAttribute('data-index', `${index}`);
    trigger.setAttribute('tabindex', index === 0 ? '0' : '-1');

    trigger.addEventListener('click', () => setOpen(menubar));
    trigger.addEventListener('mouseover', () => {
      if (menubar.dataset.open === 'true' && item.dataset.open === 'false')
        setItemOpen(menubar, item);
    });
  });

  menubar.addEventListener('keydown', (event) => {
    // prettier-ignore
    switch (event.key) {
      case 'ArrowRight': case 'Right': return onArrowRight(event, menubar, items);
      case 'ArrowLeft': case 'Left': return onArrowLeft(event,  menubar, items);
      case 'Home': case 'PageUp': return onHomeOrPageUp(event, menubar, items);
      case 'End': case 'PageDown': return onEndOrPageDown(event, menubar, items);
      case 'Esc': case 'Escape': case 'Enter': case ' ': return setOpen(menubar, false);
      default: return;
    }
  });
});

function getOpenItem(menubar: Menubar) {
  return menubar.querySelector<Item>('[data-menu][data-open="true"]');
}

function getFocusedItemIndex() {
  const trigger = document.activeElement?.closest<Trigger>('[data-menubar-trigger]');
  const item = trigger?.closest<Item>('[data-menu]');
  return Number(item?.dataset.index);
}

function setOpen(menubar: Menubar, override?: boolean) {
  const next = override ?? menubar?.getAttribute('data-open') === 'false';
  menubar?.setAttribute('data-open', `${next}`);
}

function setItemOpen(menubar: Menubar, item: Item) {
  menubar.querySelector<Trigger>('[data-menubar-trigger][aria-expanded=true]')?.click();
  item.querySelector<Trigger>('[data-menubar-trigger]')?.click();
}

// ------------------------ KEYBOARD EVENTS ------------------------ //

function onArrowRight(event: KeyboardEvent, menubar: Menubar, items: Items) {
  event.preventDefault();

  if (menubar.dataset.open === 'true') {
    const next = items.item(Number(getOpenItem(menubar)?.dataset.index) + 1);
    return setItemOpen(menubar, next ?? items.item(0));
  }

  const next = items.item(getFocusedItemIndex() + 1) ?? items.item(0);
  next.querySelector<Trigger>('[data-menubar-trigger]')?.focus();
}

function onArrowLeft(event: KeyboardEvent, menubar: Menubar, items: Items) {
  event.preventDefault();

  if (menubar.dataset.open === 'true') {
    const previous = items.item(Number(getOpenItem(menubar)?.dataset.index) - 1);
    return setItemOpen(menubar, previous ?? items.item(items.length - 1));
  }

  const previous = items.item(getFocusedItemIndex() - 1) ?? items.item(items.length - 1);
  previous.querySelector<Trigger>('[data-menubar-trigger]')?.focus();
}

function onHomeOrPageUp(event: KeyboardEvent, menubar: Menubar, items: Items) {
  event.preventDefault();
  const first = items.item(0);
  if (menubar.dataset.open === 'true') setItemOpen(menubar, first);
  else first.querySelector<Trigger>('[data-menubar-trigger]')?.focus();
}

function onEndOrPageDown(event: KeyboardEvent, menubar: Menubar, items: Items) {
  event.preventDefault();
  const last = items.item(items.length - 1);
  if (menubar.dataset.open === 'true') setItemOpen(menubar, last);
  else last.querySelector<Trigger>('[data-menubar-trigger]')?.focus();
}

// ----------------------------------------------------------------- //
