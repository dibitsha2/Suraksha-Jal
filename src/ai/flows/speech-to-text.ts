
'use server';

/**
 * @fileOverview Transcribes audio to text.
 *
 * - speechToText - A function to transcribe audio.
 * - SpeechToTextInput - The input type for the speechToToxtext function.
 * - SpeechToTextOutput - The return type for the speechToText function.
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import { z } from 'genkit';

const SpeechToTextInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "The audio to transcribe, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  language: z.string().describe('The language of the audio.').optional(),
});
export type SpeechToTextInput = z.infer<typeof SpeechToTextInputSchema>;

const SpeechToTextOutputSchema = z.object({
  transcription: z.string().describe('The transcribed text.'),
});
export type SpeechToTextOutput = z.infer<typeof SpeechToTextOutputSchema>;

export async function speechToText(input: SpeechToTextInput): Promise<SpeechToTextOutput> {
  return speechToTextFlow(input);
}

const speechToTextFlow = ai.defineFlow(
  {
    name: 'speechToTextFlow',
    inputSchema: SpeechToTextInputSchema,
    outputSchema: SpeechToTextOutputSchema,
  },
  async (input) => {
    const { text } = await ai.generate({
      model: googleAI.model('gemini-1.5-flash-latest'),
      prompt: [
        {
          media: {
            url: input.audioDataUri,
          },
        },
        {
          text: `Transcribe the audio. The user is speaking in ${input.language || 'the auto-detected language'}.`,
        }
      ],
    });
    
    return { transcription: text };
  }
);
