'use client';

import { ThemeProvider } from '@/components/theme-provider';
import AuthProvider from '@/components/auth/AuthProvider';
import { Toaster } from '@/components/ui/sonner';

export function Providers({ children }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        {children}
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}

export const AppProvider = Providers;