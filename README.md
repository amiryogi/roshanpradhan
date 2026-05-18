# Artist Portfolio with CMS

A full-stack artist portfolio website with a CMS admin dashboard built with the MERN stack.

## Tech Stack

### Frontend
- React 18 + TypeScript + Vite
- Tailwind CSS + ShadCN UI
- TanStack Query + Zustand
- React Hook Form + Zod

### Backend
- Node.js 20 + Express + TypeScript
- MongoDB Atlas + Mongoose
- JWT Authentication
- Cloudinary (image hosting)

## Getting Started

### Prerequisites
- Node.js >= 20
- MongoDB Atlas account
- Cloudinary account

### Server Setup

```bash
cd server
cp .env.example .env
# Fill in your .env values
npm install
npm run seed    # Creates admin user
npm run dev     # Starts dev server on :5000
```

### Client Setup

```bash
cd client
cp .env.example .env
npm install
npm run dev     # Starts dev server on :5173
```

### URLs
- Public site: http://localhost:5173
- Admin login: http://localhost:5173/admin/login
- API health: http://localhost:5000/health

## SEO

### Canonical Domain
- Production canonical domain: `https://roshanpradhan.vercel.app`

### Implemented SEO Assets
- Base metadata, Open Graph, Twitter tags, and baseline JSON-LD in `client/index.html`
- Route-level SEO metadata via `client/src/hooks/useSEO.ts`
- Crawl files:
	- `client/public/robots.txt`
	- `client/public/sitemap.xml`

### Where To Update Metadata
- Update page-specific SEO in each public route component under `client/src/pages/public/`
- Update shared site constants in `client/src/lib/seo.ts`

### Optional Environment Variable
- You can set `VITE_SITE_URL` in `client/.env` for canonical/meta URL generation.
- If unset, the client defaults to `https://roshanpradhan.vercel.app`.

### SEO QA Checklist
1. Run `npm run lint` and `npm run build` inside `client/`
2. Verify route metadata (title, description, canonical, OG/Twitter) in browser devtools
3. Verify `https://<domain>/robots.txt` and `https://<domain>/sitemap.xml`
4. Run Lighthouse SEO audit on major public routes
5. Validate JSON-LD with schema validation tools

## Image Optimization

- Generate modern static image formats from `client/public` source JPG/JPEG files:

```bash
cd client
npm run images:optimize
```

- This creates `.webp` and `.avif` variants beside each source image.
- Public pages use AVIF/WebP with JPEG fallback for key visuals.

## Deployment

- **Frontend**: Deploy `client/` to Vercel
- **Backend**: Deploy `server/` to Railway or Render
- **Database**: MongoDB Atlas (free M0 cluster)

## License
MIT
