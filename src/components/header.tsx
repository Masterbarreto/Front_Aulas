import { BookOpen } from 'lucide-react';

export function Header() {
  return (
    <div className="flex items-center gap-3">
      <BookOpen className="h-8 w-8 text-primary" />
      <h1 className="text-2xl font-bold text-foreground">SubstituteMe</h1>
    </div>
  );
}
