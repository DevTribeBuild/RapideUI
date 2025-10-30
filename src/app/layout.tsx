"use client";
import { baselightTheme } from "@/utils/theme/DefaultColors";
import { basedarkTheme } from "@/utils/theme/DarkTheme";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import './global.css'
import ApolloProviderWrapper from "./providers/ApolloProviderWrapper";
import { Toaster } from 'react-hot-toast';
import useThemeStore from "@/stores/useThemeStore";
import EmotionCacheProvider from "@/providers/EmotionCacheProvider";
import useAuthStore from '@/stores/useAuthStore';
import RiderLocationTracker from '@/components/RiderLocationTracker';
import dynamic from 'next/dynamic'; // Import dynamic

// Dynamically import InstallPwaDialog with ssr: false
const InstallPwaDialog = dynamic(() => import('@/components/InstallPwaDialog'), { ssr: false });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useThemeStore();
  const { user } = useAuthStore();
  const currentTheme = theme === 'light' ? baselightTheme : basedarkTheme;

  return (
    <html lang="en">
      <link rel="manifest" href="/manifest.json" />
      <meta name="theme-color" content="#000000" />
      <link rel="apple-touch-icon" href="/vercel.svg" />
      <body>
        <EmotionCacheProvider options={{ key: 'mui' }}>
          <ApolloProviderWrapper>
            <ThemeProvider theme={currentTheme}>
              {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
              <CssBaseline />
              {user?.userType === 'RIDER' && <RiderLocationTracker />}
              {children}
              <Toaster
                position="top-right"
                reverseOrder={false}
              />
              <InstallPwaDialog /> {/* Render the dynamically imported dialog */}
            </ThemeProvider>
          </ApolloProviderWrapper>
        </EmotionCacheProvider>
      </body>
    </html>
  );
}