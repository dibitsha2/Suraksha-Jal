import { config } from 'dotenv';
config();

import '@/ai/flows/health-worker-id-verification.ts';
import '@/ai/flows/symptom-based-disease-checker.ts';
import '@/ai/flows/ai-powered-disease-information.ts';
import '@/ai/flows/medication-suggester.ts';
import '@/ai/flows/medicine-checker.ts';
import '@/ai/flows/water-quality-checker.ts';
import '@/ai/flows/health-chatbot.ts';
import '@/ai/flows/emergency-contact-suggester.ts';
import '@/ai/flows/translate-text.ts';
