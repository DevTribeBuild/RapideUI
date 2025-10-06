"use client";
import { baselightTheme } from "@/utils/theme/DefaultColors";
import { basedarkTheme } from "@/utils/theme/DarkTheme";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import './global.css'
import ApolloProviderWrapper from "./providers/ApolloProviderWrapper";
import { Toaster } from 'react-hot-toast';
import useThemeStore from "@/stores/useThemeStore";

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
      </body>
    </html>
  );
}
