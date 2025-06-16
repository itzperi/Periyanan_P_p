// src/ai/flows/interactive-chatbot.ts
'use server';

/**
 * @fileOverview An interactive chatbot flow for answering questions about meeting content.
 *
 * - interactiveChatbot - A function that handles the chatbot interaction process.
 * - InteractiveChatbotInput - The input type for the interactiveChatbot function.
 * - InteractiveChatbotOutput - The return type for the interactiveChatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InteractiveChatbotInputSchema = z.object({
  meetingContent: z.string().describe('The content of the meeting as a single string.'),
  userQuestion: z.string().describe('The user question about the meeting content.'),
});
export type InteractiveChatbotInput = z.infer<typeof InteractiveChatbotInputSchema>;

const InteractiveChatbotOutputSchema = z.object({
  answer: z.string().describe('The answer to the user question, based on the meeting content.'),
  sourceCitations: z.string().optional().describe('Sources within the meeting content that support the answer.'),
});
export type InteractiveChatbotOutput = z.infer<typeof InteractiveChatbotOutputSchema>;

export async function interactiveChatbot(input: InteractiveChatbotInput): Promise<InteractiveChatbotOutput> {
  return interactiveChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'interactiveChatbotPrompt',
  input: {schema: InteractiveChatbotInputSchema},
  output: {schema: InteractiveChatbotOutputSchema},
  prompt: `You are a chatbot designed to answer questions about meeting content.

  Meeting Content: {{{meetingContent}}}

  User Question: {{{userQuestion}}}

  Answer the user question based on the meeting content provided. Provide source citations where possible.
  If the answer is not found in the meeting content, respond that you are unable to answer the question with the given context.
  Format your response as a JSON object with the 'answer' and 'sourceCitations' keys. The 'sourceCitations' field is optional.
  `,
});

const interactiveChatbotFlow = ai.defineFlow(
  {
    name: 'interactiveChatbotFlow',
    inputSchema: InteractiveChatbotInputSchema,
    outputSchema: InteractiveChatbotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
