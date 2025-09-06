'use server';

/**
 * @fileOverview Provides AI-powered suggestions for emergency contacts based on user location.
 *
 * - getEmergencyContacts - A function to retrieve suggestions.
 * - EmergencyContactInput - The input type for the getEmergencyContacts function.
 * - EmergencyContactOutput - The return type for the getEmergencyContacts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EmergencyContactInputSchema = z.object({
  location: z.string().describe("The user's current location (e.g., city, state)."),
});
export type EmergencyContactInput = z.infer<typeof EmergencyContactInputSchema>;

const ClinicSchema = z.object({
    name: z.string().describe('The name of the clinic or hospital.'),
    address: z.string().describe('The address of the clinic or hospital.'),
    phone: z.string().optional().describe('The contact phone number.'),
});

const EmergencyContactOutputSchema = z.object({
  nationalEmergencyNumber: z.string().describe("The primary national emergency number (e.g., 112 for India)."),
  suggestedHospitals: z.array(ClinicSchema).describe('A list of suggested nearby hospitals.'),
  suggestedClinics: z.array(ClinicSchema).describe('A list of suggested nearby clinics.'),
  disclaimer: z.string().describe('A disclaimer that the information may not be 100% accurate and should be verified.'),
});
export type EmergencyContactOutput = z.infer<typeof EmergencyContactOutputSchema>;

export async function getEmergencyContacts(input: EmergencyContactInput): Promise<EmergencyContactOutput> {
  return emergencyContactSuggesterFlow(input);
}

const emergencyContactSuggesterPrompt = ai.definePrompt({
  name: 'emergencyContactSuggesterPrompt',
  input: {schema: EmergencyContactInputSchema},
  output: {schema: EmergencyContactOutputSchema},
  prompt: `You are a helpful assistant providing emergency contact information for a user in a specific location.

Based on the user's location, provide the national emergency helpline number and suggest a few well-known local hospitals and clinics.

You MUST include a strong and clear disclaimer that this information is AI-generated, may not be completely accurate or up-to-date, and that the user should verify the contact details from an official source in case of an emergency. The user's life could depend on it.

User Location: {{{location}}}
`,
});

const emergencyContactSuggesterFlow = ai.defineFlow(
  {
    name: 'emergencyContactSuggesterFlow',
    inputSchema: EmergencyContactInputSchema,
    outputSchema: EmergencyContactOutputSchema,
  },
  async input => {
    const {output} = await emergencyContactSuggesterPrompt(input);
    return output!;
  }
);
