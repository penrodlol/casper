type Tab = HTMLButtonElement;
type Tabs = NodeListOf<Tab>;

document.addEventListener('astro:page-load', () => {
  (document.querySelectorAll('[data-tabs]') as NodeListOf<HTMLDivElement>)?.forEach((root) => {
    const tabs = root.querySelectorAll('[role="tab"]') as Tabs;
    const tabPanels = root.querySelectorAll('[role="tabpanel"]') as NodeListOf<HTMLDivElement>;

    tabs?.forEach((tab, index) => {
      tab.setAttribute('id', `tabs-tab-${root.dataset.tabs}-${index}`);
      tab.setAttribute('aria-controls', `tabs-tabpanel-${root.dataset.tabs}-${index}`);
      tab.onclick = () => setTab(tabs, tab, false);
      tab.onkeydown = (event) => onKeyDown(tabs, index, event);
    });

    tabPanels?.forEach((tabPanel, index) => {
      tabPanel.setAttribute('id', `tabs-tabpanel-${root.dataset.tabs}-${index}`);
      tabPanel.setAttribute('aria-labelledby', `tabs-tab-${root.dataset.tabs}-${index}`);
    });
  });
});

function setTab(tabs: Tabs, tab: Tab, focus = true) {
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

function onKeyDown(tabs: Tabs, index: number, event: KeyboardEvent) {
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
