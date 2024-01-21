import { onAstroPageLoad } from '@/libs/astro';

type Select = HTMLDivElement;
type Trigger = HTMLButtonElement;
type Overlay = HTMLDivElement;
type OptionsWrapper = HTMLDivElement;
type Option = HTMLDivElement;
type Options = NodeListOf<Option>;
type Targets = {
  select: Select;
  trigger: Trigger;
  overlay: Overlay;
  optionsWrapper: OptionsWrapper;
  options: Options;
};

onAstroPageLoad<Select>('[data-select]', (select) => {
  const id = select.dataset.select as string;
  const trigger = select.querySelector<Trigger>('[role="combobox"]');
  const overlay = select.querySelector<Overlay>('[data-overlay]');
  const optionsWrapper = select.querySelector<OptionsWrapper>('[role="listbox"]');
  const options = select.querySelectorAll<Option>('[role="option"]:not([aria-disabled="true"])');
  if (!trigger || !overlay || !optionsWrapper || !options?.length) return;

  const targets: Targets = { select, trigger, overlay, optionsWrapper, options };

  let searchQuery = '';
  let searchDebouncer!: number;
  const searchCollection = Array.from(options).map((option) => ({
    text: option.textContent?.toLowerCase().trim(),
    element: option,
  }));

  trigger.setAttribute('aria-controls', id);
  trigger.setAttribute('aria-activedescendant', '');
  optionsWrapper.setAttribute('id', id);
  options.forEach((option, index) => {
    option.setAttribute('id', `${id}-${option.dataset.value}`);
    option.setAttribute('data-index', `${index}`);
  });

  overlay.addEventListener('click', () => setOpen(targets, false));

  optionsWrapper.addEventListener('click', (event) => {
    const option = (event.target as HTMLElement).closest<Option>('[role="option"]');
    if (option) setOption(trigger, optionsWrapper, option), setOpen(targets, false);
  });

  trigger.addEventListener('click', () => setOpen(targets));
  trigger.addEventListener('keydown', (event) => {
    if (isSearchKey(event)) {
      if (typeof searchDebouncer === 'number') window.clearTimeout(searchDebouncer);
      searchDebouncer = window.setTimeout(() => (searchQuery = ''), 500);
      searchQuery += event.key.toLowerCase().trim();

      setOpen(targets, true);

      const option = searchCollection.find((option) => option.text?.startsWith(searchQuery));
      if (option) focusOption(optionsWrapper, option.element);

      return;
    }

    // prettier-ignore
    switch (event.key) {
      case 'ArrowUp': return onArrowUp(event, targets);
      case 'ArrowDown': return onArrowDown(event, targets);
      case 'Home': return onHome(event, targets);
      case 'End': return onEnd(event, targets);
      case 'PageUp': return onPageUp(event, targets);
      case 'PageDown': return onPageDown(event, targets);
      case 'Escape': return onEscape(targets);
      case 'Enter': case ' ': return onEnterOrSpace(event, targets);
      default: return;
    }
  });
});

function getActiveOption(select: Select) {
  return select.querySelector<Option>('[aria-selected="true"]');
}

function getFocusedOption(select: Select) {
  return select.querySelector<Option>('[data-focused="true"]');
}

function removeActiveOption(optionsWrapper: OptionsWrapper) {
  optionsWrapper
    .querySelectorAll<Option>('[aria-selected="true"]')
    .forEach((option) => option.setAttribute('aria-selected', 'false'));
}

function removeFocusedOption(optionsWrapper: OptionsWrapper) {
  optionsWrapper
    .querySelectorAll<Option>('[data-focused="true"]')
    .forEach((option) => option.setAttribute('data-focused', 'false'));
}

function setOpen({ select, trigger, optionsWrapper, options }: Targets, override?: boolean) {
  const next = override ?? select.getAttribute('data-open') === 'false';
  select.setAttribute('data-open', `${next}`);

  if (!next) return trigger.setAttribute('aria-activedescendant', '');

  const active = getActiveOption(select);
  if (!active) return focusOption(optionsWrapper, options.item(0));
  trigger.setAttribute('aria-activedescendant', active.id);
  focusOption(optionsWrapper, active);
}

function setOption(trigger: Trigger, optionsWrapper: OptionsWrapper, option: Option) {
  (trigger.firstElementChild as HTMLSpanElement).textContent = option.textContent;
  removeActiveOption(optionsWrapper);
  removeFocusedOption(optionsWrapper);
  option.setAttribute('aria-selected', 'true');
  option.setAttribute('data-focused', 'true');
  option.scrollIntoView({ block: 'nearest' });
}

function focusOption(optionsWrapper: OptionsWrapper, option: Option) {
  removeFocusedOption(optionsWrapper);
  option.setAttribute('data-focused', 'true');
  option.scrollIntoView({ block: 'nearest' });
}

// ------------------------ KEYBOARD EVENTS ------------------------ //

function isSearchKey(event: KeyboardEvent) {
  const notEmpty = event.key.length;
  const notModifier = !event.altKey && !event.ctrlKey && !event.metaKey;
  const navigationKeys = /^Arrow(Up|Down)$|^Home$|^End$|^Page(Up|Down)$/;
  const actionKeys = /^Escape$|^Enter$|^ $/;
  return notEmpty && notModifier && !navigationKeys.test(event.key) && !actionKeys.test(event.key);
}

function onArrowUp(event: KeyboardEvent, targets: Targets) {
  event.preventDefault();

  if (targets.select.dataset.open === 'false') return setOpen(targets, true);
  if (event.altKey) return setOpen(targets, false);

  const focused = getFocusedOption(targets.select)?.dataset.index;
  const previous = focused && targets.options.item(Number(focused) - 1);
  if (previous) focusOption(targets.optionsWrapper, previous);
}

function onArrowDown(event: KeyboardEvent, targets: Targets) {
  event.preventDefault();

  if (targets.select.dataset.open === 'false') return setOpen(targets, true);
  if (event.altKey) return;

  const nextIndex = Number(getFocusedOption(targets.select)?.dataset.index ?? -1) + 1;
  const next = targets.options.item(nextIndex);
  if (next) focusOption(targets.optionsWrapper, next);
}

function onHome(event: KeyboardEvent, targets: Targets) {
  event.preventDefault();
  setOpen(targets, true);
  focusOption(targets.optionsWrapper, targets.options.item(0));
}

function onEnd(event: KeyboardEvent, targets: Targets) {
  event.preventDefault();
  setOpen(targets, true);
  focusOption(targets.optionsWrapper, targets.options.item(targets.options.length - 1));
}

function onPageUp(event: KeyboardEvent, { select, optionsWrapper, options }: Targets) {
  if (select.dataset.open === 'false') return;

  event.preventDefault();

  const focused = getFocusedOption(select)?.dataset.index;
  const previous = focused && (options.item(Number(focused) - 10) ?? options.item(0));
  if (previous) focusOption(optionsWrapper, previous);
}

function onPageDown(event: KeyboardEvent, { select, optionsWrapper, options }: Targets) {
  if (select.dataset.open === 'false') return;

  event.preventDefault();
  const next = options.item(Number(getFocusedOption(select)?.dataset.index ?? 0) + 10);
  focusOption(optionsWrapper, next ?? options.item(options.length - 1));
}

function onEscape(targets: Targets) {
  if (targets.select.dataset.open === 'true') setOpen(targets, false);
}

function onEnterOrSpace(event: KeyboardEvent, targets: Targets) {
  event.preventDefault();

  if (targets.select.dataset.open === 'false') return setOpen(targets, true);

  const focused = getFocusedOption(targets.select);
  if (focused) setOption(targets.trigger, targets.optionsWrapper, focused);
  setOpen(targets, false);
}

// --------------------------------------------------------------------- //
