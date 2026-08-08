export interface Settings {
  ticker: {
    show: boolean;
    text: string;
    duration: number;
  };
  homeSlider: {
    heading: string;
    text: string;
    image: string;
    buttonText: string;
    buttonLink: string;
  }[];
}

export interface CtaContent {
  backgroundImage?: string;
  heading?: string;
  description?: string;
  buttons?: Array<{
    text: string;
    link: string;
  }>;
}
