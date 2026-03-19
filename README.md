# Mai Bharat Bol Raha Hoon

A Hindi news/blog platform with YouTube video embeds, powered by GitOps content management.

## Architecture

### Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| UI Components | @tesserix/web (design system) |
| Auth & Roles | Clerk (Admin + Super Admin) |
| Content | MDX/JSON files in Git (GitOps) |
| Content Management | GitHub API (branch + PR workflow) |
| Search | Pagefind (static search index) |
| Images | Vercel Blob / Cloudinary (free tier) |
| Hosting | Vercel |
| Database | None (Git-backed content) |

### Content Workflow

```
Admin writes article (Rich Text Editor)
  → Saves as MDX → GitHub API creates branch + PR
    → Super Admin reviews PR
      → Approves & merges
        → Vercel auto-rebuilds → Article is live
      → Requests changes
        → Admin edits → updates PR
```

### Roles & Permissions

| Action | Admin | Super Admin |
|--------|-------|-------------|
| Create/Edit articles | ✅ | ✅ |
| Save as draft | ✅ | ✅ |
| Submit for review (create PR) | ✅ | ✅ |
| Approve/Reject (merge/close PR) | ❌ | ✅ |
| Publish (merge triggers deploy) | ❌ | ✅ |
| Manage categories | ❌ | ✅ |
| Manage users | ❌ | ✅ |

## Project Structure

```
maibharatbolrahahoon/
├── app/
│   ├── (public)/                 # Public-facing pages
│   │   ├── page.tsx              # Homepage — latest articles
│   │   ├── article/[slug]/       # Article detail page
│   │   │   └── page.tsx          #   YouTube embeds, content
│   │   ├── category/[slug]/      # Category listing
│   │   │   └── page.tsx
│   │   └── search/               # Search results (Pagefind)
│   │       └── page.tsx
│   ├── (admin)/                  # Protected admin area (Clerk)
│   │   ├── layout.tsx            # Admin layout with sidebar
│   │   ├── dashboard/            # Stats & overview
│   │   │   └── page.tsx
│   │   ├── articles/             # Article management
│   │   │   ├── page.tsx          #   List all articles
│   │   │   ├── new/page.tsx      #   Create article (Rich Editor)
│   │   │   └── [id]/page.tsx     #   Edit article
│   │   ├── media/                # Image/video library
│   │   │   └── page.tsx
│   │   ├── categories/           # Category management (Super Admin)
│   │   │   └── page.tsx
│   │   ├── review/               # Approval queue (Super Admin)
│   │   │   └── page.tsx
│   │   └── users/                # User management (Super Admin)
│   │       └── page.tsx
│   ├── api/                      # API routes
│   │   ├── articles/             # CRUD via GitHub API
│   │   ├── github/               # GitHub webhook handler
│   │   └── clerk/                # Clerk webhook handler
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Theme import
├── content/                      # GitOps content store
│   ├── articles/                 # MDX article files
│   │   ├── sample-article.mdx
│   │   └── ...
│   ├── categories.json           # Category definitions
│   └── authors.json              # Author profiles
├── components/
│   ├── article/                  # Article-specific components
│   │   ├── ArticleCard.tsx       #   Card for listings
│   │   ├── ArticleList.tsx       #   Grid/list of articles
│   │   ├── ArticleContent.tsx    #   MDX renderer
│   │   └── YouTubeEmbed.tsx      #   Responsive YouTube player
│   ├── editor/                   # Admin editor components
│   │   ├── ArticleEditor.tsx     #   Wraps Tesserix RichTextEditor
│   │   ├── FrontmatterForm.tsx   #   Title, category, cover image
│   │   └── YouTubeInsert.tsx     #   YouTube URL → embed tool
│   └── layout/                   # Shared layout components
│       ├── Navbar.tsx
│       ├── Footer.tsx
│       ├── AdminSidebar.tsx
│       └── PublicHeader.tsx
├── lib/
│   ├── github.ts                 # GitHub API client (create branch, PR, commit)
│   ├── content.ts                # Read/parse MDX content from filesystem
│   ├── mdx.ts                    # MDX compilation & components
│   └── utils.ts                  # Helpers (slug generation, etc.)
├── public/
│   └── images/                   # Static images (logo, icons)
├── clerk.config.ts               # Clerk configuration
├── next.config.ts                # Next.js configuration
├── tailwind.config.ts            # Tailwind + Tesserix theme
├── package.json
├── tsconfig.json
└── .env.local.example            # Environment variables template
```

## Content Format (MDX)

Each article is an MDX file with frontmatter:

```mdx
---
title: "Article Title Here"
slug: "article-title-here"
excerpt: "Brief description of the article"
coverImage: "https://cdn.example.com/cover.jpg"
category: "politics"
author: "author-id"
youtubeUrls:
  - "https://youtube.com/watch?v=xxxxx"
  - "https://youtube.com/watch?v=yyyyy"
status: "published"
publishedAt: "2026-03-09T00:00:00Z"
createdAt: "2026-03-08T00:00:00Z"
updatedAt: "2026-03-09T00:00:00Z"
---

Article content goes here with full markdown support.

<YouTubeEmbed url="https://youtube.com/watch?v=xxxxx" />

More content below the video...
```

## Tesserix Design System Components

### Public Pages
- `Card` — Article cards on homepage/category pages
- `Badge` — Category tags
- `SearchBar` — Article search (Pagefind)
- `Pagination` — Article list pagination
- `Skeleton` — Loading states
- `Breadcrumb` — Navigation breadcrumbs

### Admin Pages
- `AppShell` — Admin layout wrapper
- `Sidebar` + `SidebarNav` — Admin navigation
- `TopNav` + `PageHeader` — Page headers
- `DashboardLayout` + `DashboardCard` + `Stat` — Dashboard stats
- `DataTable` — Article list with filters/sort
- `RichTextEditor` — Article content editing
- `Input`, `Select`, `FileUpload` — Form fields
- `StatusBadge` — Draft/Review/Published status
- `AlertDialog` — Confirm publish/delete
- `Toast` — Success/error notifications
- `Tag` — Category management

## Environment Variables

```bash
# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_xxx
CLERK_SECRET_KEY=sk_xxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# GitHub API (for GitOps content management)
GITHUB_TOKEN=ghp_xxx
GITHUB_REPO_OWNER=anardam
GITHUB_REPO_NAME=maibharatbolrahahoon
GITHUB_CONTENT_BRANCH=main

# Image Storage
BLOB_READ_WRITE_TOKEN=xxx          # Vercel Blob
# OR
CLOUDINARY_CLOUD_NAME=xxx          # Cloudinary

# Pagefind
NEXT_PUBLIC_SITE_URL=https://maibharatbolrahahoon.vercel.app
```

## Implementation Phases

### Phase 1 — Foundation
- [ ] Initialize Next.js 16 project
- [ ] Install & configure Tesserix design system (@tesserix/web)
- [ ] Set up Tailwind with Tesserix theme (crimson/orange)
- [ ] Configure Clerk auth with Admin + Super Admin roles
- [ ] Set up project structure (folders, layouts)

### Phase 2 — Public Site
- [ ] Homepage with article cards grid
- [ ] Article detail page with MDX rendering
- [ ] YouTubeEmbed component (responsive, lazy-loaded)
- [ ] Category pages
- [ ] Navbar + Footer with branding
- [ ] SEO metadata (Open Graph, Twitter cards)

### Phase 3 — Admin Panel
- [ ] Admin layout (AppShell + Sidebar)
- [ ] Dashboard with article stats
- [ ] Article list (DataTable with status filters)
- [ ] Article editor (RichTextEditor + frontmatter form)
- [ ] YouTube URL insert tool in editor
- [ ] Image upload (Vercel Blob / Cloudinary)
- [ ] Role-based route protection (Clerk middleware)

### Phase 4 — GitOps Workflow
- [ ] GitHub API integration (create branch, commit, PR)
- [ ] "Save Draft" → commits to branch
- [ ] "Submit for Review" → creates PR
- [ ] Super Admin review queue → list open PRs
- [ ] Approve → merge PR → triggers Vercel rebuild
- [ ] Reject → close PR with comments

### Phase 5 — Search & Polish
- [ ] Integrate Pagefind for static search
- [ ] Add loading states (Skeleton components)
- [ ] Mobile responsive design
- [ ] Dark mode support
- [ ] Performance optimization (image lazy loading, ISR)

### Phase 6 — Launch
- [ ] Custom domain setup
- [ ] Analytics integration
- [ ] Social sharing buttons
- [ ] RSS feed generation
- [ ] Final testing & deploy
