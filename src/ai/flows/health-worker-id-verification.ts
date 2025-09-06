'use server';

/**
 * @fileOverview Verifies the validity of a health worker's government-issued ID using AI.
 *
 * - verifyHealthWorkerId - A function that verifies the ID.
 * - VerifyHealthWorkerIdInput - The input type for the verifyHealthWorkerId function.
 * - VerifyHealthWorkerIdOutput - The return type for the verifyHealthWorkerId function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VerifyHealthWorkerIdInputSchema = z.object({
  idDataUri: z
    .string()
    .describe(
      "A government-issued health worker ID, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type VerifyHealthWorkerIdInput = z.infer<typeof VerifyHealthWorkerIdInputSchema>;

const VerifyHealthWorkerIdOutputSchema = z.object({
  isValid: z.boolean().describe('Whether the ID is valid or not.'),
  reason: z.string().describe('The reason for the ID being invalid, if applicable.'),
});
export type VerifyHealthWorkerIdOutput = z.infer<typeof VerifyHealthWorkerIdOutputSchema>;

export async function verifyHealthWorkerId(input: VerifyHealthWorkerIdInput): Promise<VerifyHealthWorkerIdOutput> {
  return verifyHealthWorkerIdFlow(input);
}

const prompt = ai.definePrompt({
  name: 'verifyHealthWorkerIdPrompt',
  input: {schema: VerifyHealthWorkerIdInputSchema},
  output: {schema: VerifyHealthWorkerIdOutputSchema},
  prompt: `You are an AI expert in verifying the validity of government-issued health worker IDs.

You will be provided with an image of the ID. You must determine if the ID is valid or not.
If the ID is not valid, explain why in the reason field. If the ID is valid, the reason field should be left empty.

Consider factors like image quality, clarity of information, signs of tampering, and consistency with known ID formats.

Image: {{media url=idDataUri}}
`,
});

const verifyHealthWorkerIdFlow = ai.defineFlow(
  {
    name: 'verifyHealthWorkerIdFlow',
    inputSchema: VerifyHealthWorkerIdInputSchema,
    outputSchema: VerifyHealthWorkerIdOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
