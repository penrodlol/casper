type OpenTrigger = HTMLButtonElement;
type CloseTriggers = NodeListOf<HTMLButtonElement>;

document.addEventListener('astro:page-load', () => {
  (document.querySelectorAll('[data-dialog]') as NodeListOf<HTMLDialogElement>)?.forEach((root) => {
    const openTrigger = root.nextElementSibling as OpenTrigger;
    const closeTriggers = root.querySelectorAll('[slot="dialog-close"]') as CloseTriggers;

    if (openTrigger) openTrigger.onclick = () => root.showModal();

    closeTriggers?.forEach((closeTrigger) => (closeTrigger.onclick = () => root.close()));
  });
});
