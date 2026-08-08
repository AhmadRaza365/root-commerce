<p align="center">
  <h1 align="center">RootCommerce</h1>
  <p align="center"><em>Grow from solid roots.</em></p>
</p>

---

**RootCommerce** is a free, open-source ecommerce template built with **Next.js 16**, **React 19**, and **Tailwind CSS v4**. Designed as a production-ready starting point for any online store — just fork, customize, and launch.

---

## ✨ Features

- **Modern stack** — Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4
- **Pre-built store pages** — Home, Shop, Product detail, Categories, Search, Cart, Checkout
- **4 hero section variants** — Classic slider, content side-by-side, full-image, transparent overlays
- **3 category section layouts** — Grids, sliders, and circle cards
- **2 CTA & promo sections** — Image-background CTAs and newsletter banners
- **Authentication** — Login and registration pages with Redux state management
- **Product variants** — Color, size, and option swatches with image galleries
- **Search** — Full-text product search with dedicated results page
- **In-memory data** — Drop-in product and category arrays ready to swap with your API
- **Responsive & accessible** — Mobile-first design with WCAG AA color contrast
- **shadcn/ui + daisyUI** — Beautiful, customizable UI components
- **SEO ready** — Dynamic sitemap, robots.txt, metadata, Open Graph images
- **PWA support** — Service worker, web manifest, installable as a standalone app

---

## 🔥 Free vs Paid

| Feature                               | Free  |   Paid   |
| ------------------------------------- | :---: | :------: |
| Hero section components               |   4   |    12    |
| Category section components           |   3   |    12    |
| CTA & promo sections                  |   2   |    4     |
| Basic authentication (login/register) |  ✅   |    ✅    |
| Passkeys-based authentication         |  ❌   |    ✅    |
| Product variants                      | Basic | Advanced |
| MongoDB integration                   |  ❌   |    ✅    |
| Customer & admin dashboards           |  ❌   |    ✅    |
| Push notifications                    |  ❌   |    ✅    |
| Email integration                     |  ❌   |    ✅    |
| Blog & product reviews                |  ❌   |    ✅    |
| Location-based shipping charges       |  ❌   |    ✅    |
| Customizable payment methods          |  ❌   |    ✅    |
| PayPal checkout                       |  ❌   |    ✅    |
| Discounts & promo codes               |  ❌   |    ✅    |
| Priority expert support               |  ❌   |    ✅    |

---

## 🛒 Upgrade to RootCommerce Pro

Ready to take your store to the next level? The paid version unlocks everything you need for a full-scale ecommerce operation.

<p align="center">
  <a href="http://ahmadraza365.com/root-commerce">
    <strong>👉 Get RootCommerce Pro — Learn More</strong>
  </a>
</p>

---

## 🚀 Quick Start

```bash
# Clone the repo
git clone https://github.com/your-org/rootcommerce.git my-store
cd my-store

# Install dependencies
pnpm install

# Copy environment variables
cp sample_env.txt .env.local

# Start the dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see your store.

---

## 🎨 Customization

### Branding

Edit `data/siteData.ts` with your store's name, description, and contact details:

```ts
const siteData = {
  name: 'Your Store Name',
  title: 'Your Store — Tagline',
  author: 'Your Brand',
  description: '...',
  siteURL: process.env.NEXT_PUBLIC_DOMAIN_URL,
  siteMetaImage: '/images/social-image.jpg',
  socialHandle: '@yourstore',
};
```

### Products & Categories

Replace the in-memory data in `data/products.ts` and `data/categories.ts` with your own catalog, or swap in API calls inside the route handlers under `app/api/`.

### Theme & Styling

#### Generate a New Theme

The store uses **daisyUI** themes. To create your own color scheme:

1. Head to [daisyUI Theme Generator](https://daisyui.com/theme-generator) and configure your colors.
2. Copy the generated CSS snippet.
3. Open `app/globals.css` and replace the entire `@plugin "daisyui/theme"` block (lines 10–43) with your new theme code.

The default RootCommerce palette:

| Role       | Hex       |
| ---------- | --------- |
| Primary    | `#1B4332` |
| Secondary  | `#8B5E3C` |
| Accent     | `#A3B18A` |
| Highlight  | `#D4A373` |
| Background | `#F8F5F0` |

#### Changing Fonts

1. Place your font files (`.woff`, `.woff2`, etc.) inside `app/fonts/`.
2. Edit `app/fonts/font.ts` to reference your new font files — update the `src` paths, weights, and styles. **Keep the variable names** (`--font-primary`, `--font-secondary`) unchanged so globals.css continues to work.
3. If you do rename a variable, also update the corresponding CSS variable references in `app/globals.css` and `app/layout.tsx`.

Example: swapping primary font files while keeping the variable name intact:

```ts
const primaryFont = localFont({
  src: [
    { path: './your-font-light.woff2', weight: '300', style: 'normal' },
    { path: './your-font-regular.woff2', weight: '400', style: 'normal' },
    { path: './your-font-bold.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-primary', // keep this unchanged
  display: 'swap',
});
```

### Homepage Sections

Homepage content is driven by `data/settings.ts`. Update the hero slider, ticker bar, and featured sections to match your brand.

---

## 📁 Project Structure

```
├── app/
│   ├── (website)/       # Store pages (home, shop, product, cart, etc.)
│   ├── api/             # API route handlers
│   └── layout.tsx       # Root layout with fonts & metadata
├── components/
│   ├── cards/           # Product cards
│   ├── categories-sections/  # 3 category layout variants
│   ├── cta-sections/    # 2 CTA & promo section variants
│   ├── hero-sections/   # 4 hero slider variants
│   ├── promo-sections/  # Banners, grids, newsletter
│   └── ui/              # shadcn/ui + custom components
├── data/                # In-memory product, category & settings data
├── redux/               # Redux store (cart, auth)
├── types/               # TypeScript type definitions
└── public/              # Static assets
```

---

## 🛠️ Tech Stack

| Technology      | Purpose              |
| --------------- | -------------------- |
| Next.js 16      | Framework            |
| React 19        | UI library           |
| TypeScript      | Type safety          |
| Tailwind CSS v4 | Styling              |
| Redux Toolkit   | State management     |
| shadcn/ui       | Component primitives |
| daisyUI         | UI components        |
| Swiper          | Sliders & carousels  |
| Axios           | HTTP client          |

---

## 📦 Scripts

```bash
pnpm dev        # Start development server
pnpm build      # Production build
pnpm start      # Start production server
pnpm lint       # Run ESLint
pnpm format     # Format with Prettier
```

---

## 🌐 Deploy

Deploy to any platform that supports Next.js:

- [Vercel](https://vercel.com) (zero-config)
- [Netlify](https://netlify.com)
- [Cloudflare Pages](https://pages.cloudflare.com)
- Your own VPS or Docker setup

Set `NEXT_PUBLIC_DOMAIN_URL` to your production domain in your hosting environment variables.

---

## 💬 Support & Updates

Follow for updates, tips, and support:

- [LinkedIn](https://www.linkedin.com/in/ahmadraza365/)
- [X (Twitter)](https://x.com/Ahmad365Raza)
- [Website](https://ahmadraza365.com/)

---

## 📄 License

MIT — free for personal and commercial use. Attribution appreciated but not required.

---

**Rooted in reliability. Built for growth.**
