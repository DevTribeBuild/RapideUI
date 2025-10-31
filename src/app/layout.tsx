"use client";
import { baselightTheme } from "@/utils/theme/DefaultColors";
import { basedarkTheme } from "@/utils/theme/DarkTheme";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "./global.css";
import ApolloProviderWrapper from "./providers/ApolloProviderWrapper";
import { Toaster } from "react-hot-toast";
import useThemeStore from "@/stores/useThemeStore";
import EmotionCacheProvider from "@/providers/EmotionCacheProvider";
import useAuthStore from "@/stores/useAuthStore";
import RiderLocationTracker from "@/components/RiderLocationTracker";
import dynamic from "next/dynamic";

// Dynamically import InstallPwaDialog with ssr: false
const InstallPwaDialog = dynamic(() => import("@/components/InstallPwaDialog"), {
  ssr: false,
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useThemeStore();
  const { user } = useAuthStore();
  const currentTheme = theme === "light" ? baselightTheme : basedarkTheme;

  return (
    <html lang="en">
      <head>
        {/* Manifest and theme */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />

        {/* Apple iOS PWA support */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="My Next.js PWA" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />

        {/* Optional splash screens (if you have them) */}
        {/* <link rel="apple-touch-startup-image" href="/splash/launch-640x1136.png" media="(device-width: 320px) and (device-height: 568px)" /> */}

        {/* Fallback favicon */}
        <link rel="icon" href="/favicon.ico" />
      </head>

      <body>
        <EmotionCacheProvider options={{ key: "mui" }}>
          <ApolloProviderWrapper>
            <ThemeProvider theme={currentTheme}>
              <CssBaseline />
              {user?.userType === "RIDER" && <RiderLocationTracker />}
              {children}
              <Toaster position="top-right" reverseOrder={false} />
              <InstallPwaDialog /> {/* PWA install prompt */}
            </ThemeProvider>
          </ApolloProviderWrapper>
        </EmotionCacheProvider>
      </body>
    </html>
  );
}
