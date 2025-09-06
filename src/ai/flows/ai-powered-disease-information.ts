'use server';

/**
 * @fileOverview Provides AI-powered information about waterborne diseases.
 *
 * - getDiseaseInformation - A function to retrieve detailed information about a specific disease.
 * - DiseaseInformationInput - The input type for the getDiseaseInformation function.
 * - DiseaseInformationOutput - The return type for the getDiseaseInformation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DiseaseInformationInputSchema = z.object({
  diseaseName: z.string().describe('The name of the waterborne disease to get information about.'),
  symptoms: z.string().describe('A comma separated list of symptoms the user is experiencing.'),
});
export type DiseaseInformationInput = z.infer<typeof DiseaseInformationInputSchema>;

const DiseaseInformationOutputSchema = z.object({
  diseaseInfo: z.string().describe('Detailed information about the waterborne disease, including causes, prevention, and treatment.'),
});
export type DiseaseInformationOutput = z.infer<typeof DiseaseInformationOutputSchema>;

export async function getDiseaseInformation(input: DiseaseInformationInput): Promise<DiseaseInformationOutput> {
  return diseaseInformationFlow(input);
}

const diseaseInformationPrompt = ai.definePrompt({
  name: 'diseaseInformationPrompt',
  input: {schema: DiseaseInformationInputSchema},
  output: {schema: DiseaseInformationOutputSchema},
  prompt: `You are a medical expert specializing in waterborne diseases. A user is experiencing some symptoms and you have diagnosed a potential waterborne disease. Provide detailed information about the disease, including its causes, and how to prevent it. Also provide treatment information.

Disease Name: {{{diseaseName}}}
User Symptoms: {{{symptoms}}}
`,
});

const diseaseInformationFlow = ai.defineFlow(
  {
    name: 'diseaseInformationFlow',
    inputSchema: DiseaseInformationInputSchema,
    outputSchema: DiseaseInformationOutputSchema,
  },
  async input => {
    const {output} = await diseaseInformationPrompt(input);
    return output!;
  }
);
