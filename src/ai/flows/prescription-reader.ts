
'use server';

/**
 * @fileOverview Analyzes a handwritten or printed prescription from an image.
 *
 * - readPrescription - A function to analyze the prescription image.
 * - PrescriptionReaderInput - The input type for the readPrescription function.
 * - PrescriptionReaderOutput - The return type for the readPrescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PrescriptionReaderInputSchema = z.object({
  prescriptionImage: z
    .string()
    .describe(
      "A photo of the doctor's prescription, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
    language: z.string().describe('The language for the response.').optional(),
});
export type PrescriptionReaderInput = z.infer<typeof PrescriptionReaderInputSchema>;

const MedicineDetailsSchema = z.object({
    name: z.string().describe('The name of the medicine.'),
    dosage: z.string().describe('The dosage (e.g., "500mg", "1 tablet").'),
    frequency: z.string().describe('How often to take the medicine, described in simple words (e.g., "Twice a day", "Once at night", "One in the morning and one at night").'),
    instructions: z.string().optional().describe('Any additional instructions, like "before food" or "for 5 days".'),
});

const PrescriptionReaderOutputSchema = z.object({
    medicines: z.array(MedicineDetailsSchema).describe('A structured list of all medicines found in the prescription.'),
    disclaimer: z.string().describe('A strong disclaimer that this is an AI-generated transcription and is not a substitute for the original prescription. The user should always verify with the original document and consult a pharmacist or doctor.'),
});
export type PrescriptionReaderOutput = z.infer<typeof PrescriptionReaderOutputSchema>;

export async function readPrescription(input: PrescriptionReaderInput): Promise<PrescriptionReaderOutput> {
  return prescriptionReaderFlow(input);
}

const prescriptionReaderPrompt = ai.definePrompt({
  name: 'prescriptionReaderPrompt',
  input: {schema: PrescriptionReaderInputSchema},
  output: {schema: PrescriptionReaderOutputSchema},
  prompt: `You are a medical assistant with expertise in reading and transcribing doctor's prescriptions. Analyze the provided image of a prescription.

Your task is to extract all the medicines, their dosages, frequency, and any specific instructions. Present this information in a clear, structured list.

For the 'frequency' field, you MUST use simple, easy-to-understand language. Do not use medical shorthand like "1-0-1" or "TDS". Instead, write it out clearly, for example: "Once in the morning and once at night" or "Three times a day".

Critically, you MUST include a strong disclaimer stating that this is an AI-generated transcription and not a substitute for the original prescription. The user must verify the information with the original document and consult a doctor or pharmacist if they have any questions.

Image of prescription: {{media url=prescriptionImage}}

{{#if language}}
Respond in the user's preferred language: {{{language}}}.
{{/if}}
`,
});

const prescriptionReaderFlow = ai.defineFlow(
  {
    name: 'prescriptionReaderFlow',
    inputSchema: PrescriptionReaderInputSchema,
    outputSchema: PrescriptionReaderOutputSchema,
  },
  async input => {
    const {output} = await prescriptionReaderPrompt(input);
    return output!;
  }
);
