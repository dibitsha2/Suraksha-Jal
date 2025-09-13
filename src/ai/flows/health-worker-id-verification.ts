
'use server';

/**
 * @fileOverview Verifies a health worker's face using AI.
 *
 * - verifyHealthWorkerId - A function that verifies the face.
 * - VerifyHealthWorkerIdInput - The input type for the verifyHealthWorkerId function.
 * - VerifyHealthWorkerIdOutput - The return type for the verifyHealthWorkerId function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VerifyHealthWorkerIdInputSchema = z.object({
  idDataUri: z
    .string()
    .describe(
      "A photo of the user's face, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type VerifyHealthWorkerIdInput = z.infer<typeof VerifyHealthWorkerIdInputSchema>;

const VerifyHealthWorkerIdOutputSchema = z.object({
  isValid: z.boolean().describe('Whether the face is a valid, real human face.'),
  reason: z.string().describe('The reason for the face being invalid, if applicable. For example, if it is blurry, not a face, or a picture of a picture.'),
});
export type VerifyHealthWorkerIdOutput = z.infer<typeof VerifyHealthWorkerIdOutputSchema>;

export async function verifyHealthWorkerId(input: VerifyHealthWorkerIdInput): Promise<VerifyHealthWorkerIdOutput> {
  return verifyHealthWorkerIdFlow(input);
}

const prompt = ai.definePrompt({
  name: 'verifyHealthWorkerIdPrompt',
  input: {schema: VerifyHealthWorkerIdInputSchema},
  output: {schema: VerifyHealthWorkerIdOutputSchema},
  prompt: `You are an AI expert in verifying a person's identity from a captured photo of their face.

You will be provided with an image of a person's face. You must determine if it is a valid, clear, live photo of a real human.

- The image must contain a single, clear face.
- The face must not be obscured.
- The image must not be blurry.
- The image must appear to be a live capture, not a photo of another screen or a printed photograph.

If the face is not valid, explain why in the 'reason' field (e.g., "Image is too blurry," "No face detected," or "Image appears to be a photo of a screen."). If the face is valid, the 'reason' field should be left empty.

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

    