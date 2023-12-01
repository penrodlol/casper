import { getChildComponents, onComponentLoad } from '@/libs/component';

type OpenTrigger = HTMLButtonElement;
type CloseTrigger = HTMLButtonElement;

onComponentLoad<HTMLDialogElement>('[data-dialog]', (dialog) => {
  const openTrigger = dialog.nextElementSibling as OpenTrigger;
  const closeTriggers = getChildComponents<CloseTrigger>(dialog, '[slot="dialog-close"]');

  if (openTrigger) openTrigger.onclick = () => dialog.showModal();

  closeTriggers?.forEach((closeTrigger) => (closeTrigger.onclick = () => dialog.close()));
});
