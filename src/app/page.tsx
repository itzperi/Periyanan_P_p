
import MeetingCard from '@/components/MeetingCard';
import { mockMeetings } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle, Zap, BarChart3, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function DashboardPage() {
  const stats = [
    { title: "Active Meetings", value: mockMeetings.filter(m => m.status === 'live').length, icon: Zap, color: "text-red-400" },
    { title: "Completed This Week", value: mockMeetings.filter(m => m.status === 'completed').length, icon: BarChart3, color: "text-green-400" },
    { title: "Upcoming Meetings", value: mockMeetings.filter(m => m.status === 'upcoming').length, icon: Users, color: "text-blue-400" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight text-primary">Welcome to OmniMeet AI</h1>
          <p className="text-muted-foreground">Your intelligent meeting assistant dashboard.</p>
        </div>
        <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-primary/40 transition-shadow">
          <Link href="/new-meeting">
            <PlusCircle className="mr-2 h-5 w-5" />
            Start New Meeting
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title} className="glassmorphic">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground/80">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-card-foreground">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div>
        <h2 className="font-headline text-2xl font-semibold tracking-tight mb-4">Your Meetings</h2>
        {mockMeetings.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {mockMeetings.map((meeting) => (
              <MeetingCard key={meeting.id} meeting={meeting} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-card/50 p-12 text-center glassmorphic">
            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-6 opacity-70"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></svg>
            <h2 className="font-headline text-2xl font-semibold text-foreground">No Meetings Yet</h2>
            <p className="mt-2 mb-6 text-muted-foreground">
              Ready to supercharge your productivity? <br/> Start your first AI-assisted meeting now!
            </p>
            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-primary/30 transition-shadow">
              <Link href="/new-meeting">
                <PlusCircle className="mr-2 h-4 w-4" /> Start Your First Meeting
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
