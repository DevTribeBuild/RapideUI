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
import { useState, useEffect, forwardRef } from 'react';
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slide,
  IconButton,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import CloseIcon from '@mui/icons-material/Close';
import Confetti from 'react-confetti'; // Import Confetti
import useWindowSize from 'react-use/lib/useWindowSize'; // Import useWindowSize

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement<any, any> },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false); // State for confetti
  const [isClient, setIsClient] = useState(false); // New state for client-side rendering

  const { width, height } = useWindowSize(); // Get window size for confetti

  useEffect(() => {
    setIsClient(true); // Set isClient to true after component mounts on client
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
      setDialogOpen(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  useEffect(() => {
    if (dialogOpen && showInstallPrompt) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000); // confetti lasts 4s
    }
  }, [dialogOpen, showInstallPrompt]);

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
        setDialogOpen(false);
      });
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
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

              {isClient && showConfetti && (
                <Confetti
                  width={width}
                  height={height}
                  numberOfPieces={200}
                  recycle={false}
                  gravity={0.3}
                />
              )}

              <Dialog
                open={dialogOpen && showInstallPrompt}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleDialogClose}
                aria-describedby="alert-dialog-slide-description"
                PaperProps={{
                  style: {
                    position: 'fixed',
                    bottom: 20,
                    right: 20,
                    margin: 0,
                    maxWidth: 'calc(100% - 40px)',
                  },
                }}
              >
                <DialogTitle>
                  <Typography sx={{ color: '#ffd700', fontWeight: 'bold' }}>
                    Install RapideUI !
                  </Typography>
                </DialogTitle>
                <DialogContent>
                  <Typography id="alert-dialog-slide-description">
                    We recommend this for a seamless experience.
                  </Typography>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleDialogClose}>Dismiss</Button>
                  <Button onClick={handleInstallClick} variant="contained" color="primary">
                    Install
                  </Button>
                </DialogActions>
              </Dialog>
            </ThemeProvider>
          </ApolloProviderWrapper>
        </CacheProvider>
      </body>
    </html>
  );
}
