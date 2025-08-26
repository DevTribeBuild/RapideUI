# Guide: Setting up a Wallet-Focused Next.js App

This guide outlines the steps to create a Next.js application with a focus on replicating the wallet functionality, leveraging the existing project's architecture and technologies.

## 1. Core Technologies

The existing project uses:
*   **Frontend Framework:** Next.js (React)
*   **UI Library:** Material-UI (MUI) with Emotion for styling
*   **State Management:** Zustand
*   **API Integration:** Apollo Client for GraphQL
*   **Deployment:** Cloudflare Workers (via `@cloudflare/next-on-pages`)

## 2. Project Structure Overview (Wallet Context)

The wallet section is located at `src/app/(DashboardLayout)/wallet/page.tsx`. It integrates with:
*   **GraphQL:** `src/graphql/wallet/queries.ts` and `src/graphql/wallet/mutations.ts` define the API interactions.
*   **Apollo Client:** `src/apolloClient.ts` and `src/app/providers/ApolloProviderWrapper.tsx` handle GraphQL client setup and providing it to the React tree.
*   **Authentication:** `src/stores/useAuthStore.ts` manages user authentication state, which is crucial for authenticated GraphQL requests.
*   **UI Components:** Standard Material-UI components are used for the interface.

## 3. Setup Steps for a New Application

### 3.1. Initialize Next.js Project

Start by creating a new Next.js application.

```bash
npx create-next-app@latest my-wallet-app --typescript --eslint --app --src-dir --use-pnpm --tailwind=false
cd my-wallet-app
```

### 3.2. Install Dependencies

Install the necessary packages for Material-UI, Emotion, Apollo Client, GraphQL, Zustand, and other utilities.

```bash
pnpm add @mui/material @emotion/react @emotion/styled @apollo/client graphql zustand react-hot-toast
pnpm add -D @cloudflare/next-on-pages wrangler
```

### 3.3. Configure `next.config.js`

Update `next.config.js` to allow image domains and potentially other Next.js configurations.

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.pixabay.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
      },
      {
        protocol: 'https',
        hostname: 'www.gravatar.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },
};

module.exports = nextConfig;
```

### 3.4. Set up Apollo Client

Create `src/apolloClient.ts` for Apollo Client configuration, including `authLink` for token-based authentication.

```typescript
// src/apolloClient.ts
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { registerApolloClient } from '@apollo/experimental-nextjs-app-support/rsc';
import useAuthStore from './stores/useAuthStore'; // Adjust path as needed

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_API_URL || 'https://zyntra-backend-1.onrender.com/graphql/', // Replace with your GraphQL API URL
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = useAuthStore.getState().token; // Access token from Zustand store
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

export const { getClient } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink),
  });
});

// For client-side usage (e.g., in components)
export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
});
```

### 3.5. Create Apollo Provider Wrapper

Create `src/app/providers/ApolloProviderWrapper.tsx` to wrap your application with Apollo Provider.

```typescript
// src/app/providers/ApolloProviderWrapper.tsx
'use client';

import { ApolloLink, HttpLink } from '@apollo/client';
import {
  ApolloNextAppProvider,
  NextSSRInMemoryCache,
  SSRMultipartLink,
} from '@apollo/experimental-nextjs-app-support/ssr';
import { setContext } from '@apollo/client/link/context';
import useAuthStore from '@/stores/useAuthStore'; // Adjust path as needed

function makeClient() {
  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_API_URL || 'https://zyntra-backend-1.onrender.com/graphql/', // Replace with your GraphQL API URL
  });

  const authLink = setContext((_, { headers }) => {
    const token = useAuthStore.getState().token;
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    };
  });

  return new ApolloClient({
    cache: new NextSSRInMemoryCache(),
    link:
      typeof window === 'undefined'
        ? ApolloLink.from([
            new SSRMultipartLink({
              stripDefer: true,
            }),
            authLink,
            httpLink,
          ])
        : ApolloLink.from([authLink, httpLink]),
  });
}

export function ApolloProviderWrapper({ children }: React.PropsWithChildren) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}
```

### 3.6. Update Root Layout (`src/app/layout.tsx`)

Integrate the Apollo Provider and Emotion cache into your root layout.

```typescript
// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './global.css'; // Your global styles
import { ApolloProviderWrapper } from './providers/ApolloProviderWrapper';
import ThemeRegistry from '@/utils/ThemeRegistry'; // You'll create this for MUI theming

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Wallet App',
  description: 'A Next.js wallet application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ApolloProviderWrapper>
          <ThemeRegistry>
            {children}
          </ThemeRegistry>
        </ApolloProviderWrapper>
      </body>
    </html>
  );
}
```

### 3.7. Implement Material-UI Theming (`src/utils/ThemeRegistry.tsx`)

Create `src/utils/ThemeRegistry.tsx` and `src/utils/createEmotionCache.ts` for Material-UI and Emotion setup.

**`src/utils/createEmotionCache.ts`**
```typescript
// src/utils/createEmotionCache.ts
import createCache from '@emotion/cache';

export default function createEmotionCache() {
  return createCache({ key: 'css', prepend: true });
}
```

**`src/utils/ThemeRegistry.tsx`**
```typescript
// src/utils/ThemeRegistry.tsx
'use client';

import * as React from 'react';
import createCache from '@emotion/cache';
import { useServerInsertedHTML } from 'next/navigation';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme'; // Your MUI theme definition

// This is the default emotion cache, you can customize it
const defaultCache = createCache({ key: 'mui', prepend: true });

export default function ThemeRegistry(props: { children: React.ReactNode }) {
  const { children } = props;

  const [emotionCache] = React.useState(() => {
    const cache = createCache({ key: 'mui', prepend: true });
    cache.compat = true;
    return cache;
  });

  useServerInsertedHTML(() => {
    return (
      <style
        data-emotion={`${emotionCache.key} ${emotionCache.inserted.join(' ')}`}
        dangerouslySetInnerHTML={{
          __html: Object.values(emotionCache.inserted).join(' '),
        }}
      />
    );
  });

  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}
```

### 3.8. Define Material-UI Theme (`src/utils/theme.ts`)

Create `src/utils/theme.ts` for your Material-UI theme. You can also create `src/utils/theme/DefaultColors.tsx` for color definitions if needed.

**`src/utils/theme.ts`**
```typescript
// src/utils/theme.ts
import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
  },
});

export default theme;
```

### 3.9. Implement Zustand Auth Store (`src/stores/useAuthStore.ts`)

Create `src/stores/useAuthStore.ts` for managing authentication state.

```typescript
// src/stores/useAuthStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  user: any | null; // Define a proper user type
  setToken: (token: string | null) => void;
  setUser: (user: any | null) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setToken: (token) => set({ token }),
      setUser: (user) => set({ user }),
      logout: () => set({ token: null, user: null }),
    }),
    {
      name: 'auth-storage', // name of the item in storage (e.g., localStorage)
      storage: createJSONStorage(() => localStorage), // use localStorage
    }
  )
);

export default useAuthStore;
```

### 3.10. Copy Wallet-Specific Files

Copy the following files from the original project to your new `my-wallet-app` project, maintaining the directory structure:

*   `src/app/(DashboardLayout)/wallet/page.tsx` (You might need to create `src/app/(DashboardLayout)/` first)
*   `src/graphql/wallet/queries.ts`
*   `src/graphql/wallet/mutations.ts`
*   Any shared components or utilities that `page.tsx` or the GraphQL files depend on (e.g., `src/app/(DashboardLayout)/components/dashboard/QuantityAdjuster.tsx` if used).

**Example: Creating the wallet page**

```typescript
// src/app/(DashboardLayout)/wallet/page.tsx
// This is a placeholder. Copy the actual content from the original project.
import React from 'react';
import { Typography, Box } from '@mui/material';

const WalletPage = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Wallet
      </Typography>
      <Typography variant="body1">
        This is the wallet section. Implement your wallet UI and logic here.
      </Typography>
      {/* Add your wallet components, GraphQL queries/mutations here */}
    </Box>
  );
};

export default WalletPage;
```

### 3.11. Configure Cloudflare Workers (Optional for Local Development)

If you plan to deploy to Cloudflare Workers, configure `wrangler.toml` in the root of your project.

```toml
# wrangler.toml
name = "my-wallet-app"
main = "src/index.ts" # This might be generated by next-on-pages
compatibility_date = "2023-11-21" # Use a recent date

[site]
bucket = "./.next/static" # This is where Next.js static assets are built
entry-point = "./.next/server" # This is where Next.js server-side code is built
```

Add a build script to your `package.json`:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "deploy": "pnpm run build && npx @cloudflare/next-on-pages"
}
```

### 3.12. Global Styles

Ensure `src/app/global.css` exists and contains any necessary global styles.

```css
/* src/app/global.css */
html,
body {
  padding: 0;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
}

a {
  color: inherit;
  text-decoration: none;
}

* {
  box-sizing: border-box;
}
```

## 4. Running the Application

To run your new wallet-focused application locally:

```bash
pnpm dev
```

Access your application at `http://localhost:3000` (or the port indicated by Next.js). The wallet page should be accessible at `/wallet` (or the path you configure in your `(DashboardLayout)`).

## 5. Further Development

*   **Implement Wallet Logic:** Populate `src/app/(DashboardLayout)/wallet/page.tsx` with the actual UI components and integrate with the GraphQL queries and mutations.
*   **Error Handling & Loading States:** Add robust error handling and loading states for your GraphQL operations.
*   **Testing:** Write unit and integration tests for your wallet components and GraphQL interactions.
*   **Styling:** Refine the Material-UI theme and component styling to match your desired aesthetic.
*   **Authentication Flow:** Ensure the authentication flow (login, token refresh, logout) is fully functional and integrated with your Apollo Client.
