"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Video, Mic, ScreenShare, PlayCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function NewMeetingPage() {
  const [meetingTitle, setMeetingTitle] = useState('');
  const router = useRouter();

  const handleStartMeeting = () => {
    if (!meetingTitle.trim()) {
      toast({
        title: "Meeting Title Required",
        description: "Please enter a title for your meeting.",
        variant: "destructive",
      });
      return;
    }
    // In a real app, this would involve API calls, setting up WebRTC, etc.
    // For now, we'll simulate creating a new meeting and redirecting.
    const newMeetingId = `meeting-${Date.now()}`; 
    console.log(`Starting new meeting: ${meetingTitle} with ID: ${newMeetingId}`);
    
    toast({
      title: "Meeting Starting",
      description: `Your meeting "${meetingTitle}" is being prepared.`,
    });

    // Simulate a delay for setup then redirect
    setTimeout(() => {
      router.push(`/meeting/${newMeetingId}?title=${encodeURIComponent(meetingTitle)}`);
    }, 1500);
  };

  return (
    <div className="flex min-h-full flex-col items-center justify-center">
      <Card className="w-full max-w-lg glassmorphic shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <PlayCircle size={32} />
          </div>
          <CardTitle className="font-headline text-3xl">Start a New Meeting</CardTitle>
          <CardDescription>
            Capture your screen and audio, get live transcriptions, summaries, and more.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="meetingTitle" className="text-base">Meeting Title</Label>
            <Input
              id="meetingTitle"
              type="text"
              value={meetingTitle}
              onChange={(e) => setMeetingTitle(e.target.value)}
              placeholder="e.g., Weekly Team Sync, Project Alpha Kickoff"
              className="mt-1 text-base p-3"
            />
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold">Recording Permissions:</h3>
            <p className="text-sm text-muted-foreground">
              OmniMeet will request permission to access your microphone and screen once you start the meeting.
            </p>
            <div className="flex items-center space-x-4 rounded-md border p-3 bg-background/50">
              <Mic className="h-5 w-5 text-primary" />
              <span className="text-sm">Microphone Access</span>
            </div>
            <div className="flex items-center space-x-4 rounded-md border p-3 bg-background/50">
              <ScreenShare className="h-5 w-5 text-primary" />
              <span className="text-sm">Screen Sharing Access</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleStartMeeting} size="lg" className="w-full text-lg py-6">
            <Video className="mr-2 h-5 w-5" /> Start Recording
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
