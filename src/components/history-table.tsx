import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { historyRequests } from '@/lib/data';
import { format } from 'date-fns';
import { StatusBadge } from './status-badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function HistoryTable() {
  const requests = historyRequests; // In a real app, this would be a fetch call.

  return (
    <Card>
      <CardHeader>
        <CardTitle>Substitution History</CardTitle>
        <CardDescription>A record of your past requests.</CardDescription>
      </CardHeader>
      <CardContent>
        {requests.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/4">Class</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Substitute</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.class}</TableCell>
                  <TableCell>
                    {format(new Date(request.date), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>
                    {request.substitute ? (
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={request.substituteAvatar}
                            alt={request.substitute}
                            data-ai-hint="person portrait"
                          />
                          <AvatarFallback>
                            {request.substitute
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{request.substitute}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <StatusBadge status={request.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-sm text-muted-foreground">
            No past substitutions found.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
