import { onAstroPageLoad } from '@/libs/astro';

export type Type = 'single' | 'multiple';

onAstroPageLoad<HTMLDivElement>('[data-accordion]', (root) => {
  const triggers = Array.from(root.querySelectorAll<HTMLHeadingElement>('[data-for]'));
  const contents = Array.from(root.querySelectorAll<HTMLDivElement>('[data-value]'));

  triggers.forEach((trigger, index) => {
    const triggerBtn = getTriggerBtn(trigger);
    const content = contents.find((content) => trigger.dataset.for === content.dataset.value);
    if (!triggerBtn || !content) return;

    trigger.setAttribute('id', `trigger-${root.dataset.accordion}-${trigger.dataset.for}`);
    content.setAttribute('id', `content-${root.dataset.accordion}-${trigger.dataset.for}`);
    triggerBtn.setAttribute('aria-controls', content.id);
    content.setAttribute('aria-labelledby', trigger.id);

    trigger.addEventListener('click', () => {
      const activeTriggerBtn = root.querySelector<HTMLButtonElement>('[aria-expanded="true"]');
      const isNotActiveTriggerBtn = activeTriggerBtn !== triggerBtn;
      if (root.dataset.type === 'single' && isNotActiveTriggerBtn) collapseAll(triggers, contents);
      toggle(triggerBtn, content);
    });

    trigger.addEventListener('keydown', (event) => {
      if (/^(ArrowDown|ArrowUp|Home|End)$/.test(event.key)) event.preventDefault();
      // prettier-ignore
      switch (event.key) {
        case 'ArrowUp': return (getTriggerBtn(triggers[index - 1]) ?? getTriggerBtn(triggers[triggers.length - 1])).focus();
        case 'ArrowDown':  return (getTriggerBtn(triggers[index + 1]) ?? getTriggerBtn(triggers[0])).focus();
        case 'Home': return getTriggerBtn(triggers[0]).focus();
        case 'End': return getTriggerBtn(triggers[triggers.length - 1]).focus();
        default: return;
      }
    });
  });
});

function getTriggerBtn(trigger?: HTMLHeadingElement) {
  return trigger?.firstElementChild as HTMLButtonElement;
}

function toggle(triggerBtn: HTMLButtonElement, content: HTMLDivElement) {
  const expanded = triggerBtn.getAttribute('aria-expanded') === 'true';
  triggerBtn.setAttribute('aria-expanded', String(!expanded));
  content.setAttribute('aria-hidden', String(expanded));
}

function collapseAll(triggers: Array<HTMLHeadingElement>, contents: Array<HTMLDivElement>) {
  triggers.forEach((trigger) => trigger.firstElementChild?.setAttribute('aria-expanded', 'false'));
  contents.forEach((content) => content.setAttribute('aria-hidden', 'true'));
}
