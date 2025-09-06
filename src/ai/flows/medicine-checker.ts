'use server';

/**
 * @fileOverview Provides AI-powered information about a specific medicine.
 *
 * - getMedicineInformation - A function to retrieve detailed information about a specific medicine.
 * - MedicineInformationInput - The input type for the getMedicineInformation function.
 * - MedicineInformationOutput - The return type for the getMedicineInformation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MedicineInformationInputSchema = z.object({
  medicineName: z.string().describe('The name of the medicine to get information about.'),
});
export type MedicineInformationInput = z.infer<typeof MedicineInformationInputSchema>;

const MedicineInformationOutputSchema = z.object({
  usageInfo: z.string().describe('Detailed and accurate information about what the medicine is used for, including its primary uses, and how it works. Include a disclaimer that this is not a substitute for professional medical advice and users should consult a doctor or pharmacist.'),
});
export type MedicineInformationOutput = z.infer<typeof MedicineInformationOutputSchema>;

export async function getMedicineInformation(input: MedicineInformationInput): Promise<MedicineInformationOutput> {
  return medicineInformationFlow(input);
}

const medicineInformationPrompt = ai.definePrompt({
  name: 'medicineInformationPrompt',
  input: {schema: MedicineInformationInputSchema},
  output: {schema: MedicineInformationOutputSchema},
  prompt: `You are a pharmacist and medical expert. A user wants to know about a specific medicine. Provide accurate and easy-to-understand information about what the medicine is used for. Be clear and concise.

Medicine Name: {{{medicineName}}}
`,
});

const medicineInformationFlow = ai.defineFlow(
  {
    name: 'medicineInformationFlow',
    inputSchema: MedicineInformationInputSchema,
    outputSchema: MedicineInformationOutputSchema,
  },
  async input => {
    const {output} = await medicineInformationPrompt(input);
    return output!;
  }
);
