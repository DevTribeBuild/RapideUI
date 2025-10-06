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

const clientSideEmotionCache = createEmotionCache();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useThemeStore();
  const currentTheme = theme === 'light' ? baselightTheme : basedarkTheme;

  return (
    <html lang="en">
      <body>
        <CacheProvider value={clientSideEmotionCache}>
          <ApolloProviderWrapper>
            <ThemeProvider theme={currentTheme}>
              {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
              <CssBaseline />
              {children}
              <Toaster
                position="top-right"
                reverseOrder={false}
              />
            </ThemeProvider>
          </ApolloProviderWrapper>
        </CacheProvider>
      </body>
    </html>
  );
}
