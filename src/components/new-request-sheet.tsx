'use client';

import { useEffect, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { getAiSuggestions, createSubstitutionRequest } from '@/lib/actions';
import { classes, timeSlots } from '@/lib/data';
import type { Teacher } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const formSchema = z.object({
  class: z.string({ required_error: 'Please select a class.' }).min(1),
  date: z.date({ required_error: 'Please select a date.' }),
  time: z.string({ required_error: 'Please select a time.' }).min(1),
  reason: z.string().min(1, 'Please provide a reason.').max(500),
  substitute: z.string().optional(),
});

type NewRequestSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
        </>
      ) : (
        'Submit Request'
      )}
    </Button>
  );
}

export function NewRequestSheet({
  open,
  onOpenChange,
  onSuccess,
}: NewRequestSheetProps) {
  const { toast } = useToast();
  const [initialState, formAction] = useFormState(createSubstitutionRequest, {
    message: '',
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { reason: '' },
  });

  const [suggestions, setSuggestions] = useState<Teacher[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const classValue = form.watch('class');
  const dateValue = form.watch('date');
  const timeValue = form.watch('time');

  useEffect(() => {
    if (classValue && dateValue && timeValue) {
      setLoadingSuggestions(true);
      getAiSuggestions(classValue, dateValue, timeValue)
        .then(setSuggestions)
        .finally(() => setLoadingSuggestions(false));
    }
  }, [classValue, dateValue, timeValue]);

  useEffect(() => {
    if (initialState.success) {
      toast({
        title: 'Request Submitted',
        description: 'Your substitution request is now pending approval.',
      });
      onSuccess();
      form.reset();
      setSuggestions([]);
    } else if (initialState.message && !initialState.success) {
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: initialState.message,
      });
    }
  }, [initialState, onSuccess, toast, form]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl w-full flex flex-col">
        <SheetHeader>
          <SheetTitle>New Substitution Request</SheetTitle>
          <SheetDescription>
            Fill out the details below to request a substitute teacher.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            action={formAction}
            className="flex flex-1 flex-col justify-between"
          >
            <div className="space-y-6 overflow-y-auto px-1 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="class"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Class/Subject</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a class" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {classes.map((c) => (
                            <SelectItem key={c} value={c}>
                              {c}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time Slot</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a time slot" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {timeSlots.map((t) => (
                            <SelectItem key={t} value={t}>
                              {t}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                    <input type="hidden" name="date" value={field.value ? format(field.value, 'yyyy-MM-dd') : ''} />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason for Absence</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Doctor's appointment, conference, etc."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              { (loadingSuggestions || suggestions.length > 0) &&
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Suggested Substitutes</h3>
                  {loadingSuggestions ? (
                    <div className="space-y-3">
                      {[...Array(2)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-4">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-[150px]" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : suggestions.length > 0 ? (
                    <FormField
                      control={form.control}
                      name="substitute"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="gap-3"
                            >
                              {suggestions.map((teacher) => (
                                <FormItem key={teacher.name}>
                                  <FormControl>
                                    <Card>
                                      <CardContent className="p-3">
                                        <label className="flex items-center gap-4 cursor-pointer">
                                          <RadioGroupItem
                                            value={teacher.name}
                                          />
                                          <Avatar className="h-10 w-10">
                                            <AvatarImage
                                              src={teacher.avatarUrl}
                                              alt={teacher.name}
                                            />
                                            <AvatarFallback>
                                              {teacher.name.split(' ').map(n=>n[0]).join('')}
                                            </AvatarFallback>
                                          </Avatar>
                                          <span className="font-medium">
                                            {teacher.name}
                                          </span>
                                        </label>
                                      </CardContent>
                                    </Card>
                                  </FormControl>
                                </FormItem>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : null }
                </div>
              }
            </div>
            <SheetFooter className="mt-auto pt-4 border-t">
              <SubmitButton />
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
