/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { City, Country } from 'country-state-city';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { RootState } from '@/redux/store';
import toast from 'react-hot-toast';
import Dropdown from '@/components/ui/Dropdown';
import axoisAPI from '@/network/axios';
import { formatPrice } from '@/lib/formatePrice';
import Input from '@/components/ui/Input';
import { IoClose } from 'react-icons/io5';

const AllCountriesList = Country.getAllCountries().map((country) => ({
  label: country.name,
  value: country.isoCode,
}));

export default function Checkout() {
  const user = useSelector((state: RootState) => state.auth);
  const cart = useSelector((state: RootState) => state.cart.products);
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<any | null>(null);
  const [showAddPromo, setShowAddPromo] = useState(false);
  const [enteredPromoCode, setEnteredPromoCode] = useState('');
  const [isValidatingPromoCode, setIsValidatingPromoCode] = useState(false);

  const [promoCodeApplied, setPromoCodeApplied] = useState<{
    name: string;
    discount: number;
    value: number;
    type: 'percentage' | 'fixed';
    productTotal: number;
  } | null>(null);

  const [selectedCountry, setSelectedCountry] = useState<{
    label: string;
    value: string;
  } | null>(null);

  const [selectedCity, setSelectedCity] = useState<{
    label: string;
    value: string;
  } | null>(null);

  const countries = AllCountriesList;

  const citiesList = useMemo(() => {
    if (!selectedCountry) {
      return [];
    }

    const allCities = City.getCitiesOfCountry(selectedCountry.value);

    if (allCities && allCities?.length > 0) {
      return (
        allCities?.map((city) => ({
          label: city.name,
          value: city.name,
        })) || []
      );
    } else {
      return [
        {
          label: selectedCountry.label,
          value: selectedCountry.label,
        },
      ];
    }
  }, [selectedCountry]);

  const [userInfo, setUserInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    contactNumber: '',
    secondaryContactNumber: '',
    isNewUser: true,
  });
  const [address, setAddress] = useState('');

  const [orderInstructions, setOrderInstructions] = useState('');

  // States for error handling for inputs
  const [isFirstNameMissing, setIsFirstNameMissing] = useState(false);
  const [isLastNameMissing, setIsLastNameMissing] = useState(false);
  const [isEmailMissing, setIsEmailMissing] = useState(false);
  const [isContactNumberMissing, setIsContactNumberMissing] = useState(false);
  const [isCityMissing, setIsCityMissing] = useState(false);
  const [isCountryMissing, setIsCountryMissing] = useState(false);
  const [isAddressMissing, setIsAddressMissing] = useState(false);
  const promoDiscount = promoCodeApplied?.discount ?? 0;
  const subTotalAfterPromo = Math.max(0, cartTotal - promoDiscount);
  const paymentMethodDiscount = 0;

  const paymentMethods = [
    {
      title: 'Cash on Delivery',
      description: ``,
    },
    {
      title: 'Bank Deposit',
      description: `<p class="editor-paragraph" dir="auto" style="text-align: start;"><strong class="editor-text-bold" data-lexical-text="true" style="color: rgb(229, 188, 101);">Bank Name:</strong><span data-lexical-text="true">&nbsp;Test Bank</span></p><p class="editor-paragraph" dir="auto" style="text-align: start;"><strong class="editor-text-bold" data-lexical-text="true" style="color: rgb(229, 188, 101);">Account No:</strong><span data-lexical-text="true">&nbsp;1234567890</span></p><p class="editor-paragraph" dir="auto" style="text-align: start;"><strong class="editor-text-bold" data-lexical-text="true" style="color: rgb(229, 188, 101);">Account Title:</strong><span data-lexical-text="true">&nbsp;Test Account</span></p>`,
    },
  ];

  const totalPayable = Math.max(
    0,
    subTotalAfterPromo + (paymentMethod?.extraFee || 0) - paymentMethodDiscount
  );

  const validateForm = (): boolean => {
    if (
      userInfo &&
      userInfo.firstName &&
      userInfo.lastName &&
      userInfo.email &&
      userInfo.contactNumber &&
      userInfo.contactNumber.length === 11 &&
      selectedCity &&
      selectedCountry &&
      address &&
      cart.length > 0
    ) {
      return true;
    } else {
      toast.error('Please fill all the fields');
      if (!userInfo?.firstName) setIsFirstNameMissing(true);
      if (!userInfo?.lastName) setIsLastNameMissing(true);
      if (!userInfo?.email) setIsEmailMissing(true);
      if (!userInfo?.contactNumber) setIsContactNumberMissing(true);
      if (!selectedCountry) setIsCountryMissing(true);
      if (!selectedCity) setIsCityMissing(true);
      if (!address) setIsAddressMissing(true);
      if (userInfo?.contactNumber.length !== 11) {
        setIsContactNumberMissing(true);
        toast.error('Please enter a valid contact number. 0300 1234567');
      }

      if (cart.length === 0) {
        toast.error('Please add items to cart');
      }

      return false;
    }
  };

  const placeOrder = async () => {
    setLoading(true);
    const isValidForm = validateForm();

    if (isValidForm) {
      toast.error('Checkout is disabled currently');
      setLoading(false);
    } else {
      setLoading(false);

      const errorInput = document?.getElementsByClassName('input-error');

      if (errorInput) {
        errorInput[0]?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'center',
        });
      } else {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }
    }
  };

  const handleValidatePromoCode = async (promoCode: string) => {
    setIsValidatingPromoCode(true);
    try {
      const response = await axoisAPI.post('/api/validate-promo', {
        promoCode: promoCode.trim(),
        productTotal: cartTotal,
      });

      const promo = response.data.data;
      setPromoCodeApplied({
        discount: promo.discount,
        name: promo.name,
        type: promo.type === 'percentage' ? 'percentage' : 'fixed',
        value: promo.value,
        productTotal: promo.productTotal,
      });
      setEnteredPromoCode('');
      setShowAddPromo(false);
      toast.success('Promo code applied successfully');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Unable to validate promo code');
    } finally {
      setIsValidatingPromoCode(false);
    }
  };

  useEffect(() => {
    if (cart.length > 0) {
      const total = cart.reduce((acc, item) => {
        return (
          acc +
          ((item.product.isOnSale && item.product.discountPrice
            ? item.product.discountPrice
            : item.product.basePrice) +
            (item.selectedVariant?.extraPrice || 0)) *
            item.quantity
        );
      }, 0);

      setCartTotal(total);
    } else {
      setCartTotal(0);
    }
  }, [cart]);

  useEffect(() => {
    if (user !== null && user !== undefined) {
      setUserInfo({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user?.email,
        contactNumber: user?.phoneNumber || '',
        isNewUser: false,
        secondaryContactNumber: '',
      });
    }
  }, [user]);

  useEffect(() => {
    if (countries && countries.length === 1) {
      setSelectedCountry(countries[0]);
    } else {
      // setSelectedCountry(null);
    }
    // setSelectedCity(null);
  }, [countries]);

  return (
    <main className="relative grid grid-cols-1 md:grid-cols-12 auto-rows-min mx-5 md:mx-10 xl:mx-16 gap-10 ~min-h-screen my-10">
      <section className="col-span-1 md:col-span-7 lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 auto-rows-min">
        <h1 className="col-span-full text-3xl text-primary font-bold">Checkout</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          className="col-span-full sm:col-span-3 xl:col-span-3 flex flex-col sm:grid sm:grid-cols-2 auto-rows-max gap-x-5 gap-y-3 sm:gap-y-3 my-5"
        >
          <h2 className="w-full col-span-full text-xl text-light font-medium">User Information</h2>

          <label htmlFor="firstName" className="label flex-col items-start text-base-content">
            First Name
            <input
              id="firstName"
              name="firstName"
              type="text"
              autoComplete="given-name"
              className={`input w-full focus:input-accent
                ${isFirstNameMissing ? 'input-error' : 'input-neutral'}
              `}
              placeholder="First Name"
              value={userInfo.firstName}
              onChange={(e) => {
                setUserInfo({ ...userInfo, firstName: e.target.value });
                setIsFirstNameMissing(false);
              }}
            />
          </label>
          <label htmlFor="lastName" className="label flex-col items-start text-base-content">
            Last Name
            <input
              id="lastName"
              name="lastName"
              type="text"
              autoComplete="family-name"
              className={`input w-full focus:input-accent
                ${isLastNameMissing ? 'input-error' : 'input-neutral'}
              `}
              placeholder="Last Name"
              value={userInfo.lastName}
              onChange={(e) => {
                setUserInfo({ ...userInfo, lastName: e.target.value });
                setIsLastNameMissing(false);
              }}
            />
          </label>

          <label
            htmlFor="email"
            className="label flex-col items-start text-base-content col-span-full"
          >
            Email
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              className={`input w-full focus:input-accent
                ${isEmailMissing ? 'input-error' : 'input-neutral'}
              `}
              placeholder="Email"
              value={userInfo.email}
              onChange={(e) => {
                setUserInfo({ ...userInfo, email: e.target.value });
                setIsEmailMissing(false);
              }}
            />
          </label>
          <label htmlFor="contactNumber" className="label flex-col items-start text-base-content">
            Contact Number
            <input
              id="contactNumber"
              name="contactNumber"
              type="tel"
              autoComplete="tel"
              className={`input w-full focus:input-accent
                ${isContactNumberMissing ? 'input-error' : 'input-neutral'}
                `}
              placeholder="03001234567"
              maxLength={11}
              value={userInfo.contactNumber}
              onChange={(e) => {
                // accept only numbers and symbols
                if (/^[0-9()]*$/.test(e.target.value)) {
                  setUserInfo({ ...userInfo, contactNumber: e.target.value });
                  setIsContactNumberMissing(false);
                } else {
                  setIsContactNumberMissing(true);
                }
              }}
            />
            <p>Format: 03001234567</p>
          </label>
          <label
            htmlFor="secondaryContactNumber"
            className="label flex-col items-start text-base-content"
          >
            2nd Contact Number (Optional)
            <input
              id="secondaryContactNumber"
              name="secondaryContactNumber"
              type="tel"
              autoComplete="tel"
              className={`input w-full focus:input-accent input-neutral`}
              placeholder="03001234567"
              maxLength={11}
              value={userInfo.secondaryContactNumber}
              onChange={(e) => {
                // accept only numbers and symbols
                if (/^[0-9()]*$/.test(e.target.value)) {
                  setUserInfo({
                    ...userInfo,
                    secondaryContactNumber: e.target.value,
                  });
                }
              }}
            />
            <p>Format: 03001234567</p>
          </label>

          <h2 className="w-full col-span-full text-xl text-light font-medium mt-5">
            Shipping Information
          </h2>
          <label htmlFor="country" className="label flex-col items-start text-base-content">
            Country
            <Dropdown
              label="Country"
              onSelect={(country) => {
                if (country) {
                  setSelectedCountry({
                    label: country.label?.toString() || '',
                    value: country.value,
                  });
                  setSelectedCity(null);
                }
              }}
              options={
                countries.map((country) => ({
                  label: country.label,
                  value: country.value,
                })) || []
              }
              selectedOption={
                selectedCountry
                  ? {
                      label: selectedCountry.label,
                      value: selectedCountry.value,
                    }
                  : null
              }
              showSearch={countries.length > 1}
              searchPlaceholder="Search Country"
              hideAddOption={true}
              classNames={{
                button: `btn-outline !m-0 ${isCountryMissing ? 'btn-error' : ''}`,
                list: 'max-h-72 overflow-y-auto flex flex-col flex-nowrap',
              }}
            />
          </label>

          <label htmlFor="city" className="label flex-col items-start text-base-content">
            City
            <Dropdown
              label="City"
              onSelect={(city) => {
                if (city) {
                  setSelectedCity({
                    label: city.value,
                    value: city.value,
                  });
                  setIsCityMissing(false);
                }
              }}
              options={citiesList}
              selectedOption={selectedCity}
              classNames={{
                button: `btn-outline !m-0 ${isCityMissing ? 'btn-error' : ''}`,
                list: 'max-h-72 overflow-y-auto flex flex-col flex-nowrap',
              }}
              showSearch={true}
              hideAddOption={true}
              searchPlaceholder="Search City"
              noOptionsText={`Select Country First`}
            />
          </label>

          <label
            htmlFor="streetAddress"
            className="label flex-col items-start text-base-content col-span-full"
          >
            Street Address
            <input
              id="streetAddress"
              name="streetAddress"
              type="text"
              autoComplete="address-line1"
              className={`input w-full focus:input-accent
                ${isAddressMissing ? 'input-error' : 'input-neutral'}
              `}
              placeholder="Street Address"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                setIsAddressMissing(false);
              }}
            />
          </label>

          {paymentMethods.length > 0 && (
            <>
              <h2 className="w-full col-span-full text-xl text-light font-medium mt-5">
                Payment Method
              </h2>
              <section className="col-span-full flex flex-col gap-y-3">
                {(paymentMethods ?? []).map((method, index) => {
                  return (
                    <section key={index} className="w-full">
                      <label
                        htmlFor={`payment-method-${index}`}
                        className={`px-4 py-3 rounded-selector border cursor-pointer flex items-center gap-x-2 ${
                          paymentMethod?.title === method.title
                            ? 'border-primary'
                            : 'border-base-content/30'
                        }`}
                      >
                        <input
                          id={`payment-method-${index}`}
                          name="paymentMethod"
                          type="radio"
                          className="h-4 w-4 radio radio-primary cursor-pointer"
                          value={method.title}
                          checked={method.title === paymentMethod?.title}
                          onChange={() => {
                            setPaymentMethod(method);
                          }}
                        />
                        <span>{method.title}</span>
                      </label>
                      {method.description &&
                        method.description !== '<p class="editor-paragraph" dir="auto"><br></p>' &&
                        method.title === paymentMethod?.title && (
                          <div
                            className="bg-base-100 text-base-content prose mt-3"
                            dangerouslySetInnerHTML={{ __html: method.description }}
                          ></div>
                        )}
                    </section>
                  );
                })}
              </section>
            </>
          )}

          <h2 className="hidden col-span-full text-xl font-KorsSansBook text-light mt-5">
            Order Instructions
          </h2>
          <label
            htmlFor="orderInstructions"
            className="hidden col-span-full text-sm font-medium text-light"
          >
            <textarea
              id="orderInstructions"
              name="orderInstructions"
              autoComplete="order-instructions"
              rows={3}
              className="appearance-none w-full px-3 py-2 border border-light focus:border-primary bg-transparent placeholder-light/50 text-light focus:outline-none text-base"
              placeholder="Specify any special instructions for your order"
              value={orderInstructions}
              onChange={(e) => {
                setOrderInstructions(e.target.value);
              }}
            />
          </label>
        </form>
      </section>
      <section className="col-span-full md:col-span-5 lg:col-span-4 w-full sticky top-44 h-fit">
        <section className="w-full bg-base-200 shadow-xl drop-shadow-sm border border-base-300 rounded-box px-6 py-5">
          <h2 className="text-xl text-primary font-bold">Order Summary</h2>
          <div className="grid grid-cols-2 gap-x-5 gap-y-1 mt-5 pb-3 border-b border-base-content/30">
            <p className="text-base font-normal text-base-content">Products Total</p>
            <p className="text-base font-normal text-base-content text-right">
              {formatPrice(cartTotal)}
            </p>

            {promoCodeApplied && (
              <>
                <p className="text-base font-normal text-base-content">
                  Promo Code{' '}
                  {promoCodeApplied.type === 'percentage' ? `(${promoCodeApplied.value}%)` : ''}
                </p>
                <p className="text-base font-normal text-base-content text-right">
                  - {formatPrice(promoCodeApplied.discount)}
                </p>

                <p className="text-base font-medium text-base-content">SubTotal</p>
                <p className="text-base font-medium text-base-content text-right">
                  {formatPrice(cartTotal - promoCodeApplied.discount)}
                </p>
                <hr className="col-span-full my-1 border-base-content/30 border-dashed" />
              </>
            )}

            {!!(
              paymentMethod &&
              paymentMethod.hasExtraFee &&
              paymentMethod.extraFeeName &&
              paymentMethod.extraFee
            ) && (
              <>
                <p className="text-base font-normal text-base-content">
                  {paymentMethod.extraFeeName}
                </p>
                <p className="text-base font-normal text-base-content text-right">
                  {formatPrice(paymentMethod.extraFee)}
                </p>
              </>
            )}

            {!!(paymentMethod && paymentMethodDiscount > 0) && (
              <>
                <p className="text-base font-normal text-base-content">
                  Discount{' '}
                  {paymentMethod?.discountType === 'percentage'
                    ? `(${paymentMethod.discountValue || 0}%)`
                    : ''}
                </p>
                <p className="text-base font-normal text-base-content text-right">
                  - {formatPrice(paymentMethodDiscount)}
                </p>
              </>
            )}

            <p className="text-lg font-bold text-base-content">Total</p>
            <p className="text-lg font-bold text-base-content text-right">
              {formatPrice(totalPayable)}
            </p>
          </div>

          {!!(
            paymentMethod?.hasDiscount &&
            paymentMethod.minimumOrderValue &&
            subTotalAfterPromo < paymentMethod.minimumOrderValue
          ) && (
            <p className="text-xs font-normal text-base-content/70 mt-2">
              Payment discount for {paymentMethod.title} is available on orders of{' '}
              {formatPrice(paymentMethod.minimumOrderValue)} or above.
            </p>
          )}

          {promoCodeApplied ? (
            <section className="flex items-center justify-between my-3">
              <p className="text-base">Applied promo code</p>
              <p className="badge badge-lg capitalize badge-primary rounded-full">
                {promoCodeApplied.name}
                <span
                  className="btn btn-square btn-xs btn-ghost bg-transparent text-primary-content -mr-2"
                  onClick={() => {
                    setPromoCodeApplied(null);
                    setShowAddPromo(false);
                  }}
                >
                  <IoClose size={20} />
                </span>
              </p>
            </section>
          ) : (
            <>
              <section className="flex items-center justify-between my-3">
                <p className="text-base">Have a promo code?</p>
                <p
                  className="text-base underline underline-offset-4 hover:text-primary cursor-pointer"
                  onClick={() => {
                    setShowAddPromo((prev) => !prev);
                  }}
                >
                  {showAddPromo ? 'Cancel' : 'Add Promo'}
                </p>
              </section>
              {showAddPromo && (
                <section className="relative flex items-center">
                  <Input
                    autoComplete="off"
                    label=""
                    name="promo-code"
                    placeholder="Promo Code"
                    type="text"
                    hasError={false}
                    setHasError={() => {}}
                    value={enteredPromoCode}
                    setValue={(value) => {
                      setEnteredPromoCode(value);
                    }}
                  />
                  <button
                    type="button"
                    className="btn btn-primary absolute right-0 z-3"
                    disabled={isValidatingPromoCode}
                    onClick={() => {
                      handleValidatePromoCode(enteredPromoCode);
                    }}
                  >
                    {isValidatingPromoCode ? <span className="loading"></span> : 'Apply'}
                  </button>
                </section>
              )}
            </>
          )}

          <section className="mt-5">
            <button
              className="btn btn-primary btn-block disabled:cursor-not-allowed"
              onClick={() => {
                placeOrder();
              }}
              disabled={cart?.length === 0 || loading}
            >
              {loading ? (
                <>
                  <AiOutlineLoading3Quarters size={18} className="animate-spin me-1" />
                  <span className="">Placing Order</span>
                </>
              ) : (
                'Place Order'
              )}
            </button>
          </section>
        </section>

        <p className="text-base-content text-base my-4">
          <span className="text-secondary text-xl font-medium mr-1">Note:</span>
          Product can only be returned within 48 hours of delivery if it does not meet your
          expectations.
        </p>
      </section>
    </main>
  );
}
