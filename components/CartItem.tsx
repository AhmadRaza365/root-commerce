import { formatPrice } from '@/lib/formatePrice';
import { removeProductFromCard, updateProductQuantity } from '@/redux/slices/cartSlice';
import { CartProduct } from '@/types/Product';
import Image from 'next/image';
import React from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { useDispatch } from 'react-redux';

type Props = {
  cartItem: CartProduct;
};

function CartItem({ cartItem }: Props) {
  const dispatch = useDispatch();
  const { id, product, quantity, selectedVariant } = cartItem;

  return (
    <section
      className={`flex items-start gap-x-4 pb-2 border-b last:border-b-0 border-base-content/20`}
    >
      <Image
        src={product.images[0]}
        alt={product.title}
        className="w-16 h-16 object-cover rounded-box"
        width={64}
        height={64}
      />
      <section className="flex items-start justify-start grow">
        <section className="grow flex flex-col gap-y-1">
          <h5 className="text-base-content text-base font-medium">{product.title}</h5>
          {selectedVariant && (
            <div className="flex flex-col gap-y-0.5">
              {selectedVariant.option1 && (
                <p className="text-base-content text-sm font-normal">
                  <span className="font-medium">{selectedVariant.option1.name}:</span>{' '}
                  {selectedVariant.option1.value}
                </p>
              )}
              {selectedVariant.option2 && (
                <p className="text-base-content text-sm font-normal">
                  <span className="font-medium">{selectedVariant.option2.name}:</span>{' '}
                  {selectedVariant.option2.value}
                </p>
              )}
              {selectedVariant.option3 && (
                <p className="text-base-content text-sm font-normal">
                  <span className="font-medium">{selectedVariant.option3.name}:</span>{' '}
                  {selectedVariant.option3.value}
                </p>
              )}
            </div>
          )}
          <p className="text-base-content text-sm font-normal">
            <span className="font-medium">Total Price: </span>
            {product?.isOnSale && product.discountPrice
              ? formatPrice((product.discountPrice + (selectedVariant?.extraPrice || 0)) * quantity)
              : formatPrice((product.basePrice + (selectedVariant?.extraPrice || 0)) * quantity)}
          </p>
        </section>

        <section className="w-20 flex flex-col items-end justify-end gap-2 h-full">
          <div className="flex items-center gap-0 border border-base-content w-fit rounded-box">
            <button
              className="btn btn-ghost btn-square btn-xs"
              onClick={() => {
                if (quantity > 1) {
                  dispatch(
                    updateProductQuantity({
                      id: id,
                      quantity: quantity - 1,
                    })
                  );
                }
              }}
            >
              <FaMinus size={10} />
            </button>
            <p className="btn btn-ghost btn-square btn-xs cursor-default bg-transparent border-x border-y-0 border-base-content">
              {quantity}
            </p>
            <button
              className="btn btn-ghost btn-square btn-xs"
              onClick={() => {
                dispatch(
                  updateProductQuantity({
                    id: id,
                    quantity: quantity + 1,
                  })
                );
              }}
            >
              <FaPlus size={10} />
            </button>
          </div>
          <button
            className="btn btn-ghost btn-sm px -0 underline underline-offset-2"
            onClick={() => {
              dispatch(removeProductFromCard(id));
            }}
          >
            Remove
          </button>
        </section>
      </section>
    </section>
  );
}

export default CartItem;
