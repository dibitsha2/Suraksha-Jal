
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Video } from 'lucide-react';

export function WaterFilterVideoDialog() {
  const [isOpen, setIsOpen] = useState(false);

  // YouTube embed URL
  const videoUrl = 'https://www.youtube.com/embed/lHFElyiA2m8';

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Video className="mr-2 h-4 w-4" />
          Watch Video Guide
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Natural Water Filtration</DialogTitle>
          <DialogDescription>
            Learn how to create a simple and effective water filter using natural materials.
          </DialogDescription>
        </DialogHeader>
        <div className="aspect-video">
           <iframe 
                className="w-full h-full rounded-lg"
                src={videoUrl} 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
            ></iframe>
        </div>
      </DialogContent>
    </Dialog>
  );
}
