import type { Settings } from '@/types/Settings';
import ClassicHeroSlider from '@/components/hero-sections/ClassicHeroSlider';
import CenteredContentSliderHero from '@/components/hero-sections/CenteredContentSliderHero';

export type HeroSliderType =
  | 'left-middle-content-full-image'
  | 'centered-content'
  | 'top-content-full-image'
  | 'bottom-content-full-image';

type Props = {
  type: HeroSliderType;
  slides: Settings['homeSlider'];
  contentPosition?: 'top' | 'center' | 'bottom';
  hideArrows?: boolean;
};

function HeroSection({ type, slides, hideArrows }: Props) {
  switch (type) {
    case 'left-middle-content-full-image':
      return <ClassicHeroSlider slides={slides} />;
    case 'centered-content':
      return (
        <CenteredContentSliderHero
          slides={slides}
          contentPosition={'center'}
          hideArrows={hideArrows}
        />
      );
    case 'top-content-full-image':
      return (
        <CenteredContentSliderHero
          slides={slides}
          contentPosition={'top'}
          hideArrows={hideArrows}
        />
      );
    case 'bottom-content-full-image':
      return (
        <CenteredContentSliderHero
          slides={slides}
          contentPosition={'bottom'}
          hideArrows={hideArrows}
        />
      );
    default:
      return <ClassicHeroSlider slides={slides} />;
  }
}

export default HeroSection;
