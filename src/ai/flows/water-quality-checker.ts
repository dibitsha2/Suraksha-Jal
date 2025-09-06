'use server';

/**
 * @fileOverview Analyzes water quality data from testing kits or sensors.
 *
 * - checkWaterQuality - A function to analyze water quality parameters.
 * - WaterQualityInput - The input type for the checkWaterQuality function.
 * - WaterQualityOutput - The return type for the checkWaterQuality function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WaterQualityInputSchema = z.object({
  turbidity: z.number().describe('The turbidity level of the water (in NTU).'),
  ph: z.number().min(0).max(14).describe('The pH level of the water.'),
  bacterialPresence: z.enum(['positive', 'negative']).describe('Whether bacterial presence is positive or negative.'),
});
export type WaterQualityInput = z.infer<typeof WaterQualityInputSchema>;

const WaterQualityOutputSchema = z.object({
    analysis: z.string().describe("A detailed analysis of the water quality based on the provided parameters."),
    isSafe: z.boolean().describe("A determination of whether the water is safe to drink or not."),
    recommendations: z.array(z.string()).describe("A list of recommendations for improving water quality if necessary."),
});
export type WaterQualityOutput = z.infer<typeof WaterQualityOutputSchema>;

export async function checkWaterQuality(input: WaterQualityInput): Promise<WaterQualityOutput> {
  return waterQualityCheckerFlow(input);
}

const waterQualityCheckerPrompt = ai.definePrompt({
  name: 'waterQualityCheckerPrompt',
  input: {schema: WaterQualityInputSchema},
  output: {schema: WaterQualityOutputSchema},
  prompt: `You are an expert in water quality analysis. A user has provided data from a water testing kit or IoT sensor. Analyze the data and provide a detailed report.

The ideal pH for drinking water is between 6.5 and 8.5.
The ideal turbidity for drinking water is below 1 NTU, but up to 5 NTU is acceptable.
Any positive bacterial presence is considered unsafe.

Based on the following data, determine if the water is safe to drink, provide a detailed analysis of the results, and offer recommendations for treatment if needed.

Turbidity: {{{turbidity}}} NTU
pH Level: {{{ph}}}
Bacterial Presence: {{{bacterialPresence}}}
`,
});

const waterQualityCheckerFlow = ai.defineFlow(
  {
    name: 'waterQualityCheckerFlow',
    inputSchema: WaterQualityInputSchema,
    outputSchema: WaterQualityOutputSchema,
  },
  async input => {
    const {output} = await waterQualityCheckerPrompt(input);
    return output!;
  }
);
