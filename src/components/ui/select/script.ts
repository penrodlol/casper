document.addEventListener('astro:page-load', () => {
  (document.querySelectorAll('[data-select]') as NodeListOf<HTMLElement>).forEach((root) => {
    const trigger = root.querySelector('[role="combobox"]') as HTMLButtonElement;
    const triggerValue = root.querySelector('[data-trigger-value]') as HTMLSpanElement;
    const portal = root.querySelector('[role="listbox"]') as HTMLUListElement;
    const options = Array.from(root.querySelectorAll('[role="option"]')) as Array<HTMLLIElement>;
    const search = root.querySelector('[data-select-search]') as HTMLInputElement;
    if (!trigger || !triggerValue || !portal || !options) return;

    const id = root.dataset.select as string;
    const open = root.dataset.selectOpen as string;

    trigger.setAttribute('aria-expanded', open);
    trigger.setAttribute('aria-controls', `select-portal-${id}`);
    portal.setAttribute('id', `select-portal-${id}`);
    portal.setAttribute('aria-activedescendant', '');

    trigger.onclick = () => {
      const state = root.getAttribute('data-select-open') === 'true';
      root.setAttribute('data-select-open', state ? 'false' : 'true');

      const active = options.find((option) => option.getAttribute('aria-selected') === 'true');
      portal.setAttribute('aria-activedescendant', !state && active ? active.id : '');

      if (state && search) {
        search.value = '';
        options.forEach((option) => option.setAttribute('aria-hidden', 'false'));
      }
    };

    options.forEach((option) => {
      const optionId = `select-option-${id}-${option.dataset.value}`;

      option.setAttribute('id', optionId);
      option.onclick = () => {
        root.setAttribute('data-select-open', 'false');
        portal.setAttribute('aria-activedescendant', '');
        trigger.setAttribute('aria-expanded', 'false');
        triggerValue.innerText = option.innerText.trim();
        options.forEach((_option) => {
          const state = _option.dataset.value === option.dataset.value;
          _option.setAttribute('aria-selected', state.toString());
        });
      };
    });

    search.oninput = (event) => {
      const value = (event.target as HTMLInputElement).value.toLowerCase().trim();
      options.forEach((option) => {
        const state = option.innerText.toLowerCase().trim().includes(value);
        option.setAttribute('aria-hidden', (!state).toString());
      });
    };
  });
});
