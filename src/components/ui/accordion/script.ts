import { getChildComponents, onComponentLoad } from '@/libs/component';

export type Type = 'single' | 'multiple';
export type Trigger = HTMLButtonElement;
export type Content = HTMLDivElement;

onComponentLoad<HTMLDivElement>('[data-accordion]', (accordion) => {
  const triggers = getChildComponents<Trigger>(accordion, '[data-trigger]');
  const contents = getChildComponents<Content>(accordion, '[data-content]');

  triggers.forEach((trigger) => {
    const triggerId = trigger.dataset.trigger as string;
    const content = contents.find((content) => content.dataset.content === triggerId);
    if (!content) return;

    content.setAttribute('id', `accordion-panel-${accordion.dataset.accordion}-${triggerId}`);
    content.setAttribute('aria-controls', content.id);
    content.setAttribute('aria-labelledby', trigger.id);
    trigger.setAttribute('id', `accordion-header-${accordion.dataset.accordion}-${triggerId}`);
    trigger.onclick = () => onTriggerClick(trigger, contents, accordion.dataset.type as Type);
    trigger.onkeydown = (event) => onTriggerKeyDown(event, trigger, triggers);
  });
});

const onTriggerClick = (trigger: Trigger, contents: Array<Content>, type: Type) => {
  contents.forEach((content) => {
    if (trigger.dataset.trigger === content.dataset.content) toggle(trigger, content);
    else if (type === 'single') {
      const _trigger = document.querySelector(`[data-trigger="${content.dataset.content}"]`);
      if (_trigger) toggle(_trigger as HTMLButtonElement, content, false);
    }
  });
};

const onTriggerKeyDown = (event: KeyboardEvent, trigger: Trigger, triggers: Array<Trigger>) => {
  if (/^(ArrowDown|ArrowUp|Home|End)$/.test(event.key)) event.preventDefault();
  // prettier-ignore
  switch (event.key) {
    case 'ArrowDown': return (triggers[triggers.indexOf(trigger) + 1] ?? triggers[0])?.focus();
    case 'ArrowUp': return (triggers[triggers.indexOf(trigger) - 1] ?? triggers[triggers.length - 1])?.focus();
    case 'Home': return triggers[0]?.focus();
    case 'End': return triggers[triggers.length - 1]?.focus();
    default: return;
  }
};

const toggle = (trigger: HTMLButtonElement, content: HTMLDivElement, override?: boolean) => {
  const state = String(override ?? trigger.getAttribute('aria-expanded') !== 'true');
  const height = content.firstElementChild?.getBoundingClientRect().height;

  trigger.setAttribute('aria-expanded', state);
  content.setAttribute('data-expanded', state);
  content.style.setProperty('--expansion-height', `${height}px`);
};
