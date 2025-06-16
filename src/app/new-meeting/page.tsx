"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Video, Mic, ScreenShare, PlayCircle, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function NewMeetingPage() {
  const [meetingTitle, setMeetingTitle] = useState('');
  const [isStarting, setIsStarting] = useState(false);
  const router = useRouter();

  const handleStartMeeting = () => {
    if (!meetingTitle.trim()) {
      toast({
        title: "Meeting Title Required",
        description: "Please provide a title for your new meeting.",
        variant: "destructive",
      });
      return;
    }
    setIsStarting(true);
    
    toast({
      title: "Preparing Your Meeting...",
      description: `"${meetingTitle}" is getting ready.`,
    });

    // Simulate a brief setup, then navigate.
    // In a real app, this might involve API calls to create a meeting record.
    const newMeetingId = `live-${Date.now()}`; 
    
    // No artificial timeout, navigate after toast.
    // UI will show loading state on the button.
    router.push(`/meeting/${newMeetingId}?title=${encodeURIComponent(meetingTitle)}`);
    // setIsStarting(false) will effectively not run if navigation is immediate
  };

  return (
    <div className="flex min-h-full flex-col items-center justify-center py-12 px-4">
      <Card className="w-full max-w-lg glassmorphic shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary shadow-inner">
            <PlayCircle size={48} strokeWidth={1.5} />
          </div>
          <CardTitle className="font-headline text-4xl text-foreground">Start New Meeting</CardTitle>
          <CardDescription className="text-muted-foreground text-lg mt-2">
            Capture insights with live transcription, AI summaries, and more.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 pt-8">
          <div>
            <Label htmlFor="meetingTitle" className="text-lg font-medium text-foreground/90">Meeting Title</Label>
            <Input
              id="meetingTitle"
              type="text"
              value={meetingTitle}
              onChange={(e) => setMeetingTitle(e.target.value)}
              placeholder="e.g., Q3 Brainstorm, Project Nova Sync"
              className="mt-2 text-lg p-4 bg-input border-border focus:border-primary"
              disabled={isStarting}
            />
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground/90 text-md">Permissions Overview:</h3>
            <p className="text-sm text-muted-foreground">
              OmniMeet AI will request permission to access your microphone and screen when the meeting starts on the next page.
            </p>
            <div className="flex items-center space-x-4 rounded-lg border border-border/70 p-4 bg-card/70">
              <Mic className="h-6 w-6 text-primary" />
              <span className="text-base text-foreground/80">Microphone Access for Audio</span>
            </div>
            <div className="flex items-center space-x-4 rounded-lg border border-border/70 p-4 bg-card/70">
              <ScreenShare className="h-6 w-6 text-primary" />
              <span className="text-base text-foreground/80">Screen Sharing for Visuals</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-8">
          <Button 
            onClick={handleStartMeeting} 
            size="lg" 
            className="w-full text-xl py-7 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-primary/40 transition-all duration-300"
            disabled={isStarting}
          >
            {isStarting ? (
              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            ) : (
              <Video className="mr-3 h-6 w-6" />
            )}
            {isStarting ? 'Initializing...' : 'Start Recording Session'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
