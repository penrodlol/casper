import { onAstroPageLoad } from '@/libs/astro';

export type Type = 'single' | 'multiple';
type Item = HTMLButtonElement;

onAstroPageLoad<HTMLDivElement>('[data-toggle-group]', (toggle) => {
  const type = toggle.dataset.type as Type;
  const items = Array.from(toggle.querySelectorAll<Item>('[data-toggle-item]'));
  items.forEach((item) => (item.onclick = () => setToggleItem(item, items, type)));
});

function setToggleItem(item: Item, items: Array<Item>, type: Type) {
  const state = item.getAttribute('aria-pressed') === 'true';
  item.setAttribute('aria-pressed', state ? 'false' : 'true');
  if (type === 'multiple') return;

  items.forEach((_item) => _item !== item && _item.setAttribute('aria-pressed', 'false'));
}
