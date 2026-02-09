# This is Our Story 🥔🍊

A Next.js frontend for the blogging platform that tells the story of potato and olenji.

## Overview

This is the frontend application for the "This is Our Story" blog. Currently, it displays a story divided into chapters with parallax banner effects. The backend API serves the content through GraphQL.

## 🚀 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) - React framework with App Router
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- **UI Components**: [HeroUI](https://heroui.com/) - Beautiful React components
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/) - Icon library
- **Animation**: [Motion (Framer Motion)](https://motion.dev/) - Smooth animations and parallax effects
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) - Lightweight state management
- **Deployment**: [OpenNextJS + Cloudflare Workers](https://opennextjs.dev/) - Edge computing
- **Language**: TypeScript - Type-safe JavaScript

## 📁 Project Structure

```
blog-fe/
├── app/                      # Next.js app directory
│   ├── (public)/            # Public routes group
│   │   ├── page.tsx         # Home page with story chapters
│   │   ├── blogs/           # Blog pages
│   │   └── layout.tsx       # Public layout
│   ├── globals.css          # Global styles & theme variables
│   ├── layout.tsx           # Root layout
│   └── not-found.tsx        # 404 page
├── components/
│   ├── nav/                 # Navigation components
│   │   └── public/          # Public navigation (header, footer, mobile menu)
│   └── ui/                  # Reusable UI components organized by concerns
│       ├── banners/         # Banner components (parallax, fixed)
│       ├── contents/        # Content sections (animated-line, section-content)
│       └── general/         # General utilities (link, separator, scroll-top-button)
├── hooks/                   # Custom React hooks
├── lib/
│   ├── routes/              # Route definitions
│   └── resolvers/           # Icon resolver
├── stores/                  # Zustand state management
├── providers/               # React context providers (theme, etc.)
├── public/                  # Static assets
│   └── images/              # Chapter banner images
├── styles/                  # Exported style constants
└── config files             # (tsconfig, eslint, postcss, etc.)
```

## ✨ Features

- **Parallax Scrolling Effects** - Optimized full-screen and fixed banners with smooth parallax animations using Motion
- **Responsive Design** - Mobile and desktop optimized with adaptive layouts
- **Dark/Light Theme** - Theme toggle support with Zustand state management
- **Mobile Navigation** - Smooth drawer menu for mobile devices
- **Optimized Images** - Lazy-loaded and optimized banner images with Next.js Image component
- **Scroll-to-Top Button** - Quick navigation to page top
- **Custom Components** - Modular, reusable UI components (Link, Separator, etc.)

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd blog-fe
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env.local` (if needed):

```bash
NEXT_PUBLIC_APP_NAME="This is Our Story"
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

The page will auto-update as you edit files.

### Build

Build for production:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## 🚀 Deployment

### Local Preview

Preview the production build locally:

```bash
npm run preview
```

### Deploy to Cloudflare

Deploy to Cloudflare Workers:

```bash
npm run deploy
```

This uses OpenNextJS to build and deploy the Next.js app to Cloudflare's edge network.

## 📚 Key Components

### ParallaxBanner

Optimized full-screen banner with parallax scrolling effect. Used for chapter introductions and hero sections.

```tsx
<ParallaxBanner
  title="Chapter Title"
  subtitle="Subtitle"
  src="/images/banner.jpg"
  bgPos="center 55%"
  distance={300}
/>
```

### FixedBanner

Fixed position banner component with smooth animations and optimized image loading.

```tsx
<FixedBanner
  title="Chapter Title"
  subtitle="Subtitle"
  src="/images/banner.jpg"
/>
```

### SectionContent

Text content section between banners for storytelling.

```tsx
<SectionContent lines={["Line of text", "Another line"]} />
```

### ScrollTopButton

Floating button that smoothly scrolls the page back to the top.

```tsx
<ScrollTopButton />
```

### Separator

Reusable separator/divider component for visual content separation.

```tsx
<Separator />
```

### Link

Customized link component with consistent styling and behavior.

```tsx
<Link href="/blogs">View Blogs</Link>
```

### Navigation

- `PublicHeader` - Desktop navigation bar
- `MobileMenu` - Mobile menu drawer with smooth animations
- Routes defined in `lib/routes/index.ts`

## 🛣️ Roadmap

### Phase 1: MVP (Current) ✅

- [x] Story chapters with parallax effects
- [x] Responsive design
- [x] Dark/light theme toggle
- [x] Basic navigation
- [x] Mobile menu drawer
- [x] Image optimization and lazy loading
- [x] Parallax scrolling optimization
- [x] Modular reusable components (Link, Separator, ScrollTopButton)

### Phase 2: CMS Integration (Planned)

- [ ] Blog content management admin panel
- [ ] Dynamic blog post creation and editing
- [ ] Blog post listing and filtering
- [ ] Search functionality

### Phase 3: Enhanced Features (Future)

- [ ] Public user authentication and accounts
- [ ] Bookmarking/favorites
- [ ] Comment system
- [ ] Social sharing
- [ ] Analytics dashboard

## 🚀 Recent Improvements

**Latest Session Updates:**

- Implemented `ParallaxBanner` component with optimized scroll detection and smooth transitions
- Created reusable `Link` and `Separator` components for consistent UI
- Added `ScrollTopButton` with smooth scroll-to-top functionality
- Optimized parallax scroll performance using Motion library's `useScroll` and `useTransform` hooks
- Enhanced banner image loading and optimization (lazy loading and eager load strategies)
- Cleaned up component file naming conventions (kebab-case for new components)
- Improved mobile menu and navigation responsiveness
- Updated to latest Next.js 16 and React 19 with TypeScript support

## 🎨 Customization

### Theme

Edit CSS variables in `app/globals.css` to customize colors:

```css
:root {
  --accent: oklch(62.04% 0.195 140.75);
  --background: oklch(97.02% 0.02 140.75);
  /* ... more colors */
}
```

### Routes

Add new routes in `lib/routes/index.ts`:

```ts
export const NAV_ROUTES = [
  { href: "/", label: "Home", icon: "IoHome" },
  { href: "/blogs", label: "Blogs", icon: "LuBook" },
];
```

### Icons

Add new icon mappings in `lib/resolvers/icon-resolver.tsx`:

```ts
const iconMap = {
  IconName: IconComponent,
  // ...
};
```

## 📖 Related Projects

- **Backend API**: [blog-api](../blog-api) - Laravel GraphQL API serving content

## 📝 License

This project is private and proprietary.

## 📞 Contact

For questions or feedback, please reach out to the development team.

---

**Built with ❤️ for storytelling**
