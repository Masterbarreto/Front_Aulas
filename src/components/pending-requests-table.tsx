import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { pendingRequests } from '@/lib/data';
import { format } from 'date-fns';
import { StatusBadge } from './status-badge';

export function PendingRequestsTable() {
  const requests = pendingRequests; // In a real app, this would be a fetch call.

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Requests</CardTitle>
      </CardHeader>
      <CardContent>
        {requests.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/3">Class</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
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
                  <TableCell>{request.time}</TableCell>
                  <TableCell className="text-right">
                    <StatusBadge status={request.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-sm text-muted-foreground">
            You have no pending substitution requests.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
