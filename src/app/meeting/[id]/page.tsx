"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Play, Pause, StopCircle, Download, UploadCloud, Mic, ScreenShare, FileText, MessageSquare, ListChecks, Brain } from 'lucide-react';
import ChatInterface from '@/components/ChatInterface';
import { summarizeMeeting, type SummarizeMeetingInput, type SummarizeMeetingOutput } from '@/ai/flows/summarize-meeting';
import { extractActionItems, type ExtractActionItemsInput, type ExtractActionItemsOutput } from '@/ai/flows/extract-action-items';
import { liveTranscription, type LiveTranscriptionInput, type LiveTranscriptionOutput } from '@/ai/flows/live-transcription';
import { mockMeetings } from '@/lib/mockData';
import type { Meeting, ActionItem } from '@/lib/types';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';

// Helper to create a dummy data URI for audio
const createDummyAudioDataUri = () => {
  // This is a tiny, silent WAV file as a base64 string
  const base64Audio = "UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAAABkYXRhAAAAAA==";
  return `data:audio/wav;base64,${base64Audio}`;
}

function MeetingPageContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const meetingId = params.id as string;
  
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const [transcription, setTranscription] = useState<string>('');
  const [isTranscribing, setIsTranscribing] = useState(false);

  const [summary, setSummary] = useState<string>('');
  const [isSummarizing, setIsSummarizing] = useState(false);

  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [isExtractingActionItems, setIsExtractingActionItems] = useState(false);

  useEffect(() => {
    // Fetch meeting data (using mock for now)
    const foundMeeting = mockMeetings.find(m => m.id === meetingId);
    if (foundMeeting) {
      // If title is in query params (from new-meeting page), use it
      const queryTitle = searchParams.get('title');
      setMeeting({ ...foundMeeting, title: queryTitle || foundMeeting.title });
      setTranscription(foundMeeting.transcript || "No transcript available yet. Start recording or upload a transcript.");
      setSummary(foundMeeting.fullSummary || '');
      setActionItems(foundMeeting.actionItems || []);
    } else {
      // If not found in mock, create a new placeholder meeting object if title is available
      const queryTitle = searchParams.get('title');
      if (queryTitle) {
        setMeeting({
          id: meetingId,
          title: queryTitle,
          date: new Date().toISOString(),
          status: 'live', // Assume it's a new live meeting
          transcript: "No transcript available yet. Start recording or upload a transcript.",
        });
      } else {
        setError("Meeting not found.");
      }
    }
    setIsLoading(false);
  }, [meetingId, searchParams]);

  // Recording timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prevTime => prevTime + 1);
        // Simulate live transcription every 5 seconds
        if ((recordingTime + 1) % 5 === 0) {
          handleLiveTranscription();
        }
      }, 1000);
    } else {
      clearInterval(interval!);
    }
    return () => clearInterval(interval!);
  }, [isRecording, recordingTime]);


  const handleToggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) setRecordingTime(0); // Reset time if starting
    toast({ title: !isRecording ? "Recording Started" : "Recording Paused" });
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    // setRecordingTime(0); // Or keep time for review
    toast({ title: "Recording Stopped", description: `Duration: ${formatTime(recordingTime)}` });
  };

  const handleLiveTranscription = async () => {
    if(isTranscribing) return;
    setIsTranscribing(true);
    try {
      const input: LiveTranscriptionInput = { audioChunkDataUri: createDummyAudioDataUri() };
      // Simulate a new piece of transcript
      const simulatedResponse: LiveTranscriptionOutput = { transcription: `Segment ${Math.floor(Math.random() * 1000)}: This is a new transcribed segment. ` };
      // const response = await liveTranscription(input); // Actual API call
      
      setTranscription(prev => prev === "No transcript available yet. Start recording or upload a transcript." ? simulatedResponse.transcription : prev + simulatedResponse.transcription);
      toast({ title: "Transcription Updated", description: "New segment added."});
    } catch (e) {
      console.error("Live transcription error:", e);
      toast({ title: "Transcription Error", description: "Could not update transcription.", variant: "destructive"});
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleGenerateSummary = async () => {
    if (!transcription || transcription === "No transcript available yet. Start recording or upload a transcript.") {
      toast({ title: "Cannot Summarize", description: "No transcript available to summarize.", variant: "destructive" });
      return;
    }
    setIsSummarizing(true);
    try {
      const input: SummarizeMeetingInput = { transcript: transcription };
      const response: SummarizeMeetingOutput = await summarizeMeeting(input);
      setSummary(response.summary);
      toast({ title: "Summary Generated", description: "Meeting summary is ready."});
    } catch (e) {
      console.error("Summarization error:", e);
      setSummary("Failed to generate summary.");
      toast({ title: "Summarization Failed", description: "An error occurred.", variant: "destructive"});
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleExtractActionItems = async () => {
    if (!transcription || transcription === "No transcript available yet. Start recording or upload a transcript.") {
      toast({ title: "Cannot Extract", description: "No transcript available to extract action items from.", variant: "destructive"});
      return;
    }
    setIsExtractingActionItems(true);
    try {
      const input: ExtractActionItemsInput = { transcript: transcription };
      const response: ExtractActionItemsOutput = await extractActionItems(input);
      setActionItems(response);
      toast({ title: "Action Items Extracted", description: `${response.length} items found.`});
    } catch (e) {
      console.error("Action item extraction error:", e);
      setActionItems([]);
      toast({ title: "Action Item Extraction Failed", description: "An error occurred.", variant: "destructive"});
    } finally {
      setIsExtractingActionItems(false);
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }

  if (error) {
    return <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>;
  }

  if (!meeting) {
    return <Alert><AlertTitle>Information</AlertTitle><AlertDescription>No meeting data found.</AlertDescription></Alert>;
  }

  return (
    <div className="space-y-6">
      <Card className="glassmorphic shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-3xl text-primary">{meeting.title}</CardTitle>
          <CardDescription>Meeting ID: {meeting.id} | Date: {new Date(meeting.date).toLocaleString()}</CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="recording" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="recording"><ScreenShare className="mr-2 h-4 w-4" />Recording</TabsTrigger>
          <TabsTrigger value="transcription"><FileText className="mr-2 h-4 w-4" />Transcript</TabsTrigger>
          <TabsTrigger value="summary"><Brain className="mr-2 h-4 w-4" />Summary</TabsTrigger>
          <TabsTrigger value="action-items"><ListChecks className="mr-2 h-4 w-4" />Action Items</TabsTrigger>
          <TabsTrigger value="chatbot"><MessageSquare className="mr-2 h-4 w-4" />Chatbot</TabsTrigger>
        </TabsList>

        <TabsContent value="recording" className="mt-6">
          <Card className="glassmorphic">
            <CardHeader>
              <CardTitle>Meeting Recording</CardTitle>
              <CardDescription>Control your screen and audio recording here.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-48 flex flex-col items-center justify-center bg-muted/30 rounded-lg border border-dashed text-muted-foreground">
                {isRecording ? (
                  <>
                    <ScreenShare size={48} className="text-primary animate-pulse mb-2" />
                    <p>Screen and Audio Recording in Progress...</p>
                    <p className="text-2xl font-mono mt-2">{formatTime(recordingTime)}</p>
                  </>
                ) : (
                  <>
                    <ScreenShare size={48} className="mb-2" />
                    <p>Recording Paused or Not Started</p>
                    {recordingTime > 0 && <p className="text-lg font-mono mt-1">Last duration: {formatTime(recordingTime)}</p>}
                  </>
                )}
              </div>
              <div className="flex items-center justify-center space-x-4">
                <Button onClick={handleToggleRecording} variant={isRecording ? "outline" : "default"} size="lg">
                  {isRecording ? <Pause className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
                  {isRecording ? 'Pause' : 'Start Recording'}
                </Button>
                <Button onClick={handleStopRecording} variant="destructive" size="lg" disabled={!isRecording && recordingTime === 0}>
                  <StopCircle className="mr-2 h-5 w-5" />Stop Recording
                </Button>
              </div>
              {isRecording && <Progress value={(recordingTime % 5) * 20} className="w-full h-2 mt-2" />}
               <Alert>
                <Mic className="h-4 w-4" />
                <AlertTitle>Independent Recording</AlertTitle>
                <AlertDescription>
                  This interface simulates recording controls. In a full application, this would integrate with WebRTC and native APIs for screen and audio capture.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transcription" className="mt-6">
          <Card className="glassmorphic">
            <CardHeader>
              <CardTitle>Live Transcription</CardTitle>
              <CardDescription>View the real-time transcription of your meeting.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={transcription}
                readOnly
                placeholder="Transcription will appear here..."
                className="h-64 text-sm bg-muted/30"
                aria-label="Meeting transcript"
              />
              <div className="flex space-x-2">
                <Button onClick={handleLiveTranscription} disabled={!isRecording || isTranscribing}>
                  {isTranscribing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mic className="mr-2 h-4 w-4" />}
                  Update Transcript
                </Button>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" /> Download Transcript
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary" className="mt-6">
          <Card className="glassmorphic">
            <CardHeader>
              <CardTitle>AI Meeting Summary</CardTitle>
              <CardDescription>Get an intelligent summary of the key points and decisions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={handleGenerateSummary} disabled={isSummarizing || !transcription || transcription === "No transcript available yet. Start recording or upload a transcript."}>
                {isSummarizing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Brain className="mr-2 h-4 w-4" />}
                Generate Summary
              </Button>
              {summary ? (
                <div className="p-4 border rounded-md bg-muted/30 prose dark:prose-invert max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: summary.replace(/\n/g, '<br />') }} />
                </div>
              ) : (
                <p className="text-muted-foreground">Generate a summary to see it here.</p>
              )}
              <Separator />
              <p className="text-sm font-semibold">Productivity Integrations:</p>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" disabled={!summary}><UploadCloud className="mr-2 h-4 w-4" />Export to Notion</Button>
                <Button variant="outline" size="sm" disabled={!summary}><UploadCloud className="mr-2 h-4 w-4" />Send to Slack</Button>
                <Button variant="outline" size="sm" disabled={!summary}><UploadCloud className="mr-2 h-4 w-4" />Create Trello Task</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="action-items" className="mt-6">
          <Card className="glassmorphic">
            <CardHeader>
              <CardTitle>Action Items</CardTitle>
              <CardDescription>Automatically extracted action items and assignees.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={handleExtractActionItems} disabled={isExtractingActionItems || !transcription || transcription === "No transcript available yet. Start recording or upload a transcript."}>
                {isExtractingActionItems ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ListChecks className="mr-2 h-4 w-4" />}
                Extract Action Items
              </Button>
              {actionItems.length > 0 ? (
                <ul className="space-y-2">
                  {actionItems.map((item, index) => (
                    <li key={index} className="p-3 border rounded-md bg-muted/30 flex justify-between items-center">
                      <span>{item.actionItem}</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary-foreground">{item.assignee}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">Extract action items to see them here.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chatbot" className="mt-6 h-[calc(100vh-12rem)] md:h-[calc(100vh-16rem)]"> {/* Adjust height as needed */}
           <Card className="glassmorphic h-full flex flex-col">
            <CardHeader>
              <CardTitle>Meeting Chatbot Assistant</CardTitle>
              <CardDescription>Ask questions about the meeting content.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow p-0 overflow-hidden">
              <ChatInterface meetingContent={transcription || "No meeting content available."} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}


export default function MeetingPageContainer() {
  // Suspense boundary for useSearchParams
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-full"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>}>
      <MeetingPageContent />
    </Suspense>
  );
}
