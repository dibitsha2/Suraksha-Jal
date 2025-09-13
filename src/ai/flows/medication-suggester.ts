'use server';

/**
 * @fileOverview Provides AI-powered suggestions for medications and home remedies based on user symptoms.
 *
 * - getMedicationSuggestions - A function to retrieve suggestions.
 * - MedicationSuggesterInput - The input type for the getMedicationSuggestions function.
 * - MedicationSuggesterOutput - The return type for the getMedicationSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MedicationSuggesterInputSchema = z.object({
  symptoms: z.string().describe('A description of the symptoms the user is experiencing.'),
  age: z.number().optional().describe('The age of the user, if available.'),
  language: z.string().describe('The language for the response.').optional(),
});
export type MedicationSuggesterInput = z.infer<typeof MedicationSuggesterInputSchema>;

const MedicationSuggesterOutputSchema = z.object({
  suggestedMedicines: z.array(z.string()).describe('A list of common over-the-counter medicines that might help alleviate symptoms.'),
  homeRemedies: z.array(z.string()).describe('A list of home remedies that may help with the symptoms.'),
});
export type MedicationSuggesterOutput = z.infer<typeof MedicationSuggesterOutputSchema>;

export async function getMedicationSuggestions(input: MedicationSuggesterInput): Promise<MedicationSuggesterOutput> {
  return medicationSuggesterFlow(input);
}

const medicationSuggesterPrompt = ai.definePrompt({
  name: 'medicationSuggesterPrompt',
  input: {schema: MedicationSuggesterInputSchema},
  output: {schema: MedicationSuggesterOutputSchema},
  prompt: `You are a medical assistant. Based on the symptoms and age (if provided) by the user, suggest some common over-the-counter medicines and home remedies that might help. Tailor your suggestions to be appropriate for the user's age.

You must always include a strong and clear disclaimer that the user should consult a doctor before taking any new medication or trying any remedies, as this is not professional medical advice.

Symptoms: {{{symptoms}}}
{{#if age}}
Age: {{{age}}}
{{/if}}
{{#if language}}
The user's preferred language is {{language}}. Respond in that language.
{{/if}}
`,
});

const medicationSuggesterFlow = ai.defineFlow(
  {
    name: 'medicationSuggesterFlow',
    inputSchema: MedicationSuggesterInputSchema,
    outputSchema: MedicationSuggesterOutputSchema,
  },
  async input => {
    const {output} = await medicationSuggesterPrompt(input);
    return output!;
  }
);
