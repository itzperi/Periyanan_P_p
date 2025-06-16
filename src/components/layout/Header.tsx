import Link from 'next/link';
import { SidebarTrigger } from '@/components/ui/sidebar';
import LogoIcon from '@/components/icons/LogoIcon';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { SignedIn, SignedOut, UserButton, SignInButton, SignUpButton } from '@clerk/nextjs';

export default function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/80 px-4 shadow-sm backdrop-blur-md sm:px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="md:hidden" />
        <Link href="/" aria-label="Go to homepage">
          <LogoIcon />
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <SignedIn>
           <Button asChild className="hidden sm:flex">
            <Link href="/new-meeting">
              <PlusCircle className="mr-2 h-5 w-5" />
              New Meeting
            </Link>
          </Button>
        </SignedIn>
        <SignedOut>
          <div className="flex items-center gap-2">
            <SignInButton mode="redirect" redirectUrl="/">
              <Button variant="outline">Sign In</Button>
            </SignInButton>
            <SignUpButton mode="redirect" redirectUrl="/">
              <Button>Sign Up</Button>
            </SignUpButton>
          </div>
        </SignedOut>
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
    </header>
  );
}
