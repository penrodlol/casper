import { onAstroPageLoad } from '@/libs/astro';

export type Type = 'automatic' | 'manual';

onAstroPageLoad<HTMLDivElement>('[data-tabs]', (component) => {
  const id = component.dataset.tabs;
  const type = component.dataset.type as Type;
  const list = component.querySelector<HTMLDivElement>('[role="tablist"]');
  const panels = component.querySelectorAll<HTMLDivElement>('[role="tabpanel"]');
  const tabs = component.querySelectorAll<HTMLButtonElement>('[role="tab"]');

  tabs?.forEach((tab) => {
    tab.setAttribute('id', `tabs-tab-${id}-${tab.dataset.value}`);
    tab.setAttribute('aria-controls', `tabs-tabpanel-${id}-${tab.dataset.value}`);
  });

  panels?.forEach((panel) => {
    panel.setAttribute('id', `tabs-tabpanel-${id}-${panel.dataset.value}`);
    panel.setAttribute('aria-labelledby', `tabs-tab-${id}-${panel.dataset.value}`);
  });

  list?.addEventListener('click', (event) => {
    const selectedTab = (event.target as HTMLElement).closest<HTMLButtonElement>('[role="tab"]');
    const activeTab = list.querySelector<HTMLButtonElement>('[aria-selected="true"]');
    if (selectedTab && selectedTab !== activeTab) setTab(selectedTab, tabs);
  });

  list?.addEventListener('keydown', (event) => {
    if (/^(ArrowLeft|ArrowRight|Home|End)$/.test(event.key)) event.preventDefault();

    // prettier-ignore
    switch (event.key) {
      case 'ArrowLeft': return setTab((document.activeElement?.previousElementSibling ?? tabs.item(tabs.length - 1)), tabs, type);
      case 'ArrowRight': return setTab((document.activeElement?.nextElementSibling ?? tabs.item(0)), tabs, type);
      case 'Home': return setTab(tabs.item(0), tabs, type);
      case 'End': return setTab(tabs.item(tabs.length - 1), tabs, type);
      default: return;
    }
  });
});

const setTab = (tab: Element, tabs: NodeListOf<HTMLButtonElement>, type?: Type) => {
  if (type === 'manual') return (tab as HTMLButtonElement).focus();

  tabs.forEach((_tab) => {
    _tab.setAttribute('aria-selected', String(_tab === tab));
    _tab.setAttribute('tabindex', String(_tab === tab ? 0 : -1));

    if (_tab === tab) _tab.focus();

    const panel = document.getElementById(_tab.getAttribute('aria-controls') as string);
    panel?.setAttribute('aria-hidden', String(_tab !== tab));
  });
};
