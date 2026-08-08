import { CtaContent } from '@/types/Settings';
import Image from 'next/image';
import Link from 'next/link';

type Props = {
  content?: CtaContent;
  contentPosition?: 'left' | 'right' | 'center';
  contentAlignment?: 'top' | 'center' | 'bottom';
};

function ClassicContentImageBackgroundCta({
  content,
  contentAlignment = 'center',
  contentPosition = 'center',
}: Props) {
  const { backgroundImage, buttons, description, heading } = content ?? {};

  const buttonsStyles = ['btn btn-soft', 'btn btn-outline', 'btn btn-link'];

  return (
    <section className="w-full relative h-full min-h-[80vh] bg-base-300 flex items-center justify-center">
      {backgroundImage && (
        <Image
          src={backgroundImage}
          alt="Cta Bg image"
          fill
          className="object-cover object-center"
        />
      )}

      {!!(heading || description || (buttons && buttons?.length > 0)) && (
        <section
          className={`absolute z-2 inset-0 bg-base-content/40 text-base-100 flex flex-col gap-3 px-5 sm:px-8 2xl:px-16 py-14 xl:py-14 ${
            contentPosition === 'left'
              ? 'items-start'
              : contentPosition === 'right'
                ? 'items-end'
                : 'items-center'
          } ${
            contentAlignment === 'top'
              ? 'justify-start'
              : contentAlignment === 'bottom'
                ? 'justify-end'
                : 'justify-center'
          }`}
        >
          {heading && (
            <h2
              className={`text-base-100 text-4xl font-medium font-secondary w-fit ${
                contentPosition === 'left'
                  ? 'text-start'
                  : contentPosition === 'right'
                    ? 'text-end'
                    : 'text-center'
              }`}
            >
              {heading}
            </h2>
          )}
          {description && (
            <p
              className={`text-base-100 text-lg font-normal w-fit ${
                contentPosition === 'left'
                  ? 'text-start'
                  : contentPosition === 'right'
                    ? 'text-end'
                    : 'text-center'
              }`}
            >
              {' '}
              {description}
            </p>
          )}
          {buttons && (
            <section
              className={`flex items-center gap-3 ${
                contentPosition === 'left'
                  ? 'items-start'
                  : contentPosition === 'right'
                    ? 'items-end'
                    : 'items-center'
              }`}
            >
              {buttons?.map((button, index) => {
                return (
                  <Link
                    key={index}
                    href={button.link}
                    className={buttonsStyles[index % buttonsStyles.length]}
                  >
                    {button.text}
                  </Link>
                );
              })}
            </section>
          )}
        </section>
      )}
    </section>
  );
}

export default ClassicContentImageBackgroundCta;
