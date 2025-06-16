import MeetingCard from '@/components/MeetingCard';
import { mockMeetings } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="font-headline text-3xl font-bold tracking-tight text-primary">Meeting Dashboard</h1>
        <Button asChild size="lg">
          <Link href="/new-meeting">
            <PlusCircle className="mr-2 h-5 w-5" />
            Start New Meeting
          </Link>
        </Button>
      </div>
      
      {mockMeetings.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {mockMeetings.map((meeting) => (
            <MeetingCard key={meeting.id} meeting={meeting} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20 p-12 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 h-16 w-16 text-muted-foreground/50"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="21" y1="10" y2="10"></line></svg>
          <h2 className="font-headline text-xl font-semibold">No Meetings Yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Start a new meeting to see it appear here.
          </p>
          <Button asChild className="mt-6">
            <Link href="/new-meeting">
              <PlusCircle className="mr-2 h-4 w-4" /> Start Your First Meeting
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
