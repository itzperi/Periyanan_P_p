import Link from 'next/link';
import { SidebarTrigger } from '@/components/ui/sidebar';
import LogoIcon from '@/components/icons/LogoIcon';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/80 px-4 shadow-sm backdrop-blur-md sm:px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="md:hidden" />
        <Link href="/" aria-label="Go to homepage">
          <LogoIcon />
        </Link>
      </div>
      <Button asChild>
        <Link href="/new-meeting">
          <PlusCircle className="mr-2 h-5 w-5" />
          New Meeting
        </Link>
      </Button>
    </header>
  );
}
