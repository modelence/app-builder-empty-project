## Comprehensive Project Structure Overview

I've explored the Modelence application codebase. Here's a detailed breakdown of what's available:

### 1. PROJECT STRUCTURE

```
/user-app/
├── src/
│   ├── client/                      # React frontend
│   │   ├── assets/                  # Images/logos (favicon.svg, modelence.svg)
│   │   ├── components/
│   │   │   ├── ui/                  # Reusable UI components (shadcn-style)
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Label.tsx
│   │   │   │   └── Card.tsx
│   │   │   ├── LoadingSpinner.tsx    # Custom loading component
│   │   │   └── Page.tsx              # Page wrapper with header
│   │   ├── pages/                    # Route pages
│   │   │   ├── HomePage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── SignupPage.tsx
│   │   │   ├── ExamplePage.tsx
│   │   │   ├── PrivateExamplePage.tsx
│   │   │   ├── LogoutPage.tsx
│   │   │   ├── TermsPage.tsx
│   │   │   └── NotFoundPage.tsx
│   │   ├── lib/
│   │   │   └── utils.ts              # Utility functions (cn helper)
│   │   ├── router.tsx                # React Router configuration
│   │   ├── index.tsx                 # App entry point
│   │   ├── types.d.ts
│   │   └── index.css
│   │
│   └── server/                       # Node.js backend
│       ├── app.ts                    # Server entry point
│       └── example/
│           ├── index.ts              # Module definition with queries/mutations
│           ├── db.ts                 # Database schemas
│           └── cron.ts               # Scheduled jobs
│
├── Configuration Files
│   ├── tsconfig.json                 # TypeScript config with @/* path alias
│   ├── tailwind.config.js            # Tailwind CSS setup
│   ├── vite.config.ts                # Vite bundler config
│   ├── postcss.config.js
│   └── modelence.config.ts           # Modelence framework config
│
└── package.json                      # Dependencies & scripts
```

### 2. AVAILABLE UI COMPONENTS (SHADCN-STYLE)

All components are custom implementations located in `/user-app/src/client/components/ui/`:

#### Button Component (`/user-app/src/client/components/ui/Button.tsx`)
- **Variants**: default, destructive, outline, secondary, ghost, link
- **Sizes**: default, sm, lg, icon
- **Features**: Forward ref, fully styled with Tailwind, hover/active states
- **Props**: `ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>`

#### Input Component (`/user-app/src/client/components/ui/Input.tsx`)
- **Features**: Forward ref, styled with Tailwind
- **Supports**: All standard HTML input attributes
- **Styling**: Border, focus ring, dark mode, placeholder colors

#### Label Component (`/user-app/src/client/components/ui/Label.tsx`)
- **Features**: Semantic label element with peer-disabled states
- **Props**: `LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement>`

#### Card Component (`/user-app/src/client/components/ui/Card.tsx`)
- **Subcomponents**: 
  - `Card` - Main container
  - `CardHeader` - Header section with padding
  - `CardTitle` - Title text styling
  - `CardDescription` - Description text styling
  - `CardContent` - Content wrapper
  - `CardFooter` - Footer section

All components use the `cn()` utility function for class merging.

### 3. UTILITY FUNCTIONS

**File**: `/user-app/src/client/lib/utils.ts`

```typescript
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```
- Uses `clsx` for conditional classes
- Uses `tailwind-merge` to prevent class conflicts
- Perfect for merging component classes with custom overrides

### 4. EXISTING FORM PATTERNS

The app already has two working form examples you can reference:

#### LoginForm (`/user-app/src/client/pages/LoginPage.tsx`)
- Email and password fields
- `FormData` API for form submission
- Card-based layout with headers and footers
- Validation and error handling
- Links to signup

#### SignupForm (`/user-app/src/client/pages/SignupPage.tsx`)
- Email, password, confirm password
- Checkbox for terms acceptance
- Success state handling
- Client-side password validation
- Toast error notifications
- `useCallback` hook for form submission
- State management for success state

### 5. APP STRUCTURE & ARCHITECTURE

#### Client Setup (`/user-app/src/client/index.tsx`)
```typescript
- React Query (TanStack) integration
- React Router DOM
- React Hot Toast for notifications
- Suspense boundaries with loading state
- Global error handler
```

#### Router Configuration (`/user-app/src/client/router.tsx`)
- **Public Routes**: Home, Example, Terms, Logout, 404
- **Guest Routes**: Login, Signup (redirects to home if authenticated)
- **Private Routes**: PrivateExamplePage (redirects to login if not authenticated)
- **Route Protection**: 
  - `GuestRoute` component for auth-only pages
  - `PrivateRoute` component for protected pages
  - Redirect with `_redirect` query param to return after login

#### Page Wrapper (`/user-app/src/client/components/Page.tsx`)
- Header with logo, user info, logout button
- Responsive layout with max-width
- Body section with optional loading state
- Built-in navigation

### 6. MODULE SYSTEM (Backend)

**File**: `/user-app/src/server/example/index.ts`

Example shows Module pattern with:

```typescript
new Module('example', {
  configSchema: { /* configuration */ },
  stores: [ /* database stores */ ],
  queries: {
    getItem: async (args, { user }) => { /* query logic */ },
    getItems: async (args, { user }) => { /* query logic */ }
  },
  mutations: {
    createItem: async (args, { user }) => { /* mutation logic */ },
    updateItem: async (args, { user }) => { /* mutation logic */ }
  },
  cronJobs: {
    dailyTest: dailyTestCron
  }
})
```

#### Database Pattern (`/user-app/src/server/example/db.ts`)
```typescript
export const dbExampleItems = new Store('exampleItems', {
  schema: {
    title: schema.string(),
    createdAt: schema.date(),
    userId: schema.userId(),
  },
  indexes: []
});
```

### 7. KEY DEPENDENCIES

From `package.json`:
```json
{
  "@modelence/react-query": "^1.0.2",      // Modelence + React Query integration
  "@tanstack/react-query": "^5.90.12",     // Server state management
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.22.0",           // Client routing
  "react-hot-toast": "^2.4.1",             // Toast notifications
  "zod": "^4.1.13",                        // Schema validation
  "tailwindcss": "^3.4.1",                 // Styling
  "clsx": "^2.1.1",                        // Class utilities
  "tailwind-merge": "^3.4.0"               // Class merging
}
```

### 8. BUILD & DEVELOPMENT

**Scripts** (from package.json):
```bash
npm run dev          # Development server
npm run build        # Production build
npm start            # Start production server
npm test             # Run tests (not configured)
```

**Vite Configuration**:
- Root: `src/client`
- Path alias: `@/` → `./src/`
- Dev server: `0.0.0.0:5173` (allows external access)
- React plugin enabled

### 9. STYLING SETUP

- **Tailwind CSS**: Configured with `src/client/**/*.{js,jsx,ts,tsx}` content paths
- **PostCSS**: Enabled with autoprefixer
- **Color Scheme**: Gray, black, white primary colors; blue, red accents

### 10. AVAILABLE PATTERNS FOR TODO LIST FORM

You can reuse:

1. **Form Structure**: FormData API like in LoginPage/SignupPage
2. **Validation**: Zod on backend, client-side checks in form
3. **UI Components**: Button, Input, Label, Card for form container
4. **Page Layout**: Use Page wrapper component
5. **Toast Notifications**: `react-hot-toast` for feedback
6. **State Management**: React Query for server state
7. **Hooks**: `useCallback`, `useState`, `useMutation`, `useQuery`
8. **Styling**: Use `cn()` utility to combine classes

### Summary

This is a full-stack Modelence framework application with:
- Clean component structure ready for a todo list feature
- All necessary UI building blocks already available
- Form handling patterns established
- Database and backend module patterns ready to follow
- Authentication system in place
- TypeScript support throughout
- No external shadcn/ui dependency needed - custom components are already implemented
