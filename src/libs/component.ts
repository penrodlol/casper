export type Component = HTMLElement;

export const onComponentLoad = <T extends Component>(
  selector: string,
  callback: (component: T, event: Event) => void,
) =>
  document.addEventListener('astro:page-load', (event) => {
    const components = document.querySelectorAll(selector) as NodeListOf<T> | undefined;
    components?.forEach((component) => callback(component, event));
  });

export const getChildComponent = <T extends Component>(component: Component, selector: string) =>
  component.querySelector<T>(selector);

export const getChildComponents = <T extends Component>(component: Component, selector: string) =>
  Array.from(component.querySelectorAll<T>(selector));
