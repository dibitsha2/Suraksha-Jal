
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

  // A sample video URL. In a real application, you'd host this yourself.
  const videoUrl = 'https://www.w3schools.com/html/mov_bbb.mp4';

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
           <video className="w-full h-full rounded-lg" controls>
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
      </DialogContent>
    </Dialog>
  );
}
