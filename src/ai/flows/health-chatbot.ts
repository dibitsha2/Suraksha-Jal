
'use server';

/**
 * @fileOverview Provides a general-purpose AI health chatbot.
 *
 * - healthChat - A function to interact with the health chatbot.
 * - HealthChatInput - The input type for the healthChat function.
 * - HealthChatOutput - The return type for the healthChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HealthChatInputSchema = z.object({
  message: z.string().describe('The user\'s message to the chatbot.'),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })).optional().describe('The conversation history.'),
  language: z.string().describe('The language for the response.').optional(),
});
export type HealthChatInput = z.infer<typeof HealthChatInputSchema>;

const HealthChatOutputSchema = z.object({
  response: z.string().describe('The chatbot\'s response to the user.'),
});
export type HealthChatOutput = z.infer<typeof HealthChatOutputSchema>;

export async function healthChat(input: HealthChatInput): Promise<HealthChatOutput> {
  return healthChatFlow(input);
}

const healthChatPrompt = ai.definePrompt({
  name: 'healthChatPrompt',
  input: {schema: HealthChatInputSchema},
  output: {schema: HealthChatOutputSchema},
  prompt: `You are "Suraksha Jal," a friendly and helpful AI health assistant specializing in waterborne diseases and general health inquiries. Your goal is to provide clear, accurate, and safe health information.

- If the user asks for medical advice, a diagnosis, or a prescription, you must gently refuse and strongly advise them to consult a qualified healthcare professional. Your suggestions are for informational purposes only.
- You can answer questions about symptoms, diseases (especially waterborne ones), medication uses, and general health and safety tips (like hygiene and water purification).
- Keep your responses concise and easy to understand.
- You have access to the conversation history to maintain context.
{{#if language}}
- The user's preferred language is {{language}}. You MUST respond in that language.
{{/if}}

Current User Message:
{{{message}}}
`,
});

const healthChatFlow = ai.defineFlow(
  {
    name: 'healthChatFlow',
    inputSchema: HealthChatInputSchema,
    outputSchema: HealthChatOutputSchema,
  },
  async input => {
    // Note: The history is available in the prompt context but not explicitly used here.
    // In a more complex setup, history would be passed to the model.
    const {output} = await healthChatPrompt(input);
    return output!;
  }
);
