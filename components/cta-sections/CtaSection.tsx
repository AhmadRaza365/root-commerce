import { CtaContent } from '@/types/Settings';
import ClassicContentImageBackgroundCta from './ClassicContentImageBackgroundCta';

type Props = {
  content?: CtaContent;
  type?:
    | 'classic-centered-top'
    | 'classic-centered-center'
    | 'classic-centered-bottom'
    | 'classic-left-top'
    | 'classic-left-center'
    | 'classic-left-bottom'
    | 'classic-right-top'
    | 'classic-right-center'
    | 'classic-right-bottom';
};

function CtaSection({ content, type }: Props) {
  switch (type) {
    case 'classic-centered-top':
      return (
        <ClassicContentImageBackgroundCta
          content={content}
          contentPosition="center"
          contentAlignment="top"
        />
      );
    case 'classic-centered-center':
      return (
        <ClassicContentImageBackgroundCta
          content={content}
          contentPosition="center"
          contentAlignment="center"
        />
      );
    case 'classic-centered-bottom':
      return (
        <ClassicContentImageBackgroundCta
          content={content}
          contentPosition="center"
          contentAlignment="bottom"
        />
      );

    case 'classic-left-top':
      return (
        <ClassicContentImageBackgroundCta
          content={content}
          contentPosition="left"
          contentAlignment="top"
        />
      );
    case 'classic-left-center':
      return (
        <ClassicContentImageBackgroundCta
          content={content}
          contentPosition="left"
          contentAlignment="center"
        />
      );
    case 'classic-left-bottom':
      return (
        <ClassicContentImageBackgroundCta
          content={content}
          contentPosition="left"
          contentAlignment="bottom"
        />
      );
    case 'classic-right-top':
      return (
        <ClassicContentImageBackgroundCta
          content={content}
          contentPosition="right"
          contentAlignment="top"
        />
      );
    case 'classic-right-center':
      return (
        <ClassicContentImageBackgroundCta
          content={content}
          contentPosition="right"
          contentAlignment="center"
        />
      );
    case 'classic-right-bottom':
      return (
        <ClassicContentImageBackgroundCta
          content={content}
          contentPosition="right"
          contentAlignment="bottom"
        />
      );
    default:
      return (
        <ClassicContentImageBackgroundCta
          content={content}
          contentPosition="center"
          contentAlignment="center"
        />
      );
  }
}

export default CtaSection;
