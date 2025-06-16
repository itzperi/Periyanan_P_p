'use server';

/**
 * @fileOverview Implements a Genkit flow to summarize meeting transcripts.
 *
 * - summarizeMeeting - A function that takes meeting transcript as input and returns a summary.
 * - SummarizeMeetingInput - The input type for the summarizeMeeting function.
 * - SummarizeMeetingOutput - The return type for the summarizeMeeting function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeMeetingInputSchema = z.object({
  transcript: z
    .string()
    .describe('The transcript of the meeting to be summarized.'),
});
export type SummarizeMeetingInput = z.infer<typeof SummarizeMeetingInputSchema>;

const SummarizeMeetingOutputSchema = z.object({
  summary: z.string().describe('The summarized content of the meeting.'),
});
export type SummarizeMeetingOutput = z.infer<typeof SummarizeMeetingOutputSchema>;

export async function summarizeMeeting(input: SummarizeMeetingInput): Promise<SummarizeMeetingOutput> {
  return summarizeMeetingFlow(input);
}

const summarizeMeetingPrompt = ai.definePrompt({
  name: 'summarizeMeetingPrompt',
  input: {schema: SummarizeMeetingInputSchema},
  output: {schema: SummarizeMeetingOutputSchema},
  prompt: `You are an AI assistant tasked with summarizing meetings.
  Given the following transcript, provide a concise yet comprehensive summary of the meeting, highlighting key decisions, action items, and important discussion points.

  Transcript:
  {{transcript}}`,
});

const summarizeMeetingFlow = ai.defineFlow(
  {
    name: 'summarizeMeetingFlow',
    inputSchema: SummarizeMeetingInputSchema,
    outputSchema: SummarizeMeetingOutputSchema,
  },
  async input => {
    const {output} = await summarizeMeetingPrompt(input);
    return output!;
  }
);
