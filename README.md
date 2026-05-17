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

## Deployment

- **Frontend**: Deploy `client/` to Vercel
- **Backend**: Deploy `server/` to Railway or Render
- **Database**: MongoDB Atlas (free M0 cluster)

## License
MIT
