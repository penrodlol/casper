import { getChildComponents, onComponentLoad } from '@/libs/component';

export type Type = 'single' | 'multiple';
type Item = HTMLButtonElement;

onComponentLoad<HTMLDivElement>('[data-toggle-group]', (toggle) => {
  const type = toggle.dataset.type as Type;
  const items = getChildComponents<Item>(toggle, '[data-toggle-item]');
  items.forEach((item) => (item.onclick = () => setToggleItem(item, items, type)));
});

function setToggleItem(item: Item, items: Array<Item>, type: Type) {
  const state = item.getAttribute('aria-pressed') === 'true';
  item.setAttribute('aria-pressed', state ? 'false' : 'true');
  if (type === 'multiple') return;

  items.forEach((_item) => _item !== item && _item.setAttribute('aria-pressed', 'false'));
}
