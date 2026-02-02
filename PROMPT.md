# UpStore v2 - Technical Specification

## Project Overview

Modern e-commerce platform with SSR, built with Next.js 14, Prisma, PostgreSQL, TanStack Query, Zustand, and Tailwind CSS.

### Design Philosophy

- **iOS-style aesthetic**: Rounded corners, glassmorphism, smooth animations
- **Dark theme**: Black background (#000000) with white/gray text and orange (#FF6B00) accents
- **Mobile-first responsive design**
- **Minimalist clean UI**

---

## Technology Stack

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| **Framework** | Next.js | 14.2.x | App Router, SSR, API Routes |
| **Language** | TypeScript | 5.x | Type safety |
| **UI Library** | React | 18.3.x | Components |
| **Database** | PostgreSQL | - | Data storage |
| **ORM** | Prisma | 5.x | Type-safe database access |
| **State** | Zustand | 4.5.x | Client state management |
| **Data Fetching** | TanStack Query | 5.x | Server state, caching |
| **Authentication** | NextAuth.js | 4.x | Admin authentication |
| **Styling** | Tailwind CSS | 3.4.x | Utility-first CSS |
| **UI Components** | Radix UI | 1.x | Headless accessible components |
| **Validation** | Zod | 3.x | Schema validation |
| **Icons** | Lucide React | 0.x | SVG icons |

---

## Directory Structure

```
upstore-v2/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── admin/               # Protected admin endpoints
│   │   │   ├── products/        # Products CRUD
│   │   │   ├── categories/      # Categories CRUD
│   │   │   ├── banners/         # Banners CRUD
│   │   │   └── settings/        # Settings update
│   │   ├── auth/[...nextauth]/  # NextAuth handler
│   │   ├── products/            # Public products API
│   │   ├── categories/          # Public categories API
│   │   ├── banners/             # Public banners API
│   │   ├── settings/            # Public settings API
│   │   ├── popular-searches/    # Popular searches API
│   │   ├── links/               # Social links API
│   │   ├── logos/               # Brand logos API
│   │   └── upload/              # File upload API
│   ├── admin/                   # Admin panel pages
│   │   ├── login/page.tsx       # Login page
│   │   └── page.tsx             # Admin dashboard
│   ├── product/[id]/page.tsx    # Product detail page (SSR)
│   ├── page.tsx                 # Home page (client)
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles with Tailwind
├── components/
│   ├── ui/                      # Reusable UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   ├── select.tsx
│   │   ├── tabs.tsx
│   │   ├── switch.tsx
│   │   ├── textarea.tsx
│   │   ├── card.tsx
│   │   ├── skeleton.tsx
│   │   ├── label.tsx
│   │   └── index.ts
│   ├── layout/
│   │   └── header.tsx           # Site header
│   ├── home/
│   │   ├── banner-slider.tsx    # Hero banner carousel
│   │   ├── logo-marquee.tsx     # Infinite logo scroll
│   │   ├── category-slider.tsx  # Category cards scroll
│   │   ├── product-grid.tsx     # Products grid
│   │   └── search.tsx           # Search bar and overlay
│   ├── product/
│   │   └── product-page-client.tsx  # Product detail client component
│   ├── admin/
│   │   ├── admin-panel.tsx      # Admin panel container
│   │   ├── products-tab.tsx     # Products management
│   │   ├── categories-tab.tsx   # Categories management
│   │   ├── banners-tab.tsx      # Banners management
│   │   └── settings-tab.tsx     # Settings form
│   └── providers.tsx            # React Query + NextAuth providers
├── hooks/
│   ├── use-products.ts          # Public data hooks
│   └── use-admin.ts             # Admin mutations hooks
├── stores/
│   ├── ui-store.ts              # UI state (search, modals)
│   └── product-store.ts         # Product page state
├── lib/
│   ├── db.ts                    # Prisma client singleton
│   ├── auth.ts                  # NextAuth configuration
│   ├── utils.ts                 # Utility functions
│   └── validations.ts           # Zod schemas
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── seed.ts                  # Seed data script
├── public/
│   ├── uploads/                 # User uploads
│   │   ├── products/
│   │   ├── banners/
│   │   └── categories/
│   ├── src/                     # Static assets
│   │   ├── img/logo.svg
│   │   ├── svg/
│   │   ├── logoanim/
│   │   └── price/placeholder.png
│   └── manifest.json            # PWA manifest
├── middleware.ts                # Auth middleware
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
├── next.config.js
├── .env.example
└── .gitignore
```

---

## Database Schema (Prisma)

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  passwordHash  String
  name          String?
  role          Role      @default(ADMIN)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

enum Role {
  ADMIN
  SUPERADMIN
}

model Product {
  id          String   @id @default(cuid())
  code        String   @unique       // PRD00001
  name        String
  description String?  @db.Text
  mainImage   String?
  sortOrder   Int      @default(0)
  active      Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  category    Category? @relation(fields: [categoryId], references: [id])
  categoryId  String?
  
  options     ProductOption[]
  variants    ProductVariant[]
}

model ProductOption {
  id        String   @id @default(cuid())
  name      String                   // "Цвет", "Память"
  sortOrder Int      @default(0)
  
  product   Product  @relation(...)
  productId String
  
  values    ProductOptionValue[]
}

model ProductOptionValue {
  id        String  @id @default(cuid())
  value     String                   // "Синий", "256GB"
  colorCode String?                  // "#0000FF"
  image     String?                  // Color-specific image
  sortOrder Int     @default(0)
  
  option    ProductOption @relation(...)
  optionId  String
}

model ProductVariant {
  id           String  @id @default(cuid())
  optionValues Json    @default("[]")  // ["valueId1", "valueId2"]
  price        Float   @default(0)
  oldPrice     Float?
  inStock      Boolean @default(true)
  
  product      Product @relation(...)
  productId    String
}

model Category {
  id        String    @id @default(cuid())
  name      String
  slug      String    @unique
  icon      String?                  // Image URL
  sortOrder Int       @default(0)
  active    Boolean   @default(true)
  
  products  Product[]
}

model Banner {
  id           String   @id @default(cuid())
  image        String                // Mobile image
  imageDesktop String?               // Desktop image
  link         String?
  sortOrder    Int      @default(0)
  active       Boolean  @default(true)
}

model Setting {
  key   String @id
  value String
}

model PopularSearch {
  id        String @id @default(cuid())
  query     String
  sortOrder Int    @default(0)
}

model Link {
  id        String  @id @default(cuid())
  name      String
  url       String
  icon      String? @db.Text         // SVG icon
  sortOrder Int     @default(0)
  active    Boolean @default(true)
}
```

---

## API Endpoints

### Public API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List active products (with search, category filter) |
| GET | `/api/products/[id]` | Get single product with options/variants |
| GET | `/api/categories` | List active categories |
| GET | `/api/banners` | List active banners |
| GET | `/api/settings` | Get all settings |
| GET | `/api/popular-searches` | List popular search terms |
| GET | `/api/links` | List active social links |
| GET | `/api/logos` | List brand logo images |

### Admin API (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/products` | List all products |
| POST | `/api/admin/products` | Create product |
| PUT | `/api/admin/products` | Update product |
| DELETE | `/api/admin/products?id=` | Delete product |
| GET/POST/PUT/DELETE | `/api/admin/categories` | Categories CRUD |
| GET/POST/PUT/DELETE | `/api/admin/banners` | Banners CRUD |
| POST | `/api/admin/settings` | Update settings |
| POST | `/api/upload` | Upload file |

---

## Design System

### Colors (Tailwind CSS Variables)

```css
:root {
  --background: 0 0% 0%;           /* #000000 */
  --foreground: 0 0% 100%;         /* #FFFFFF */
  --primary: 24 100% 50%;          /* #FF6B00 - Orange */
  --muted: 0 0% 15%;               /* #262626 */
  --border: 0 0% 20%;              /* #333333 */
}
```

### Typography

- **Font**: Inter (system fallback)
- **Headings**: font-semibold
- **Body**: font-normal
- **Small**: text-sm text-white/60

### Spacing & Sizing

- Border radius: `rounded-xl` (0.75rem) / `rounded-2xl` (1rem)
- Container padding: `px-4` (1rem)
- Card padding: `p-4` to `p-6`
- Button heights: `h-10` (default), `h-12` (lg), `h-14` (xl)

### Glass Effect

```tsx
className="glass" // bg-white/10 backdrop-blur-xl border border-white/20
```

### Animations

```tsx
// Fade in up (staggered product cards)
animate-fade-in-up  // opacity 0→1, translateY 20px→0
animation-delay-100 // 100ms delay

// Infinite marquee (logo scroll)
animate-marquee     // translateX 0→-50%
```

---

## Key Patterns

### Server Component + Client Component

```tsx
// app/product/[id]/page.tsx (Server Component)
export default async function ProductPage({ params }) {
  const product = await prisma.product.findUnique({ ... });
  return <ProductPageClient product={product} />;
}

// components/product/product-page-client.tsx (Client Component)
'use client';
export function ProductPageClient({ product }) {
  const [selectedOptions, setSelectedOptions] = useState({});
  // ...
}
```

### React Query Hook

```tsx
// hooks/use-products.ts
export function useProducts(params?: { search?: string }) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => fetch(`/api/products?...`).then(r => r.json()),
    staleTime: 60 * 1000,
  });
}
```

### Zustand Store

```tsx
// stores/ui-store.ts
export const useUIStore = create<UIState>((set) => ({
  isSearchOpen: false,
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),
}));
```

### Form with Zod Validation

```tsx
// lib/validations.ts
export const productSchema = z.object({
  name: z.string().min(1, 'Название обязательно'),
  price: z.number().min(0),
});

// In component
const validation = productSchema.safeParse(data);
if (!validation.success) {
  return { error: validation.error.errors };
}
```

---

## Authentication Flow

1. User visits `/admin` → middleware redirects to `/admin/login`
2. User submits credentials → NextAuth validates with `authorize()`
3. NextAuth creates JWT session
4. Protected API routes check `getServerSession()`
5. Logout calls `signOut()` and redirects to `/`

---

## File Upload

```tsx
// app/api/upload/route.ts
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  const type = formData.get('type') as string;
  
  const filename = `${uuidv4()}${path.extname(file.name)}`;
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', type);
  
  await writeFile(path.join(uploadDir, filename), buffer);
  return { url: `/uploads/${type}/${filename}` };
}
```

---

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/db?sslmode=require"

# NextAuth
NEXTAUTH_SECRET="random-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

---

## Commands

```bash
npm run dev          # Development server
npm run build        # Production build
npm start            # Start production

npm run db:push      # Apply schema to database
npm run db:migrate   # Create migration
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed initial data
```

---

## Default Admin Credentials

- **Email**: admin@upstore.ru
- **Password**: admin123

---

## Deployment Notes

### Vercel

- Set environment variables in Vercel dashboard
- Prisma client generates automatically via `postinstall`
- PostgreSQL must be accessible from Vercel (use Neon/Supabase)

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

---

## Migration from v1 (SQLite)

1. Export data from SQLite
2. Transform JSON structure
3. Import via Prisma seed script
4. Update image paths if needed

---

## Key Differences from v1

| Feature | v1 (SQLite) | v2 (PostgreSQL) |
|---------|-------------|-----------------|
| Database | SQLite + better-sqlite3 | PostgreSQL + Prisma |
| State | useState everywhere | Zustand + TanStack Query |
| Styling | Pure CSS (1700 lines) | Tailwind CSS |
| Forms | Manual validation | Zod schemas |
| Auth | None | NextAuth.js |
| File upload | Local only | Local (cloud-ready) |
| Deployment | VPS only | Vercel/Railway/VPS |
