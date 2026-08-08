'use client';
import { Product } from '@/types/Product';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import Dropdown from './ui/Dropdown';
import { FaMinus, FaPlus } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { formatPrice } from '@/lib/formatePrice';
import { useDispatch } from 'react-redux';
import { addProductToCard } from '@/redux/slices/cartSlice';
import { showHideCartDrawer } from '@/lib/cartDrawer';
import Image from 'next/image';
import { siteData } from '@/data/siteData';

type Props = {
  displayType?: 'dropdown' | 'radio';
  product: Product;
  showPerUnitPriceText?: boolean;
};

function ProductVariants({
  product,
  displayType = 'dropdown',
  showPerUnitPriceText = false,
}: Props) {
  const { variants } = product;
  const dispath = useDispatch();
  const [selectedOption1, setSelectedOption1] = useState<string | null>(null);
  const [selectedOption2, setSelectedOption2] = useState<string | null>(null);
  const [selectedOption3, setSelectedOption3] = useState<string | null>(null);

  const [showSizeChartModal, setShowSizeChartModal] = useState(false);
  const sizeChartModalRef = useRef<HTMLElement>(null);

  const option1Name = variants[0]?.option1?.name || 'Option 1';
  const option2Name = variants.find((v) => v.option2)?.option2?.name || 'Option 2';
  const option3Name = variants.find((v) => v.option3)?.option3?.name || 'Option 3';

  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const option1Values = useMemo(() => {
    const values = new Set<string>();
    variants.forEach((v) => values.add(v.option1!.value));
    return Array.from(values);
  }, [variants]);

  const option2Values = useMemo(() => {
    const values = new Set<string>();
    variants
      .filter((v) => v.option1!.value === selectedOption1 && v.option2)
      .forEach((v) => values.add(v.option2!.value));
    return Array.from(values);
  }, [variants, selectedOption1]);

  const option3Values = useMemo(() => {
    const values = new Set<string>();
    variants
      .filter(
        (v) =>
          v.option1!.value === selectedOption1 && v.option2?.value === selectedOption2 && v.option3
      )
      .forEach((v) => values.add(v.option3!.value));
    return Array.from(values);
  }, [variants, selectedOption1, selectedOption2]);

  const selectedVariant = useMemo(() => {
    return variants.find(
      (v) =>
        v.option1!.value === selectedOption1 &&
        (!v.option2 || v.option2!.value === selectedOption2) &&
        (!v.option3 || v.option3!.value === selectedOption3)
    );
  }, [variants, selectedOption1, selectedOption2, selectedOption3]);

  const addToCart = () => {
    if (product.isOutOfStock || (selectedVariant && selectedVariant?.isOutOfStock)) {
      toast.error('This product is out of stock.');
    } else if (selectedVariant || variants.length === 0) {
      const uuid = Math.floor(Math.random() * 1000 + 1) + Date.now();

      dispath(
        addProductToCard({
          id: uuid.toString(),
          product: product,
          quantity: selectedQuantity,
          selectedVariant: selectedVariant || null,
        })
      );
      toast.success('Product added to cart successfully!');
      showHideCartDrawer();
    } else {
      toast.error('Please select all options before adding to cart.');
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedOption1(option1Values[0]);
  }, [product, option1Values]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showSizeChartModal &&
        sizeChartModalRef.current &&
        !sizeChartModalRef.current.contains(event.target as Node)
      ) {
        setShowSizeChartModal(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showSizeChartModal]);

  return (
    <section className="">
      {variants?.length > 0 && (
        <>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-medium">Variants</h3>
            {product.sizeChart && (
              <button
                type="button"
                className="text-base font-normal link link-secondary underline-offset-2"
                onClick={() => {
                  setShowSizeChartModal(true);
                }}
              >
                Size Chart
              </button>
            )}
          </div>

          {displayType === 'dropdown' && (
            <section className="space-y-4 mt-4">
              {/* Option 1 */}
              {option1Values.length > 0 && (
                <section className="flex items-center justify-start gap-3">
                  <label className="block text-sm font-medium text-base-content w-16">
                    {option1Name}
                  </label>
                  <Dropdown
                    label={option1Name}
                    onSelect={(option) => {
                      setSelectedOption1(option.value);
                      setSelectedOption2(null);
                      setSelectedOption3(null);
                    }}
                    selectedOption={
                      selectedOption1
                        ? option1Values.find((v) => v === selectedOption1)
                          ? { label: selectedOption1, value: selectedOption1 }
                          : null
                        : null
                    }
                    options={option1Values.map((value) => ({ label: value, value }))}
                    classNames={{
                      button: 'btn btn-md btn-outline',
                      container: 'max-w-[200px]',
                    }}
                  />
                </section>
              )}

              {/* Option 2 */}
              {option2Values.length > 0 && (
                <section className="flex items-center justify-start gap-3">
                  <label className="block text-sm font-medium text-base-content w-16">
                    {option2Name}
                  </label>
                  <Dropdown
                    label={option2Name}
                    onSelect={(option) => {
                      setSelectedOption2(option.value);
                      setSelectedOption3(null);
                    }}
                    selectedOption={
                      selectedOption2
                        ? option2Values.find((v) => v === selectedOption2)
                          ? { label: selectedOption2, value: selectedOption2 }
                          : null
                        : null
                    }
                    options={option2Values.map((value) => ({ label: value, value }))}
                    classNames={{
                      button: 'btn btn-md btn-outline',
                      container: 'max-w-[200px]',
                    }}
                  />
                </section>
              )}

              {/* Option 3 */}
              {option3Values.length > 0 && (
                <section className="flex items-center justify-start gap-3">
                  <label className="block text-sm font-medium text-base-content w-16">
                    {option3Name}
                  </label>
                  <Dropdown
                    label={option3Name}
                    onSelect={(option) => {
                      setSelectedOption3(option.value);
                    }}
                    selectedOption={
                      selectedOption3
                        ? option3Values.find((v) => v === selectedOption3)
                          ? { label: selectedOption3, value: selectedOption3 }
                          : null
                        : null
                    }
                    options={option3Values.map((value) => ({ label: value, value }))}
                    classNames={{
                      button: 'btn btn-md btn-outline',
                      container: 'max-w-[200px]',
                    }}
                  />
                </section>
              )}
            </section>
          )}

          {displayType === 'radio' && (
            <section className="space-y-4 mt-4">
              {/* Option 1 */}
              {option1Values.length > 0 && (
                <section className="flex flex-col items-start justify-start gap-2">
                  <label className="block text-base font-medium text-base-content">
                    {option1Name}
                  </label>
                  <section className="flex items-center gap-3 flex-wrap w-full">
                    {option1Values.map((variant, index) => (
                      <input
                        key={`${index}-${variant}-option1`}
                        type="radio"
                        name="variant-option1"
                        aria-label={variant}
                        title={variant}
                        className={`btn btn-md not-checked:btn-soft checked:btn-secondary`}
                        value={variant}
                        onChange={() => {
                          setSelectedOption1(variant);
                          setSelectedOption2(null);
                          setSelectedOption3(null);
                        }}
                        checked={selectedOption1 === variant}
                      />
                    ))}
                  </section>
                </section>
              )}

              {/* Option 2 */}
              {option2Values.length > 0 && (
                <section className="flex flex-col items-start justify-start gap-2">
                  <label className="block text-base font-medium text-base-content">
                    {option2Name}
                  </label>
                  <section className="flex items-center gap-3 flex-wrap w-full">
                    {option2Values.map((variant, index) => (
                      <input
                        key={`${index}-${variant}-option2`}
                        type="radio"
                        name="variant-option2"
                        aria-label={variant}
                        title={variant}
                        className={`btn btn-md not-checked:btn-soft checked:btn-secondary`}
                        value={variant}
                        onChange={() => {
                          setSelectedOption2(variant);
                          setSelectedOption3(null);
                        }}
                        checked={selectedOption2 === variant}
                      />
                    ))}
                  </section>
                </section>
              )}

              {/* Option 3 */}
              {option3Values.length > 0 && (
                <section className="flex flex-col items-start justify-start gap-2">
                  <label className="block text-base font-medium text-base-content">
                    {option3Name}
                  </label>
                  <section className="flex items-center gap-3 flex-wrap w-full">
                    {option3Values.map((variant, index) => (
                      <input
                        key={`${index}-${variant}-option3`}
                        type="radio"
                        name="variant-option3"
                        aria-label={variant}
                        title={variant}
                        className={`btn btn-md not-checked:btn-soft checked:btn-secondary`}
                        value={variant}
                        onChange={() => setSelectedOption3(variant)}
                        checked={selectedOption3 === variant}
                      />
                    ))}
                  </section>
                </section>
              )}
            </section>
          )}
        </>
      )}

      <p className="text-base-content text-base my-4">
        Need help selecting the right variant? Contact us at{' '}
        <a href={`tel:${siteData.contactNoRaw}`} className="link link-primary">
          {siteData.contactNoFormatted}
        </a>
      </p>

      {/* Price */}
      <section className="mt-5 flex items-center gap-3">
        <p className="text-xl font-medium text-base-content">Total Price:</p>
        {product.isOnSale && product.discountPrice ? (
          <>
            <p className="text-xl font-medium text-base-content line-through">
              {formatPrice(
                (product.basePrice + (selectedVariant?.extraPrice || 0)) * selectedQuantity
              )}
            </p>
            <p className="text-xl font-medium text-primary">
              {formatPrice(
                (product.discountPrice + (selectedVariant?.extraPrice || 0)) * selectedQuantity
              )}
            </p>
          </>
        ) : (
          <p className="text-2xl font-bold text-primary">
            {formatPrice(
              (product.basePrice + (selectedVariant?.extraPrice || 0)) * selectedQuantity
            )}
          </p>
        )}
      </section>
      {showPerUnitPriceText && (
        <p className="text-sm lg:text-base font-normal">Price per button is mentioned.</p>
      )}

      {/* Quantity and Add to Cart */}
      <section className="my-5 flex items-center gap-5">
        <div className="flex items-center gap-0 my-2 border border-base-content w-fit rounded-field">
          <button
            className="btn btn-ghost btn-square"
            onClick={() => {
              if (selectedQuantity > 1) {
                setSelectedQuantity(selectedQuantity - 1);
              }
            }}
          >
            <FaMinus size={10} />
          </button>
          <p className="btn btn-ghost btn-square cursor-default bg-transparent rounded-none border-x border-y-0 border-base-content">
            {selectedQuantity}
          </p>
          <button
            className="btn btn-ghost btn-square"
            onClick={() => setSelectedQuantity(selectedQuantity + 1)}
          >
            <FaPlus size={10} />
          </button>
        </div>
        <button
          className="btn btn-primary btn-md grow sm:btn-wide"
          onClick={() => {
            addToCart();
          }}
          disabled={product.isOutOfStock || (selectedVariant && selectedVariant?.isOutOfStock)}
        >
          {product.isOutOfStock || (selectedVariant && selectedVariant?.isOutOfStock)
            ? 'Out of Stock'
            : 'Add to Cart'}
        </button>
      </section>

      {/* Size Chart Modal */}
      {showSizeChartModal && product.sizeChart && (
        <section className="fixed top-0 left-0 w-full h-full z-20 bg-black/70 flex justify-center items-center">
          <section
            className="relative bg-white min-w-87.5 w-full max-w-sm sm:max-w-lg md:max-w-2xl min-h-125 overflow-auto rounded-lg py-5 px-5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-x-5"
            ref={sizeChartModalRef}
          >
            <Image src={product?.sizeChart} alt="Size Chart" fill className="object-contain" />

            <button className="absolute top-5 right-5" onClick={() => setShowSizeChartModal(false)}>
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 2L20 20M2 20L20 2"
                  stroke="black"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </section>
        </section>
      )}
    </section>
  );
}

export default ProductVariants;
