
import MeetingCard from '@/components/MeetingCard';
import { mockMeetings } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle, Zap, BarChart3, Users, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const dynamic = 'force-dynamic'; // Force dynamic rendering

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
        <h2 className="font-headline text-2xl font-semibold tracking-tight mb-4 text-foreground">Your Meetings</h2>
        {mockMeetings.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {mockMeetings.map((meeting) => (
              <MeetingCard key={meeting.id} meeting={meeting} />
            ))}
          </div>
        ) : (
          <Card className="glassmorphic flex flex-col items-center justify-center p-12 text-center min-h-[300px]">
            <FileText size={64} className="mb-6 text-primary opacity-70" />
            <CardTitle className="font-headline text-2xl font-semibold text-foreground mb-2">No Meetings Yet</CardTitle>
            <p className="mt-2 mb-6 text-muted-foreground max-w-md">
              Ready to supercharge your productivity? <br/> Start your first AI-assisted meeting now!
            </p>
            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-primary/30 transition-shadow">
              <Link href="/new-meeting">
                <PlusCircle className="mr-2 h-4 w-4" /> Start Your First Meeting
              </Link>
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
