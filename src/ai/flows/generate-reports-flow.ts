'use server';

/**
 * @fileOverview Provides a flow to generate realistic, mock public health reports.
 *
 * - generateReports - A function to generate a specified number of health reports.
 * - GenerateReportsInput - The input type for the generateReports function.
 * - GenerateReportsOutput - The return type for the generateReports function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { subDays, format } from 'date-fns';


const GenerateReportsInputSchema = z.object({
  count: z.number().int().positive().describe('The number of mock reports to generate.'),
});
export type GenerateReportsInput = z.infer<typeof GenerateReportsInputSchema>;

const ReportSchema = z.object({
    id: z.number().describe('A unique ID for the report.'),
    disease: z.string().describe('The name of the waterborne disease.'),
    location: z.string().describe('The location of the outbreak (e.g., City, State).'),
    cases: z.number().int().positive().describe('The number of reported cases.'),
    date: z.string().describe('The date of the report in YYYY-MM-DD format.'),
    source: z.enum(['AI', 'Health Worker', 'Community']).describe('The source of the report.'),
});
export type Report = z.infer<typeof ReportSchema>;


const GenerateReportsOutputSchema = z.object({
    reports: z.array(ReportSchema).describe('An array of generated health reports.'),
});
export type GenerateReportsOutput = z.infer<typeof GenerateReportsOutputSchema>;


export async function generateReports(input: GenerateReportsInput): Promise<GenerateReportsOutput> {
  return generateReportsFlow(input);
}


const generateReportsPrompt = ai.definePrompt({
  name: 'generateReportsPrompt',
  input: {schema: GenerateReportsInputSchema},
  output: {schema: GenerateReportsOutputSchema},
  prompt: `You are a public health data simulator. Your task is to generate a realistic list of recent waterborne disease outbreak reports in India.

Generate {{count}} reports.

- Each report must have a unique ID.
- Focus on common waterborne diseases like Cholera, Typhoid, Hepatitis A, Giardiasis, and Dysentery.
- Use a variety of cities and states within India for the locations.
- The number of cases should be realistic, ranging from a handful to a few dozen.
- The dates should be within the last week.
- The source for all generated reports should be 'AI'.
`,
});


const generateReportsFlow = ai.defineFlow(
  {
    name: 'generateReportsFlow',
    inputSchema: GenerateReportsInputSchema,
    outputSchema: GenerateReportsOutputSchema,
  },
  async input => {
    const {output} = await generateReportsPrompt(input);
    
    // Post-process to ensure dates are correct and recent
    const today = new Date();
    if (output && output.reports) {
        output.reports.forEach((report, index) => {
            report.date = format(subDays(today, index % 7), 'yyyy-MM-dd');
            report.id = Date.now() + index; // Ensure unique ID
        });
    }

    return output!;
  }
);
