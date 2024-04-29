import { smoothScroll } from '@/components/develop/smoothScroll';

type Props = {
  selector: string;
  limit?: string;
  fixedClassName?: string;
  showClassName?: string;
};

export const ScrollTopButton = () => {
  const elements: {
    topElement: Element | null;
    buttonElement: Element | null;
    moveElement: Element | null;
  } = {
    topElement: null,
    buttonElement: null,
    moveElement: null,
  };
  // const states = {};
  const options = {
    limitPosition: '10%',
    fixedClass: '-fixed',
    showClass: '-show',
  };

  const checkFixPosition = () => {
    if (!elements.topElement || !elements.moveElement) return;
    const observerOption = {
      root: null,
      rootMargin: '0px 0px',
      threshold: 0,
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          elements.moveElement?.classList.remove(options.fixedClass);
        } else {
          elements.moveElement?.classList.add(options.fixedClass);
        }
      });
    }, observerOption);
    observer.observe(elements.topElement);
  };

  const checkShowPosition = () => {
    const target = document.querySelector('body');
    const observerOption = {
      root: null,
      rootMargin: '10%',
      threshold: [1],
    };
    const callback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          elements.moveElement?.classList.remove(options.showClass);
        } else {
          elements.moveElement?.classList.add(options.showClass);
        }
      });
    };
    const observer = new IntersectionObserver(callback, observerOption);
    if (target) observer.observe(target);
  };

  const onClickHandler = () => {
    elements.buttonElement?.addEventListener('click', () => {
      smoothScroll(0);
    });
  };

  return {
    init: (props: Props) => {
      const { selector, limit, fixedClassName, showClassName } = props;
      if (!selector) return;
      elements.topElement = document.querySelector(selector);
      if (!elements.topElement) {
        console.log(`${selector}のElementがありません`);
        return;
      }
      elements.moveElement = elements.topElement.querySelector('[data-role="move"]');
      if (!elements.moveElement) {
        console.log(`${selector}に[data-role="move"]のElementがありません`);
        return;
      }
      elements.buttonElement = elements.topElement.querySelector('[data-role="button"]');
      if (!elements.buttonElement) {
        console.log(`${selector}に[data-role="button"]のElementがありません`);
        return;
      }

      if (limit) options.limitPosition = limit;
      if (fixedClassName) options.fixedClass = fixedClassName;
      if (showClassName) options.showClass = showClassName;

      checkFixPosition();
      checkShowPosition();
      onClickHandler();
    },
  };
};
