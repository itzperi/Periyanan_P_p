"use client";

import { useEffect, useState, Suspense, useRef } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Play, Pause, StopCircle, Download, UploadCloud, Mic, ScreenShare, FileText, MessageSquare, ListChecks, Brain, Radio } from 'lucide-react';
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
import { marked } from 'marked';

// Helper to create a dummy data URI for audio
const createDummyAudioDataUri = () => {
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

  const transcriptionIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const foundMeeting = mockMeetings.find(m => m.id === meetingId);
    if (foundMeeting) {
      const queryTitle = searchParams.get('title');
      setMeeting({ ...foundMeeting, title: queryTitle || foundMeeting.title });
      setTranscription(foundMeeting.transcript || "No transcript available yet. Start recording or upload a transcript.");
      setSummary(foundMeeting.fullSummary || '');
      setActionItems(foundMeeting.actionItems || []);
    } else {
      const queryTitle = searchParams.get('title');
      if (queryTitle) {
        setMeeting({
          id: meetingId,
          title: queryTitle,
          date: new Date().toISOString(),
          status: 'live',
          transcript: "No transcript available yet. Start recording or upload a transcript.",
        });
      } else {
        setError("Meeting not found.");
      }
    }
    setIsLoading(false);
  }, [meetingId, searchParams]);

  useEffect(() => {
    let timerInterval: NodeJS.Timeout;
    if (isRecording) {
      timerInterval = setInterval(() => {
        setRecordingTime(prevTime => prevTime + 1);
      }, 1000);
      
      // Start simulated live transcription
      if (!transcriptionIntervalRef.current) {
          transcriptionIntervalRef.current = setInterval(handleLiveTranscription, 5000); // Transcribe every 5 seconds
      }

    } else {
      clearInterval(timerInterval!);
      if (transcriptionIntervalRef.current) {
        clearInterval(transcriptionIntervalRef.current);
        transcriptionIntervalRef.current = null;
      }
    }
    return () => {
      clearInterval(timerInterval!);
      if (transcriptionIntervalRef.current) {
        clearInterval(transcriptionIntervalRef.current);
        transcriptionIntervalRef.current = null;
      }
    };
  }, [isRecording]);


  const handleToggleRecording = () => {
    setIsRecording(prev => !prev);
    if (!isRecording) { // If was paused and now starting
        setRecordingTime(0); // Reset time only if starting from a stopped state or initial start
        toast({ title: "Recording Started", description: "Live transcription will update periodically." });
    } else { // If was recording and now pausing
        toast({ title: "Recording Paused" });
    }
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    toast({ title: "Recording Stopped", description: `Total duration: ${formatTime(recordingTime)}. You can now generate summary and action items.` });
    // Optionally, trigger final transcription if needed
    if (transcriptionIntervalRef.current) {
        clearInterval(transcriptionIntervalRef.current);
        transcriptionIntervalRef.current = null;
    }
  };

  const handleLiveTranscription = async () => {
    if(isTranscribing || !isRecording) return; // Only transcribe if actively recording
    setIsTranscribing(true);
    try {
      const input: LiveTranscriptionInput = { audioChunkDataUri: createDummyAudioDataUri() };
      const simulatedResponse: LiveTranscriptionOutput = { transcription: `Segment ${Math.floor(Date.now() / 1000) % 1000}: This is a new transcribed segment from the live feed. Lorem ipsum dolor sit amet. ` };
      
      setTranscription(prev => prev === "No transcript available yet. Start recording or upload a transcript." ? simulatedResponse.transcription : prev + simulatedResponse.transcription);
      // Minimal toast for live updates to avoid being too noisy
      // toast({ title: "Transcript Updated", duration: 2000 });
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
    return <div className="flex justify-center items-center h-[calc(100vh-10rem)]"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
  }

  if (error) {
    return <Alert variant="destructive" className="glassmorphic"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>;
  }

  if (!meeting) {
    return <Alert className="glassmorphic"><AlertTitle>Information</AlertTitle><AlertDescription>No meeting data found. Please start a new meeting.</AlertDescription></Alert>;
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
              <CardTitle>Meeting Recording Controls</CardTitle>
              <CardDescription>Manage your screen and audio recording session.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="h-60 flex flex-col items-center justify-center bg-muted/40 rounded-xl border-2 border-dashed border-primary/30 text-muted-foreground p-6 relative overflow-hidden">
                {isRecording ? (
                  <>
                    <Radio size={64} className="text-primary animate-pulse-glow mb-4" />
                    <p className="text-lg font-semibold text-foreground">Recording Screen & Audio...</p>
                    <p className="text-3xl font-mono mt-2 text-primary">{formatTime(recordingTime)}</p>
                    <div className="absolute bottom-4 left-4 right-4">
                        <Progress value={(recordingTime % 5) * 20 } className="w-full h-2 bg-primary/20 [&>div]:bg-primary" />
                        {isTranscribing && <p className="text-xs text-primary/80 text-center mt-1">Transcribing segment...</p>}
                    </div>
                  </>
                ) : (
                  <>
                    <ScreenShare size={64} className="mb-4 text-foreground/50" />
                    <p className="text-lg font-semibold text-foreground">{recordingTime > 0 ? "Recording Paused" : "Ready to Record"}</p>
                    {recordingTime > 0 && <p className="text-2xl font-mono mt-2 text-muted-foreground">{formatTime(recordingTime)}</p>}
                    <p className="mt-2 text-sm text-muted-foreground">{recordingTime > 0 ? "Press Start to resume or Stop to finish." : "Press Start to begin."}</p>
                  </>
                )}
              </div>
              <div className="flex items-center justify-center space-x-4">
                <Button onClick={handleToggleRecording} variant={isRecording ? "outline" : "default"} size="lg" className="min-w-[180px]">
                  {isRecording ? <Pause className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
                  {isRecording ? 'Pause Recording' : 'Start Recording'}
                </Button>
                <Button onClick={handleStopRecording} variant="destructive" size="lg" disabled={!isRecording && recordingTime === 0} className="min-w-[180px]">
                  <StopCircle className="mr-2 h-5 w-5" />Stop Recording
                </Button>
              </div>
               <Alert variant="default" className="bg-muted/30 border-primary/20">
                <Mic className="h-5 w-5 text-primary" />
                <AlertTitle className="text-foreground/90">Simulation Notice</AlertTitle>
                <AlertDescription className="text-muted-foreground">
                  This interface simulates recording controls and live transcription updates. Full browser-based screen and audio capture would require WebRTC APIs.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transcription" className="mt-6">
          <Card className="glassmorphic">
            <CardHeader>
              <CardTitle>Live Transcription</CardTitle>
              <CardDescription>View the real-time transcription of your meeting. Updates automatically if recording.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={transcription}
                readOnly
                placeholder={isRecording ? "Live transcription will appear here as you record..." : "Start recording or upload a transcript to see content here."}
                className="h-80 text-sm bg-muted/40 border-primary/30 focus:border-primary"
                aria-label="Meeting transcript"
              />
              <div className="flex space-x-3">
                <Button onClick={handleLiveTranscription} disabled={!isRecording || isTranscribing} variant="outline">
                  {isTranscribing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mic className="mr-2 h-4 w-4" />}
                  Force Update
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
              <CardDescription>Get an intelligent summary of key points, decisions, and insights.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Button onClick={handleGenerateSummary} disabled={isSummarizing || !transcription || transcription === "No transcript available yet. Start recording or upload a transcript."} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                {isSummarizing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Brain className="mr-2 h-4 w-4" />}
                Generate Summary
              </Button>
              {isSummarizing && <p className="text-sm text-muted-foreground flex items-center"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Thinking... crafting your summary.</p>}
              {summary ? (
                <div className="p-4 border border-primary/30 rounded-md bg-muted/30 prose dark:prose-invert max-w-none prose-sm md:prose-base text-foreground/90">
                  <div dangerouslySetInnerHTML={{ __html: marked.parse(summary) as string }} />
                </div>
              ) : (
                 !isSummarizing && <p className="text-muted-foreground">Generate a summary to see it here. Ensure there is a transcript first.</p>
              )}
              <Separator className="my-6 bg-border/50"/>
              <p className="text-base font-semibold text-foreground/90">Productivity Integrations:</p>
              <div className="flex flex-wrap gap-3">
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
              <CardDescription>Automatically extracted action items and assignees from the transcript.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Button onClick={handleExtractActionItems} disabled={isExtractingActionItems || !transcription || transcription === "No transcript available yet. Start recording or upload a transcript."} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                {isExtractingActionItems ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ListChecks className="mr-2 h-4 w-4" />}
                Extract Action Items
              </Button>
              {isExtractingActionItems && <p className="text-sm text-muted-foreground flex items-center"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Scanning transcript for action items...</p>}
              {actionItems.length > 0 ? (
                <ul className="space-y-3">
                  {actionItems.map((item, index) => (
                    <li key={index} className="p-4 border border-primary/30 rounded-md bg-muted/30 flex justify-between items-center hover:shadow-md transition-shadow">
                      <span className="text-foreground/90">{item.actionItem}</span>
                      <Badge variant="secondary" className="text-xs px-2.5 py-1">{item.assignee}</Badge>
                    </li>
                  ))}
                </ul>
              ) : (
                !isExtractingActionItems && <p className="text-muted-foreground">Extract action items to see them here. Ensure there is a transcript first.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chatbot" className="mt-6 h-[calc(100vh-12rem)] md:h-[calc(100vh-15rem)]">
           <Card className="glassmorphic h-full flex flex-col shadow-xl">
            <CardHeader>
              <CardTitle>Meeting Chatbot Assistant</CardTitle>
              <CardDescription>Ask questions about the meeting content. Powered by AI.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow p-0 overflow-hidden">
              <ChatInterface meetingContent={transcription || "No meeting content available to chat about."} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function MeetingPageContainer() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-[calc(100vh-10rem)]"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>}>
      <MeetingPageContent />
    </Suspense>
  );
}
