import { onAstroPageLoad } from '@/libs/astro';

const controls = 'input,textarea,select,button[role="combobox"]';

onAstroPageLoad<HTMLFormElement>('[data-form]', (form) => {
  form.querySelectorAll<HTMLFieldSetElement>('fieldset').forEach((fieldset) => {
    const legend = fieldset.querySelector<HTMLLegendElement>('legend');
    if (legend) fieldset.setAttribute('aria-labelledby', legend.id);
  });

  form.querySelectorAll<HTMLDivElement>('[data-field]').forEach((field) => {
    const label = field.querySelector<HTMLLabelElement>('label');
    const control = field.querySelector<HTMLElement>(controls);
    const description = field.querySelector<HTMLParagraphElement>('[data-description]');
    if (!label || !control) return;

    label.setAttribute('for', `${form.dataset.form}-${field.dataset.name}`);
    control.setAttribute('id', `${form.dataset.form}-${field.dataset.name}`);
    control.setAttribute('aria-labelledby', label.id);
    if (description) control.setAttribute('aria-describedby', description.id);
  });
});
