'use server';

/**
 * @fileOverview Generates mock local area reports for waterborne diseases based on a location.
 *
 * - getLocalReports - A function to retrieve mock disease case data for a specific location.
 * - GetLocalReportsInput - The input type for the getLocalReports function.
 * - GetLocalReportsOutput - The return type for the getLocalReports function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetLocalReportsInputSchema = z.object({
  location: z.string().describe("The user's location (e.g., city, region) to generate reports for."),
});
export type GetLocalReportsInput = z.infer<typeof GetLocalReportsInputSchema>;

const ReportSchema = z.object({
    disease: z.string().describe('The name of the waterborne disease.'),
    cases: z.number().describe('The number of reported cases for this disease.'),
    trend: z.enum(['up', 'down', 'stable']).describe('The trend of cases (up, down, or stable).'),
});

const GetLocalReportsOutputSchema = z.object({
  reports: z.array(ReportSchema).describe('A list of local area disease reports.'),
});
export type GetLocalReportsOutput = z.infer<typeof GetLocalReportsOutputSchema>;

export async function getLocalReports(input: GetLocalReportsInput): Promise<GetLocalReportsOutput> {
  return getLocalReportsFlow(input);
}

const getLocalReportsPrompt = ai.definePrompt({
  name: 'getLocalReportsPrompt',
  input: {schema: GetLocalReportsInputSchema},
  output: {schema: GetLocalReportsOutputSchema},
  prompt: `You are a public health data analyst. Based on the user's location, generate a list of 4 realistic but mock (invented) local area reports for common waterborne diseases like Cholera, Typhoid, Hepatitis A, and Giardiasis.

For each report, provide the disease name, a number of cases, and a trend ('up', 'down', or 'stable'). The data should be plausible for the given location.

Location: {{{location}}}
`,
});

const getLocalReportsFlow = ai.defineFlow(
  {
    name: 'getLocalReportsFlow',
    inputSchema: GetLocalReportsInputSchema,
    outputSchema: GetLocalReportsOutputSchema,
  },
  async input => {
    const {output} = await getLocalReportsPrompt(input);
    return output!;
  }
);
