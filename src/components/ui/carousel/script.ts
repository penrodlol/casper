import { onAstroPageLoad } from '@/libs/astro';

export type Orientation = 'horizontal' | 'vertical';
type SlidesWrapper = HTMLUListElement;
type Slide = HTMLLIElement;

onAstroPageLoad<HTMLDivElement>('[data-carousel]', (carousel) => {
  const slidesWrapper = carousel.querySelector<SlidesWrapper>('ul');
  const slides = slidesWrapper?.querySelectorAll<Slide>('li');
  const prevTrigger = carousel.querySelector<HTMLButtonElement>('button[aria-label="Previous"]');
  const nextTrigger = carousel.querySelector<HTMLButtonElement>('button[aria-label="Next"]');
  if (!slidesWrapper || !slides || !prevTrigger || !nextTrigger) return;

  const autoPlay = carousel.dataset.autoplay === 'true';
  const orientation = carousel.dataset.orientation as Orientation;
  const loop = carousel.dataset.loop === 'true';
  const width = slides.item(0).getBoundingClientRect().width;

  if (slides.length === 1) (prevTrigger.disabled = true), (nextTrigger.disabled = true);
  else if (!loop) prevTrigger.disabled = true;

  prevTrigger.setAttribute('aria-controls', slidesWrapper.id);
  nextTrigger.setAttribute('aria-controls', slidesWrapper.id);
  slidesWrapper.setAttribute('aria-live', autoPlay ? 'off' : 'polite');
  slides.item(0).setAttribute('data-state', 'active');
  slides.forEach((slide, index) => {
    slide.setAttribute('aria-label', `Slide ${index + 1} of ${slides.length}`);
    if (orientation === 'horizontal') slide.style.left = `${width * index}px`;
    else slide.style.top = `${width * index}px`;
  });

  prevTrigger.addEventListener('click', () => {
    const currentSlide = getCurrentSlide(slidesWrapper);
    const prevSlide = getPrevSlide(slidesWrapper, currentSlide, loop);
    if (autoPlayCallback) clearInterval(autoPlayCallback);
    if (prevSlide) setSlide(slidesWrapper, currentSlide, prevSlide, orientation);

    nextTrigger.disabled = false;
    if (!loop && !prevSlide?.previousElementSibling) prevTrigger.disabled = true;
  });

  nextTrigger.addEventListener('click', () => {
    const currentSlide = getCurrentSlide(slidesWrapper);
    const nextSlide = getNextSlide(slidesWrapper, currentSlide, loop);
    if (autoPlayCallback) clearInterval(autoPlayCallback);
    if (nextSlide) setSlide(slidesWrapper, currentSlide, nextSlide, orientation);

    prevTrigger.disabled = false;
    if (!loop && !nextSlide?.nextElementSibling) nextTrigger.disabled = true;
  });

  let autoPlayCallback: NodeJS.Timeout | undefined;
  if (autoPlay) {
    autoPlayCallback = setInterval(() => {
      const currentSlide = getCurrentSlide(slidesWrapper);
      const nextSlide = getNextSlide(slidesWrapper, currentSlide, true);
      if (nextSlide) setSlide(slidesWrapper, currentSlide, nextSlide, orientation);

      prevTrigger.disabled = false;
      nextTrigger.disabled = false;
    }, Number(carousel.dataset.autoplayInterval));
  }
});

function getCurrentSlide(wrapper: SlidesWrapper) {
  return wrapper.querySelector('[data-state="active"]') as Slide;
}

function getNextSlide(wrapper: SlidesWrapper, current: Slide, loop: boolean) {
  if (!loop) return current.nextElementSibling as Slide | undefined;
  return (current?.nextElementSibling ?? wrapper.firstElementChild) as Slide;
}

function getPrevSlide(wrapper: SlidesWrapper, current: Slide, loop: boolean) {
  if (!loop) return current.previousElementSibling as Slide | undefined;
  return (current.previousElementSibling ?? wrapper.lastElementChild) as Slide;
}

function setSlide(wrapper: SlidesWrapper, current: Slide, target: Slide, orientation: Orientation) {
  const position = orientation === 'horizontal' ? target.style.left : target.style.top;
  const axis = orientation === 'horizontal' ? 'X' : 'Y';
  current.setAttribute('data-state', 'inactive');
  target.setAttribute('data-state', 'active');
  wrapper.style.transform = `translate${axis}(-${position})`;
}
