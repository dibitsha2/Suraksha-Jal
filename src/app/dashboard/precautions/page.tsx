
'use client';
import Image from 'next/image';
import { Droplet, UtensilsCrossed, HandHeart, Bug, ShieldAlert, Archive, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useLanguage } from '@/hooks/use-language';

const precautions = [
  {
    icon: Droplet,
    title: 'Drink Safe Water',
    description: 'Always drink boiled, filtered, or purified water. Avoid tap water or ice from unknown sources.',
  },
  {
    icon: UtensilsCrossed,
    title: 'Safe Food Handling',
    description: 'Wash fruits and vegetables with clean water. Eat freshly cooked food and avoid raw or undercooked items.',
  },
  {
    icon: HandHeart,
    title: 'Practice Good Hygiene',
    description: 'Wash your hands frequently with soap and water, especially before eating and after using the toilet.',
  },
  {
    icon: Bug,
    title: 'Avoid Contaminated Water',
    description: 'Do not swim or bathe in ponds, rivers, or streams that might be contaminated.',
  },
   {
    icon: ShieldAlert,
    title: 'Get Vaccinated',
    description: 'Stay up-to-date with vaccinations for diseases like Typhoid and Hepatitis A, if available in your area.',
  },
  {
    icon: Archive,
    title: 'Cover Stored Water',
    description: 'Keep stored water in clean, covered containers to prevent contamination from insects and debris.',
  },
  {
    icon: ShieldCheck,
    title: 'Prevent Mosquito Breeding',
    description: 'Cover drains with grills and regularly spread bleaching powder to prevent mosquitoes from breeding.',
    image: 'https://picsum.photos/600/400',
    aiHint: 'covered drain',
  },
];

export default function PrecautionsPage() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">{t('precautions')}</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Protect Yourself from Waterborne Diseases</CardTitle>
          <CardDescription>Follow these simple yet effective precautions to stay safe and healthy.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {precautions.map((precaution: any, index: number) => (
              <Card key={index} className="flex flex-col overflow-hidden">
                {precaution.image && (
                    <div className="relative w-full h-48">
                        <Image 
                            src={precaution.image}
                            alt={precaution.title}
                            fill
                            className="object-cover"
                            data-ai-hint={precaution.aiHint}
                        />
                    </div>
                )}
                <div className={`flex flex-col items-center text-center p-6 flex-1 ${!precaution.image ? 'pt-12' : ''}`}>
                    <div className={`p-4 bg-primary/10 rounded-full mb-4 ${precaution.image ? '-mt-12 bg-background border-4 border-background' : ''}`}>
                        <precaution.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-bold mb-2 text-lg">{precaution.title}</h3>
                    <p className="text-sm text-muted-foreground">{precaution.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
