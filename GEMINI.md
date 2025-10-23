# Project Overview

This is a Next.js project built with React, Material-UI, Apollo Client, and Zustand. It is configured for deployment with Cloudflare Workers.

## Key Features:

*   **Frontend Framework:** Next.js (React)
*   **UI Library:** Material-UI
*   **State Management:** Zustand
*   **API Integration:** Apollo Client for GraphQL
*   **Authentication:** Token-based authentication managed via Zustand and integrated with Apollo Client's `authLink`.
*   **Deployment:** Configured for Cloudflare Workers using `@cloudflare/next-on-pages` and `wrangler`.
*   **Project Structure:** Includes a dashboard layout with various pages for different functionalities (e.g., authentication, cart, explore, dashboard sections).
*   **Styling:** Uses Emotion for styling, integrated with Material-UI.
*   **Notifications:** `react-hot-toast` for displaying toast notifications.
*   **Image Handling:** Configured `next.config.js` to allow images from `placehold.co`, `res.cloudinary.com`, `images.unsplash.com`, `cdn.pixabay.com`, `images.pexels.com`, `cdn.shopify.com`, `www.gravatar.com`, and `avatars.githubusercontent.com`.

## Gemini Rules

*   Do not run `npm run build` or `npm run dev`.
*   When using the Grid component, use the size prop with an object for breakpoints, e.g., size={{ xs: 12, md: 6 }}, instead of individual props like xs={12} md={6}.