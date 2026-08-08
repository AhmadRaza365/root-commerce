import { siteData } from '@/data/siteData';

export const formatPrice = (price: number) => {
  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
  });

  return `${siteData.currency} ${formatter.format(price)}`;
};
