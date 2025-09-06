import { config } from 'dotenv';
config();

import '@/ai/flows/health-worker-id-verification.ts';
import '@/ai/flows/symptom-based-disease-checker.ts';
import '@/ai/flows/ai-powered-disease-information.ts';