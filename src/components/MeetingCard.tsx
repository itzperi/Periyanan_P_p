import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Meeting } from '@/lib/types';
import { Calendar, CheckCircle, Clock, PlayCircle, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface MeetingCardProps {
  meeting: Meeting;
}

export default function MeetingCard({ meeting }: MeetingCardProps) {
  const getStatusInfo = (status: Meeting['status']) => {
    switch (status) {
      case 'completed':
        return { icon: <CheckCircle className="h-4 w-4 text-green-400" />, text: "Completed", variant: "secondary" as const, buttonText: "View Details" };
      case 'live':
        return { icon: <PlayCircle className="h-4 w-4 text-red-400 animate-pulse-glow" />, text: "Live", variant: "destructive" as const, buttonText: "Join Meeting" };
      case 'upcoming':
        return { icon: <Clock className="h-4 w-4 text-blue-400" />, text: "Upcoming", variant: "default" as const, buttonText: "View Schedule" };
      default:
        return { icon: null, text: "Unknown", variant: "outline" as const, buttonText: "Details" };
    }
  };

  const statusInfo = getStatusInfo(meeting.status);

  return (
    <Card className="glassmorphic flex flex-col overflow-hidden shadow-lg transition-all hover:shadow-primary/30 hover:scale-[1.02] duration-300 ease-in-out">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="font-headline text-xl tracking-tight leading-tight mb-1 text-foreground">{meeting.title}</CardTitle>
          <Badge variant={statusInfo.variant} className="capitalize whitespace-nowrap text-xs">
            {statusInfo.icon}
            <span className="ml-1.5">{statusInfo.text}</span>
          </Badge>
        </div>
        <div className="flex items-center text-xs text-muted-foreground pt-1">
          <Calendar className="mr-1.5 h-3.5 w-3.5" />
          {format(new Date(meeting.date), "MMMM d, yyyy 'at' h:mm a")}
        </div>
      </CardHeader>
      <CardContent className="flex-grow py-2">
        <CardDescription className="text-sm line-clamp-3 text-foreground/70">
          {meeting.summaryPreview || 'No summary available for this meeting yet.'}
        </CardDescription>
      </CardContent>
      <CardFooter className="py-4">
        <Button asChild variant="outline" size="sm" className="w-full group hover:bg-primary/10 hover:border-primary hover:text-primary transition-colors duration-200">
          <Link href={`/meeting/${meeting.id}`}>
            {statusInfo.buttonText}
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
