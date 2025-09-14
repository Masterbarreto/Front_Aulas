'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { NewRequestSheet } from '@/components/new-request-sheet';
import { Plus } from 'lucide-react';

export function NewRequestButton() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleSuccess = () => {
    setIsSheetOpen(false);
  };

  return (
    <>
      <Button
        onClick={() => setIsSheetOpen(true)}
        className="bg-accent hover:bg-accent/90 text-accent-foreground"
      >
        <Plus className="mr-2 h-4 w-4" />
        New Request
      </Button>
      <NewRequestSheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        onSuccess={handleSuccess}
      />
    </>
  );
}
