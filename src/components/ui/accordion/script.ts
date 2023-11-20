type Header = HTMLButtonElement;
type Panel = HTMLDivElement;

document.addEventListener('astro:page-load', () => {
  (document.querySelectorAll('[data-accordion]') as NodeListOf<HTMLDivElement>)?.forEach((root) => {
    const id = root.dataset.accordion as string;
    const type = root.dataset.accordionType as 'single' | 'multiple';
    const headers = Array.from(root.querySelectorAll('[data-accordion-header]')) as Array<Header>;

    headers.forEach((header) => {
      const headerId = header.dataset.accordionHeader as string;
      const panel = document.querySelector(`[data-accordion-panel="${headerId}"]`) as Panel;
      if (!panel) return;

      header.id = `accordion-header-${id}-${headerId}`;
      panel.id = `accordion-panel-${id}-${headerId}`;
      header.setAttribute('aria-controls', panel.id);
      panel.setAttribute('aria-labelledby', header.id);

      header.onclick = () => {
        toggle(header, panel);
        if (type === 'single')
          headers
            .filter((_header) => _header.id !== header.id)
            .forEach((_header) => {
              const headerId = _header.dataset.accordionHeader as string;
              const panel = document.querySelector(`[data-accordion-panel="${headerId}"]`) as Panel;
              if (panel) toggle(_header, panel, false);
            });
      };

      header.onkeydown = (event) => {
        if (/^(ArrowDown|ArrowUp|Home|End)$/.test(event.key)) event.preventDefault();

        // prettier-ignore
        switch (event.key) {
          case 'ArrowDown': return (headers[headers.indexOf(header) + 1] ?? headers[0])?.focus();
          case 'ArrowUp': return (headers[headers.indexOf(header) - 1] ?? headers[headers.length - 1])?.focus();
          case 'Home': return headers[0]?.focus();
          case 'End': return headers[headers.length - 1]?.focus();
          default: return;
        }
      };
    });
  });
});

function toggle(header: Header, panel: Panel, override?: boolean) {
  const state = String(override ?? header.getAttribute('aria-expanded') !== 'true');
  const height = panel.firstElementChild?.getBoundingClientRect().height;

  header.ariaExpanded = state;
  panel.dataset.accordionExpanded = state;
  panel.style.setProperty('--expansion-height', `${height}px`);
}
