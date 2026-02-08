# This is Our Story 🥔🍊

A Next.js frontend for the blogging platform that tells the story of potato and olenji.

## Overview

This is the frontend application for the "This is Our Story" blog. Currently, it displays a story divided into chapters with parallax banner effects. The backend API serves the content through GraphQL.

## 🚀 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) - React framework with App Router
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- **UI Components**: [HeroUI](https://heroui.com/) - Beautiful React components
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/) - Icon library
- **Deployment**: [OpenNextJS + Cloudflare Workers](https://opennextjs.dev/) - Edge computing
- **Language**: TypeScript - Type-safe JavaScript

## 📁 Project Structure

```
blog-fe/
├── app/                    # Next.js app directory
│   └── (public)/          # Public routes group
│       ├── page.tsx       # Home page with story chapters
│       ├── blogs/         # Blog listing page
│       └── layout.tsx     # Layout with navigation
├── components/
│   ├── nav/              # Navigation components
│   │   └── public/
│   │       ├── header.tsx      # Desktop navigation
│   │       ├── mobile-menu.tsx # Mobile drawer menu
│   │       └── footer.tsx      # Footer
│   └── ui/               # Reusable UI components
│       ├── banners/      # FixedBanner with parallax
│       ├── contents/     # Content sections
│       └── general/      # General utilities
├── lib/
│   ├── routes/           # Route definitions
│   └── resolvers/        # Icon resolver
├── hooks/                # Custom React hooks
├── stores/               # Zustand stores
└── public/               # Static assets
    └── images/           # Chapter banner images
```

## ✨ Features

- **Parallax Effect** - Full-screen banners with parallax scrolling
- **Responsive** - Mobile and desktop optimized
- **Dark/Light Theme** - Theme toggle support
- **Mobile Menu** - Drawer navigation for mobile devices

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

### FixedBanner

Full-screen banner with parallax scrolling effect. Used for chapter introductions.

```tsx
<FixedBanner
  title="Chapter Title"
  subtitle="Subtitle"
  bgImage="/images/banner.jpg"
  bgPos="center 55%"
/>
```

### SectionContent

Text content section between banners for storytelling.

```tsx
<SectionContent lines={["Line of text", "Another line"]} />
```

### Navigation

- `PublicHeader` - Desktop navigation bar
- `MobileMenu` - Mobile menu drawer with smooth animations
- Routes defined in `lib/routes/index.ts`

## 🛣️ Roadmap

### Phase 1: Current (MVP)

- [x] Story chapters with parallax effects
- [x] Responsive design
- [x] Dark/light theme toggle
- [x] Basic navigation

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
