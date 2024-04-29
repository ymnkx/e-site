import { ScrollController } from '@/components/develop/scrollController';
import { getEasingFunction } from '@/components/develop/getEasingFunction';
const _scrollController = ScrollController();

type Props = {
  element: Element | null;
  speed?: number;
  easing?: string;
};

export const GlobalNavigationCore = () => {
  const elements: {
    top: Element | null;
    bg: Element | null;
    openButton: HTMLElement | null;
    closeButton: HTMLElement | null;
    navi: Element | null;
  } = {
    top: null,
    bg: null,
    openButton: null,
    closeButton: null,
    navi: null,
  };

  const states = {
    isOpen: false,
    isMoving: false,
    isDisabled: false,
  };

  const options = {
    speed: 300,
    easing: getEasingFunction('easeOutCirc'),
    disabledClass: '-disabled',
  };

  const baseSetting = {
    easing: options.easing,
    duration: options.speed,
  };

  const getState = () => {
    return {
      start: { opacity: 0, transform: 'scale(1.2)' },
      end: { opacity: 1, transform: 'scale(1)' },
    };
  };

  const closeEnd = () => {
    states.isOpen = false;
    states.isMoving = false;
    _scrollController.release();
    elements.bg?.setAttribute('aria-hidden', 'true');
    if (!states.isDisabled) elements.navi?.setAttribute('aria-hidden', 'true');
    elements.openButton?.focus();
  };

  const close = () => {
    states.isMoving = true;

    elements.top?.setAttribute('aria-expanded', 'false');
    elements.navi?.animate([]).cancel();
    elements.navi?.animate([getState().end, getState().start], baseSetting);

    elements.bg?.animate([]).cancel();
    const bg = elements.bg?.animate([getState().end, getState().start], baseSetting);
    if (bg)
      bg.onfinish = () => {
        closeEnd();
      };
  };

  const open = () => {
    states.isMoving = true;
    states.isOpen = true;
    _scrollController.lock();

    elements.top?.setAttribute('aria-expanded', 'true');
    elements.navi?.setAttribute('aria-hidden', 'false');
    elements.navi?.animate([getState().start, getState().end], baseSetting);

    elements.bg?.setAttribute('aria-hidden', 'false');
    const bg = elements.bg?.animate([getState().start, getState().end], baseSetting);
    if (bg)
      bg.onfinish = () => {
        states.isMoving = false;
      };
  };

  const onClickHandler = () => {
    if (states.isMoving || states.isDisabled) return;
    if (states.isOpen) {
      close();
    } else {
      open();
    }
  };

  const setAccesibility = () => {
    elements.navi?.querySelector('[data-role="trap"]')?.addEventListener('focus', () => {
      elements.closeButton?.focus();
    });
  };

  return {
    init: (props: Props) => {
      const { element, speed, easing } = props;
      if (!element) return;
      if (speed) {
        options.speed = speed;
        baseSetting.duration = options.speed;
      }
      // anime.jsをどうするか決めたら設定する。
      if (easing) {
        options.easing = easing;
        baseSetting.easing = options.easing;
      }

      elements.top = element;
      if (!elements.top) return;

      elements.openButton = elements.top.querySelector('[data-role="open"]');
      if (!elements.openButton) {
        console.log(`[data-role="open"]のElementがありません`);
        return;
      }
      elements.closeButton = elements.top.querySelector('[data-role="close"]');
      if (!elements.closeButton) {
        console.log(`[data-role="close"]のElementがありません`);
        return;
      }
      elements.navi = elements.top.querySelector('[data-role="navi"]');
      if (!elements.navi) {
        console.log(`[data-role="navi"]のElementがありません`);
        return;
      }
      elements.bg = elements.top.querySelector('[data-role="bg"]');
      if (!elements.bg) {
        console.log(`[data-role="bg"]のElementがありません`);
        return;
      }

      const samePageLinks = Array.from(elements.navi.querySelectorAll('a[href^="#"]'));
      if (samePageLinks && samePageLinks.length > 0) {
        samePageLinks.forEach((link) => {
          link.addEventListener('click', () => {
            if (!states.isDisabled && states.isOpen) close();
          });
        });
      }

      elements.openButton.addEventListener('click', onClickHandler);
      [elements.bg, elements.closeButton].forEach((element) => {
        element.addEventListener('click', onClickHandler);
      });

      setAccesibility();
      _scrollController.init();
    },
    disabled: (check: boolean) => {
      states.isDisabled = check;
      elements.top?.setAttribute('aria-expanded', 'false');
      elements.top?.classList.toggle(options.disabledClass, states.isDisabled);
      if (states.isDisabled && states.isOpen) {
        closeEnd();
      }
      elements.navi?.setAttribute('aria-hidden', String(!states.isDisabled));
    },
    escapeClose: () => {
      if (!states.isDisabled && states.isOpen) close();
    },
  };
};
