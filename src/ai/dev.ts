import { config } from 'dotenv';
config();

import '@/ai/flows/live-transcription.ts';
import '@/ai/flows/interactive-chatbot.ts';
import '@/ai/flows/summarize-meeting.ts';
import '@/ai/flows/extract-action-items.ts';