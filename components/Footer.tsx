import { siteData } from '@/data/siteData';
import Link from 'next/link';
import { BsFacebook, BsInstagram } from 'react-icons/bs';

export default function Footer() {
  return (
    <footer className="">
      <section className="bg-base-300 px-5 md:px-10 xl:px-14 2xl:px-20 py-9 flex flex-col md:flex-row items-start sm:items-center md:items-start justify-between gap-5">
        {/* Email Subscription */}
        <div className="flex flex-col gap-1 max-w-xs lg:max-w-sm">
          <h3 className="text-base-content text-4xl sm:text-2xl lg:text-5xl">{siteData.name}</h3>
        </div>
        {/* Footer Links */}
        <section className="flex flex-col sm:flex-row items-start justify-start sm:justify-between md:justify-center w-full sm:w-auto max-w-xs md:max-w-none gap-5  md:gap-16 lg:gap-24">
          <section>
            <h3 className="text-base-content text-xl font-medium ">Useful Links</h3>
            <ul className="mt-4 flex flex-col gap-2 lg:gap-3">
              <li className="text-base-content text-lg lg:text-lg font-normal">
                <Link href="/products">Products</Link>
              </li>
              <li className="text-base-content text-lg lg:text-lg font-normal">
                <Link href="/categories">Categories</Link>
              </li>
              {/* <li className="text-base-content text-lg lg:text-lg font-normal">
                <Link href="/blog">Blog</Link>
              </li> */}
              <li className="text-base-content text-lg lg:text-lg font-normal">
                <Link href="/contact-us">Contact Us</Link>
              </li>
              <li className="hidden text-base-content text-lg lg:text-lg font-normal">FAQs</li>
            </ul>
          </section>
          <section>
            <h3 className="text-base-content text-xl font-medium">Further Info</h3>
            <ul className="mt-4 flex flex-col gap-2 lg:gap-3">
              <li className="text-base-content text-lg font-normal">
                <Link href="/terms-of-use">Terms of Use</Link>
              </li>
              <li className="text-base-content text-lg font-normal">
                <Link href="/privacy-policy">Privacy Policy</Link>
              </li>
              <li className="text-base-content text-lg font-normal">
                <Link href="/exchange-policy">Exchange Policy</Link>
              </li>
              <li className="text-base-content text-lg font-normal">
                <a href="/sitemap.xml" target="_blank">
                  Site Map
                </a>
              </li>
            </ul>
          </section>
        </section>
      </section>
      <section className="bg-base-300 border-light border-t py-4 flex flex-col-reverse sm:flex-row items-center justify-between gap-5 px-5 md:px-10 xl:px-14 2xl:px-20">
        <p className="text-base-content text-center text-lg lg:text-xl">
          All rights reserved @ {siteData.name} {new Date().getFullYear()}
        </p>
        <div className="flex items-center gap-5 sm:gap-3">
          <a href={`https://www.facebook.com/${siteData.socialHandle}`} target="_blank">
            <BsFacebook className="text-base-content text-3xl lg:text-3xl" />
          </a>
          <a href={`https://www.instagram.com/${siteData.socialHandle}/`} target="_blank">
            <BsInstagram className="text-base-content text-3xl lg:text-3xl" />
          </a>
        </div>
      </section>
    </footer>
  );
}
