'use server';
/**
 * @fileOverview Provides an AI-powered list of suitable substitute teachers.
 *
 * - suggestSuitableSubstitutes - A function that suggests suitable substitute teachers.
 * - SuggestSuitableSubstitutesInput - The input type for the suggestSuitableSubstitutes function.
 * - SuggestSuitableSubstitutesOutput - The return type for the suggestSuitableSubstitutes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestSuitableSubstitutesInputSchema = z.object({
  classSubject: z.string().describe('The subject of the class requiring a substitute.'),
  date: z.string().describe('The date for which the substitute is needed (YYYY-MM-DD).'),
  time: z.string().describe('The time slot for the class (e.g., 9:00 AM - 10:00 AM).'),
});
export type SuggestSuitableSubstitutesInput = z.infer<typeof SuggestSuitableSubstitutesInputSchema>;

const SuggestSuitableSubstitutesOutputSchema = z.object({
  suggestedSubstitutes: z
    .array(z.string())
    .describe(
      'A list of names of teachers who are suitable substitutes, ordered by relevance.'
    ),
});
export type SuggestSuitableSubstitutesOutput = z.infer<typeof SuggestSuitableSubstitutesOutputSchema>;

export async function suggestSuitableSubstitutes(
  input: SuggestSuitableSubstitutesInput
): Promise<SuggestSuitableSubstitutesOutput> {
  return suggestSuitableSubstitutesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestSuitableSubstitutesPrompt',
  input: {schema: SuggestSuitableSubstitutesInputSchema},
  output: {schema: SuggestSuitableSubstitutesOutputSchema},
  prompt: `You are an AI assistant helping teachers find suitable substitutes.

  Given the following class details, suggest a list of teachers who would be suitable substitutes, ordered by relevance (most suitable first).
  Consider their subject matter expertise and availability.  Only return names of possible substitutes.

  Class Subject: {{{classSubject}}}
  Date: {{{date}}}
  Time: {{{time}}}

  Suitable Substitutes:`,
});

const suggestSuitableSubstitutesFlow = ai.defineFlow(
  {
    name: 'suggestSuitableSubstitutesFlow',
    inputSchema: SuggestSuitableSubstitutesInputSchema,
    outputSchema: SuggestSuitableSubstitutesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
