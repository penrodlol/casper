import { getChildComponents, onComponentLoad } from '@/libs/component';

type Tab = HTMLButtonElement;

onComponentLoad<HTMLDivElement>('[data-tabs]', (component) => {
  const id = component.dataset.tabs;
  const tabs = getChildComponents<Tab>(component, '[role="tab"]');
  const tabPanels = getChildComponents<HTMLDivElement>(component, '[role="tabpanel"]');

  tabs?.forEach((tab, index) => {
    tab.setAttribute('id', `tabs-tab-${id}-${tab.dataset.value}`);
    tab.setAttribute('aria-controls', `tabs-tabpanel-${id}-${tab.dataset.value}`);
    tab.onclick = () => setTab(tabs, tab, false);
    tab.onkeydown = (event) => onKeyDown(tabs, index, event);
  });

  tabPanels?.forEach((tabPanel) => {
    tabPanel.setAttribute('id', `tabs-tabpanel-${id}-${tabPanel.dataset.value}`);
    tabPanel.setAttribute('aria-labelledby', `tabs-tab-${id}-${tabPanel.dataset.value}`);
  });
});

function setTab(tabs: Array<Tab>, tab: Tab, focus = true) {
  tabs.forEach((_tab) => {
    const tabPanel = document.querySelector(`#${_tab.getAttribute('aria-controls')}`);
    if (!tabPanel) return;

    if (tab.id === _tab.id) {
      _tab.setAttribute('aria-selected', 'true');
      _tab.removeAttribute('tabindex');
      if (focus) _tab.focus();
      tabPanel.setAttribute('data-selected', 'true');
    } else {
      _tab.setAttribute('aria-selected', 'false');
      _tab.setAttribute('tabindex', '-1');
      tabPanel.setAttribute('data-selected', 'false');
    }
  });
}

function onKeyDown(tabs: Array<Tab>, index: number, event: KeyboardEvent) {
  if (/^(ArrowLeft|ArrowRight|Home|End)$/.test(event.key)) event.preventDefault();

  // prettier-ignore
  switch (event.key) {
    case 'ArrowLeft': return setTab(tabs, (tabs[index - 1] ?? tabs[tabs.length - 1]) as Tab);
    case 'ArrowRight': return setTab(tabs, (tabs[index + 1] ?? tabs[0]) as Tab);
    case 'Home': return setTab(tabs, tabs[0] as Tab);
    case 'End': return setTab(tabs, tabs[tabs.length - 1] as Tab);
    default: return;
  }
}
