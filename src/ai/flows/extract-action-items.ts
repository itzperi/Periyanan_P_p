// src/ai/flows/extract-action-items.ts
'use server';

/**
 * @fileOverview Extracts action items and their assignees from meeting transcripts.
 *
 * - extractActionItems - A function that handles the action item extraction process.
 * - ExtractActionItemsInput - The input type for the extractActionItems function.
 * - ExtractActionItemsOutput - The return type for the extractActionItems function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractActionItemsInputSchema = z.object({
  transcript: z
    .string()
    .describe('The transcript of the meeting to extract action items from.'),
});
export type ExtractActionItemsInput = z.infer<typeof ExtractActionItemsInputSchema>;

const ExtractActionItemsOutputSchema = z.array(z.object({
  actionItem: z.string().describe('The action item.'),
  assignee: z.string().describe('The person responsible for the action item.'),
}));
export type ExtractActionItemsOutput = z.infer<typeof ExtractActionItemsOutputSchema>;

export async function extractActionItems(input: ExtractActionItemsInput): Promise<ExtractActionItemsOutput> {
  return extractActionItemsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractActionItemsPrompt',
  input: {schema: ExtractActionItemsInputSchema},
  output: {schema: ExtractActionItemsOutputSchema},
  prompt: `You are an AI assistant tasked with extracting action items and their assignees from meeting transcripts.

  Given the following meeting transcript, identify the action items and the person responsible for each item.
  Return the output in JSON format.

  Transcript:
  {{transcript}}`,
});

const extractActionItemsFlow = ai.defineFlow(
  {
    name: 'extractActionItemsFlow',
    inputSchema: ExtractActionItemsInputSchema,
    outputSchema: ExtractActionItemsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
