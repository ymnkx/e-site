import { matchMediaController } from '@/components/develop/matchMediaController';
import { GlobalNavigationCore } from './GlobalNavigationCore';

type Props = {
  selector: string;
};

export const GlobalNavigation = () => {
  return {
    init: (props: Props) => {
      const { selector } = props;
      const naviList: Array<any> = [];
      const targets: Array<HTMLElement> | null = Array.from(document.querySelectorAll(selector));
      if (targets.length === 0) return;

      targets.forEach((target) => {
        const breakpoint = target.dataset.breakpoint;

        const globalNavi = GlobalNavigationCore();
        naviList.push(globalNavi);
        globalNavi.init({ element: target, type: target.dataset.type, speed: Number(target.dataset.speed) });

        if (breakpoint) {
          matchMediaController().init({
            condition: '(min-width: ' + breakpoint + ')',
            callback: (match) => {
              globalNavi?.disabled(match);
            },
          });
        }
      });

      window.addEventListener(
        'keydown',
        (event) => {
          if (event.defaultPrevented) return;
          if (event.key === 'Esc' || event.key === 'Escape') {
            event.preventDefault();
            naviList.forEach((item) => {
              item.escapeClose();
            });
          }
        },
        true,
      );
    },
  };
};

// 複数のナビがある場合、ESCキーを押した時の対象が絞れない。
//// 「開いてるすべてのナビを閉じる」対応にした。
