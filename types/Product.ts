export interface Variant {
  id: string;
  extraPrice: number; // Extra price on top of the base price
  isOutOfStock: boolean;
  option1?: {
    name: string;
    value: string;
  };
  option2?: {
    name: string;
    value: string;
  };
  option3?: {
    name: string;
    value: string;
  };
}
export interface ProductCategory {
  uuid: string;
  name: string;
  slug: string;
  image: string;
  createdAt?: string;
  showNewTag?: boolean;
}

export interface Product {
  uuid: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  basePrice: number;
  discountPrice?: number;
  isOnSale: boolean;
  showIsNew: boolean;
  images: string[];
  isOutOfStock: boolean;
  variants: Variant[];
  category: string[];
  createdAt?: string;
  sku?: string;
  sizeChart?: string;
}

export interface CartProduct {
  id: string;
  product: Product;
  quantity: number;
  selectedVariant: Variant | null;
}

export const emptyProduct: Product = {
  uuid: '',
  title: '',
  slug: '',
  shortDescription: '',
  description: '',
  basePrice: 0,
  discountPrice: 0,
  isOnSale: false,
  showIsNew: false,
  images: [],
  isOutOfStock: false,
  variants: [],
  category: [],
  sku: '',
};
