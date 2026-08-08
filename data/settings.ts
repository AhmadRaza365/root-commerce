import { Settings } from '@/types/Settings';

export const SETTINGS: Settings = {
  ticker: {
    show: true,
    text: 'RootCommerce Free Template',
    duration: 60,
  },
  homeSlider: [
    {
      heading: 'Slide 1 Heading',
      text: 'Slide 1 description',
      image: '/images/slidebg.jpg',
      buttonText: 'Shop Now',
      buttonLink: '/shop',
    },
    {
      heading: 'Slide 2 Heading',
      text: 'Slide 2 description',
      image: '/images/slidebg.jpg',
      buttonText: 'GO Somewhere',
      buttonLink: '/shop',
    },
  ],
};
