// src/ai/flows/live-transcription.ts
'use server';

/**
 * @fileOverview A flow for transcribing meeting audio in real-time.
 *
 * - liveTranscription - A function that handles the live transcription process.
 * - LiveTranscriptionInput - The input type for the liveTranscription function.
 * - LiveTranscriptionOutput - The return type for the liveTranscription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LiveTranscriptionInputSchema = z.object({
  audioChunkDataUri: z
    .string()
    .describe(
      "A chunk of meeting audio, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>' for live transcription."
    ),
});
export type LiveTranscriptionInput = z.infer<typeof LiveTranscriptionInputSchema>;

const LiveTranscriptionOutputSchema = z.object({
  transcription: z.string().describe('The transcribed text from the audio chunk.'),
});
export type LiveTranscriptionOutput = z.infer<typeof LiveTranscriptionOutputSchema>;

export async function liveTranscription(input: LiveTranscriptionInput): Promise<LiveTranscriptionOutput> {
  return liveTranscriptionFlow(input);
}

const liveTranscriptionPrompt = ai.definePrompt({
  name: 'liveTranscriptionPrompt',
  input: {schema: LiveTranscriptionInputSchema},
  output: {schema: LiveTranscriptionOutputSchema},
  prompt: `Transcribe the following audio chunk from the meeting:\n\n{{media url=audioChunkDataUri}}`,
});

const liveTranscriptionFlow = ai.defineFlow(
  {
    name: 'liveTranscriptionFlow',
    inputSchema: LiveTranscriptionInputSchema,
    outputSchema: LiveTranscriptionOutputSchema,
  },
  async input => {
    const {output} = await liveTranscriptionPrompt(input);
    return output!;
  }
);
