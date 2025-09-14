import { Header } from '@/components/header';
import { HistoryTable } from '@/components/history-table';
import { PendingRequestsTable } from '@/components/pending-requests-table';
import { NewRequestButton } from '@/components/new-request-button';

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-4 shadow-sm backdrop-blur-sm md:px-6">
        <Header />
        <NewRequestButton />
      </header>
      <main className="container mx-auto flex flex-1 flex-col gap-8 p-4 md:p-8">
        <PendingRequestsTable />
        <HistoryTable />
      </main>
    </div>
  );
}
