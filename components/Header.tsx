'use client';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import logo from '@/assets/logo.png';
import Link from 'next/link';
import { IoIosArrowDown, IoIosSearch } from 'react-icons/io';
import { PiShoppingBagOpen } from 'react-icons/pi';
import { HiMenu } from 'react-icons/hi';
import { CgClose } from 'react-icons/cg';
import { usePathname, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { IoClose } from 'react-icons/io5';
import CartItem from './CartItem';
import { formatPrice } from '@/lib/formatePrice';
import { FaRegUser } from 'react-icons/fa';
import { Settings } from '@/types/Settings';
import { siteData } from '@/data/siteData';

type Props = {
  categories: {
    name: string;
    slug: string;
    showNewTag?: boolean;
  }[];
  ticker?: Settings['ticker'];
};

function Header({ categories, ticker }: Props) {
  const path = usePathname();
  const router = useRouter();
  const { products } = useSelector((state: RootState) => state.cart);
  const [productTotal, setProductTotal] = useState(0);
  const [openSearch, setOpenSearch] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [openMobileMenu, setOpenMobileMenu] = useState(false);
  const linksMenuRef = useRef<HTMLElement>(null);
  const [openCartDrawer, setOpenCartDrawer] = useState(false);
  const { show: showTicker, text: tickerText } = ticker || {
    show: false,
    text: '',
  };

  const headerLinkClassNames =
    'link link-hover text-base underline-offset-2 font-medium text-base-content hover:text-primary uppercase';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (linksMenuRef.current && !linksMenuRef.current.contains(event.target as Node)) {
        setOpenMobileMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [linksMenuRef]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpenMobileMenu(false);
    setOpenSearch(false);
    setOpenCartDrawer(false);
    setSearchValue('');
  }, [path]);

  useEffect(() => {
    const total = products.reduce((acc, item) => {
      return (
        acc +
        ((item.product.isOnSale && item.product.discountPrice
          ? item.product.discountPrice
          : item.product.basePrice) +
          (item.selectedVariant?.extraPrice || 0)) *
          item.quantity
      );
    }, 0);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProductTotal(total);
  }, [products]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenSearch(false);
        setOpenMobileMenu(false);
        setOpenCartDrawer(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <section className="sticky top-0 z-30 shadow">
      {showTicker && tickerText && (
        <section className="w-full h-fit bg-base-content text-base-100 py-2 my-0 mx-auto overflow-hidden whitespace-nowrap border-b border-base-content">
          <div
            className="ticker inline-block"
            style={
              {
                '--ticker-duration': `${ticker?.duration || 40}s`,
              } as React.CSSProperties
            }
          >
            <span className="item-collection-1 relative left-0">
              {Array.from({ length: 7 }).map((_, index) => (
                <span
                  key={index}
                  className="item text-sm 2xl:text-base inline-block px-20 text-base-100"
                >
                  {tickerText}
                </span>
              ))}
            </span>
            <span className="item-collection-2">
              {Array.from({ length: 7 }).map((_, index) => (
                <span
                  key={index}
                  className="item text-sm 2xl:text-base inline-block px-20 text-base-100"
                >
                  {tickerText}
                </span>
              ))}
            </span>
          </div>
        </section>
      )}
      <section
        className="w-full h-fit bg-base-100 flex items-center justify-start px-6 sm:px-8 lg:px-12 xl:px-14 py-8"
        ref={linksMenuRef}
      >
        <Link
          href="/"
          className="w-fit absolute left-1/2 -translate-x-1/2 my-auto flex items-center justify-center"
        >
          <h1 className="hidden">{siteData.name}</h1>
          <Image src={logo} alt="Logo" className="w-24 lg:w-28" width={500} height={500} />
        </Link>
        <button
          className="w-fit h-fit cursor-pointer lg:hidden"
          onClick={() => setOpenMobileMenu(!openMobileMenu)}
        >
          <HiMenu className="text-base-content" size={24} />
        </button>
        <button
          className="sm:hidden ml-1.5 w-fit h-fit cursor-pointer"
          onClick={() => {
            setOpenSearch(!openSearch);
          }}
        >
          <IoIosSearch className="text-base-content" size={24} />
        </button>

        <section
          className={`fixed top-0 left-0 lg:static flex flex-col lg:flex-row items-start lg:items-center gap-4 w-full lg:w-fit max-w-xs lg:max-w-none h-screen lg:h-fit overflow-auto lg:overflow-visible bg-base-100 lg:bg-transparent px-6 lg:px-0 pt-20 pb-12 lg:pt-0 lg:pb-0 shadow-lg lg:shadow-none transition-all ease-in-out duration-200 z-10 ${
            openMobileMenu ? 'translate-x-0 lg:translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <Link href="/" className={headerLinkClassNames}>
            Home
          </Link>

          <Link href="/shop" className={headerLinkClassNames}>
            Shop
          </Link>
          <section className="group relative">
            <div className="hidden lg:flex items-center gap-x-1 gap-2">
              <Link
                href="/categories"
                className={`${headerLinkClassNames} hidden lg:flex items-center gap-x-1 gap-2`}
              >
                Categories
              </Link>
              <IoIosArrowDown className="-mb-1 cursor-pointer text-base-content" size={16} />
            </div>
            <div className="w-full lg:w-fit lg:min-w-56 bg-transparent lg:bg-base-200 static lg:absolute shadow-none lg:shadow-md py-0 lg:py-4 px-0 lg:px-4 flex lg:hidden group-focus:flex group-hover:flex flex-col items-start gap-4 lg:gap-2 lg:rounded-box animate-slide-down">
              <div className="group w-full">
                <section className="py-0 lg:py-2 flex flex-col gap-y-4 lg:gap-y-2 items-start">
                  {categories.map((category, index) => (
                    <Link
                      key={index}
                      href={`/categories/${category.slug}`}
                      className="link link-hover text-base hover:text-primary w-full flex items-center gap-2"
                    >
                      {category.name}{' '}
                      {category.showNewTag && <span className="text-secondary">New</span>}
                    </Link>
                  ))}
                  <Link
                    href={`/categories`}
                    className={`${headerLinkClassNames} w-full block lg:hidden`}
                  >
                    View All Categories
                  </Link>
                </section>
              </div>
            </div>
          </section>

          <Link href="/contact-us" className={headerLinkClassNames}>
            Contact Us
          </Link>
          <Link href="/login" className={`${headerLinkClassNames} block lg:hidden`}>
            My Account
          </Link>

          {openMobileMenu && (
            <button
              className="w-8 h-8 absolute right-0 top-7 block lg:hidden"
              onClick={() => setOpenMobileMenu(!openMobileMenu)}
            >
              <CgClose size={28} />
            </button>
          )}
        </section>
        <section className="flex items-center gap-x-4 ml-auto">
          <button
            className="hidden sm:block w-fit h-fit cursor-pointer"
            onClick={() => {
              setOpenSearch(!openSearch);
            }}
          >
            <IoIosSearch className="text-base-content hover:text-primary" size={24} />
          </button>

          <section className="drawer drawer-end">
            <input
              id="cart-drawer"
              type="checkbox"
              className="drawer-toggle"
              checked={openCartDrawer}
              onChange={() => setOpenCartDrawer(!openCartDrawer)}
            />
            <section className="drawer-content">
              {/* Page content here */}
              <label
                htmlFor="cart-drawer"
                className="drawer-button w-fit h-fit cursor-pointer relative"
              >
                <PiShoppingBagOpen className="text-base-content hover:text-primary" size={25} />
                <span className="absolute -top-2 -right-2 bg-primary text-primary-content rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {products.length || 0}
                </span>
              </label>
            </section>
            <section className="drawer-side">
              <label
                htmlFor="cart-drawer"
                aria-label="close sidebar"
                className="drawer-overlay"
              ></label>
              <section className="menu bg-base-200 text-base-content min-h-full w-full max-w-sm px-4 pt-0 pr-5 relative">
                <div className="flex justify-between border-b border-base-content/20 pb-4 pt-5 mb-4 sticky top-0 bg-base-200">
                  <h5 className="text-xl font-medium text-base-content">Cart</h5>
                  <label
                    htmlFor="cart-drawer"
                    className="w-fit h-fit cursor-pointer btn btn-ghost btn-square"
                  >
                    <IoClose size={24} />
                  </label>
                </div>
                <section className="flex flex-col gap-y-4 px-0.5 pb-10 h-full min-h-[calc(100vh-200px)] overflow-y-auto">
                  {products.length > 0 ? (
                    products.map((product) => <CartItem cartItem={product} key={product.id} />)
                  ) : (
                    <p className="text-base-content text-base font-normal mt-4">
                      Cart is empty. Add some products to cart.
                    </p>
                  )}
                </section>
                <section className="w-full h-fit sticky bottom-0 bg-base-200 border-t border-base-content/20 pt-4 pb-5 px-2 flex flex-col gap-3.5">
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-medium text-base-content">Product Total:</p>
                    <p className="text-lg font-medium text-base-content">
                      {formatPrice(productTotal || 0)}
                    </p>
                  </div>

                  {products.length > 0 ? (
                    <Link href="/checkout" className="btn btn-primary btn-block">
                      Checkout
                    </Link>
                  ) : (
                    <button className="btn btn-primary btn-block" disabled>
                      Checkout
                    </button>
                  )}
                </section>
              </section>
            </section>
          </section>
          <Link className="w-fit h-fit cursor-pointer" href={'/login'}>
            <FaRegUser className="text-base-content hover:text-primary" size={22} />
          </Link>
        </section>
        {openSearch && (
          <section className="fixed top-0 left-0 z-50 w-full h-full bg-base-content/30 backdrop-blur-md backdrop-brightness-50 flex items-center justify-center">
            <div className="px-5 w-full max-w-sm mx-auto">
              <label
                htmlFor="headerSearch"
                className="text-lg font-normal flex flex-col items-start gap-2"
              >
                <span className="text-base-100">Search</span>
                <input
                  type="search"
                  id="headerSearch"
                  name="headerSearch"
                  className="input input-primary w-full "
                  placeholder="Search..."
                  onChange={(e) => setSearchValue(e.target.value)}
                  value={searchValue}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchValue) {
                      setOpenSearch(false);
                      router.push(`/search/${searchValue}`);
                    }
                  }}
                />
              </label>
              {searchValue && (
                <button
                  className="btn btn-primary btn-block mt-2"
                  onClick={() => {
                    if (searchValue) {
                      setOpenSearch(false);
                      router.push(`/search/${searchValue}`);
                    }
                  }}
                >
                  Search
                </button>
              )}
            </div>
            <button
              className="w-8 h-8 absolute right-5 top-7 block text-base-100"
              onClick={() => setOpenSearch(!openSearch)}
            >
              <CgClose size={28} />
            </button>
          </section>
        )}
      </section>
    </section>
  );
}

export default Header;
