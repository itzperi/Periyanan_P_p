import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Meeting } from '@/lib/types';
import { Calendar, CheckCircle, Clock, PlayCircle, ListChecks } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface MeetingCardProps {
  meeting: Meeting;
}

export default function MeetingCard({ meeting }: MeetingCardProps) {
  const getStatusIcon = (status: Meeting['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'live':
        return <PlayCircle className="h-4 w-4 text-red-500 animate-pulse" />;
      case 'upcoming':
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <Card className="glassmorphic flex flex-col overflow-hidden shadow-lg transition-all hover:shadow-primary/20">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="font-headline text-lg tracking-tight">{meeting.title}</CardTitle>
          <Badge variant={meeting.status === 'live' ? 'destructive' : meeting.status === 'completed' ? 'secondary' : 'default'} className="capitalize">
            {getStatusIcon(meeting.status)}
            <span className="ml-1">{meeting.status}</span>
          </Badge>
        </div>
        <div className="flex items-center text-xs text-muted-foreground pt-1">
          <Calendar className="mr-1 h-3 w-3" />
          {format(new Date(meeting.date), "MMMM d, yyyy 'at' h:mm a")}
        </div>
      </CardHeader>
      <CardContent className="flex-grow py-2">
        <CardDescription className="text-sm line-clamp-3">
          {meeting.summaryPreview || 'No summary available.'}
        </CardDescription>
      </CardContent>
      <CardFooter className="py-3">
        <Button asChild variant="outline" size="sm" className="w-full">
          <Link href={`/meeting/${meeting.id}`}>
            {meeting.status === 'completed' ? 'View Details' : meeting.status === 'live' ? 'Join Meeting' : 'Schedule Details'}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
