import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import AppShell from '@/components/layout/AppShell';
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'OmniMeet AI',
  description: 'AI-Powered Meeting Assistant Platform',
  icons: {
    icon: '/logo-icon.svg', // Assuming you will add a logo icon
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "hsl(217 91% 60%)", // Match with --primary HSL
          colorBackground: "hsl(224 71% 4%)", // Match with --background HSL
          colorText: "hsl(210 40% 98%)",
          colorInputBackground: "hsl(223 40% 12%)",
          colorInputText: "hsl(210 40% 98%)",
          borderRadius: 'var(--radius)',
        },
        layout: {
          socialButtonsPlacement: 'bottom',
          logoImageUrl: '/logo-full.svg', // Assuming a full logo for Clerk forms
        },
        elements: {
          card: 'glassmorphic !border-border/50',
          formButtonPrimary: 'bg-primary hover:bg-primary/90 text-primary-foreground',
          footerActionLink: 'text-primary hover:text-primary/80',
        }
      }}
    >
      <html lang="en" className={`${inter.variable} dark`}>
        <body className="font-body antialiased">
          <AppShell>
            {children}
          </AppShell>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
