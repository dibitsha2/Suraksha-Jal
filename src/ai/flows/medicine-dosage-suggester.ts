'use server';

/**
 * @fileOverview Provides AI-powered information about medicine dosage and instructions.
 *
 * - getMedicineDosage - A function to retrieve dosage information for a specific medicine.
 * - MedicineDosageInput - The input type for the getMedicineDosage function.
 * - MedicineDosageOutput - The return type for the getMedicineDosage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MedicineDosageInputSchema = z.object({
  medicineName: z.string().describe('The name of the medicine to get dosage information about.'),
  age: z.number().describe("The user's age."),
  language: z.string().describe('The language for the response.').optional(),
});
export type MedicineDosageInput = z.infer<typeof MedicineDosageInputSchema>;

const MedicineDosageOutputSchema = z.object({
  dosage: z.string().describe('The recommended dosage amount for the given age (e.g., "500mg", "1 tablet").'),
  timing: z.string().describe('Instructions on when to take the medicine relative to meals (e.g., "After breakfast and dinner", "With food").'),
  disclaimer: z.string().describe('A strong disclaimer that this is not medical advice and the user must consult a qualified doctor or pharmacist for accurate dosage information.'),
});
export type MedicineDosageOutput = z.infer<typeof MedicineDosageOutputSchema>;

export async function getMedicineDosage(input: MedicineDosageInput): Promise<MedicineDosageOutput> {
  return medicineDosageFlow(input);
}

const medicineDosagePrompt = ai.definePrompt({
  name: 'medicineDosagePrompt',
  input: {schema: MedicineDosageInputSchema},
  output: {schema: MedicineDosageOutputSchema},
  prompt: `You are an expert pharmacist. Based on the medicine name and user's age, provide typical dosage instructions for over-the-counter use. Be accurate and clear.

You MUST provide a strong disclaimer that this information is for general guidance only and is not a substitute for professional medical advice. The user MUST consult a qualified doctor or pharmacist before taking any medication, as dosage can vary based on many factors.

Medicine Name: {{{medicineName}}}
User's Age: {{{age}}}

{{#if language}}
Respond in the user's preferred language: {{{language}}}.
{{/if}}
`,
});

const medicineDosageFlow = ai.defineFlow(
  {
    name: 'medicineDosageFlow',
    inputSchema: MedicineDosageInputSchema,
    outputSchema: MedicineDosageOutputSchema,
  },
  async input => {
    const {output} = await medicineDosagePrompt(input);
    return output!;
  }
);
