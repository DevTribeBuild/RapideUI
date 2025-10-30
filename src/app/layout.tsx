"use client";
import { baselightTheme } from "@/utils/theme/DefaultColors";
import { basedarkTheme } from "@/utils/theme/DarkTheme";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import './global.css'
import ApolloProviderWrapper from "./providers/ApolloProviderWrapper";
import { Toaster } from 'react-hot-toast';
import useThemeStore from "@/stores/useThemeStore";
import createEmotionCache from "@/utils/createEmotionCache";
import { CacheProvider } from "@emotion/react";
import useAuthStore from '@/stores/useAuthStore';
import RiderLocationTracker from '@/components/RiderLocationTracker';
import { useState, useEffect } from 'react'; // Import useState and useEffect

const clientSideEmotionCache = createEmotionCache();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useThemeStore();
  const { user } = useAuthStore();
  const currentTheme = theme === 'light' ? baselightTheme : basedarkTheme;

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the PWA installation prompt');
        } else {
          console.log('User dismissed the PWA installation prompt');
        }
        setDeferredPrompt(null);
        setShowInstallPrompt(false);
      });
    }
  };

  return (
    <html lang="en">
      <link rel="manifest" href="/manifest.json" />
      <meta name="theme-color" content="#000000" />
      <link rel="apple-touch-icon" href="/vercel.svg" />
      <body>
        <CacheProvider value={clientSideEmotionCache}>
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
              {showInstallPrompt && (
                <div style={{
                  position: 'fixed',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  backgroundColor: '#333',
                  color: 'white',
                  padding: '10px',
                  textAlign: 'center',
                  zIndex: 1000,
                }}>
                  <p>Add RapideUI to your home screen for quick access!</p>
                  <button
                    onClick={handleInstallClick}
                    style={{
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      padding: '8px 15px',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      marginLeft: '10px',
                    }}
                  >
                    Install App
                  </button>
                </div>
              )}
            </ThemeProvider>
          </ApolloProviderWrapper>
        </CacheProvider>
      </body>
    </html>
  );
}
