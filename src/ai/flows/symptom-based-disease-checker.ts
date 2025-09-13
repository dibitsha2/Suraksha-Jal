'use server';
/**
 * @fileOverview A symptom-based disease checker AI agent.
 *
 * - symptomBasedDiseaseChecker - A function that handles the disease checking process based on symptoms.
 * - SymptomBasedDiseaseCheckerInput - The input type for the symptomBasedDiseaseChecker function.
 * - SymptomBasedDiseaseCheckerOutput - The return type for the symptomBasedDiseaseChecker function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SymptomBasedDiseaseCheckerInputSchema = z.object({
  symptoms: z
    .string()
    .describe("A description of the symptoms the user is experiencing."),
  location: z
    .string()
    .optional()
    .describe("The user's current location, if available."),
  language: z.string().describe('The language for the response.').optional(),
});
export type SymptomBasedDiseaseCheckerInput = z.infer<typeof SymptomBasedDiseaseCheckerInputSchema>;

const SymptomBasedDiseaseCheckerOutputSchema = z.object({
  diseaseMatches: z.array(z.string()).describe("A list of potential waterborne diseases that match the provided symptoms."),
  preventiveMeasures: z.array(z.string()).describe("A list of preventive measures the user can take based on the potential diseases."),
  additionalInformation: z.array(z.string()).describe("A list of additional information points about the potential diseases and related health advice."),
  suggestedMedicines: z.array(z.string()).describe("A list of common over-the-counter medicines that might help alleviate symptoms. This is not a prescription."),
});
export type SymptomBasedDiseaseCheckerOutput = z.infer<typeof SymptomBasedDiseaseCheckerOutputSchema>;

export async function symptomBasedDiseaseChecker(input: SymptomBasedDiseaseCheckerInput): Promise<SymptomBasedDiseaseCheckerOutput> {
  return symptomBasedDiseaseCheckerFlow(input);
}

const symptomBasedDiseaseCheckerPrompt = ai.definePrompt({
  name: 'symptomBasedDiseaseCheckerPrompt',
  input: {schema: SymptomBasedDiseaseCheckerInputSchema},
  output: {schema: SymptomBasedDiseaseCheckerOutputSchema},
  prompt: `You are a medical assistant specializing in waterborne diseases. Based on the symptoms provided by the user, you will identify potential matching diseases. 
  
Also provide a list of preventive measures, a list of additional information points, and suggest some common over-the-counter medicines that may help with the symptoms, but strongly advise consulting a doctor.

Symptoms: {{{symptoms}}}
Location (if available): {{{location}}}

{{#if language}}
The user's preferred language is {{language}}. Respond in that language.
{{/if}}
`,
});

const symptomBasedDiseaseCheckerFlow = ai.defineFlow(
  {
    name: 'symptomBasedDiseaseCheckerFlow',
    inputSchema: SymptomBasedDiseaseCheckerInputSchema,
    outputSchema: SymptomBasedDiseaseCheckerOutputSchema,
  },
  async input => {
    const {output} = await symptomBasedDiseaseCheckerPrompt(input);
    return output!;
  }
);
