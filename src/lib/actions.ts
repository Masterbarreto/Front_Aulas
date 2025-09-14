'use server';

import { suggestSuitableSubstitutes } from '@/ai/flows/suggest-suitable-substitutes';
import { z } from 'zod';
import { allTeachers } from './data';
import { revalidatePath } from 'next/cache';
import { format } from 'date-fns';

const requestSchema = z.object({
  class: z.string().min(1, 'Class is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  reason: z.string().min(1, 'Reason is required'),
  substitute: z.string().optional(),
});

export async function createSubstitutionRequest(
  prevState: any,
  formData: FormData
) {
  const validatedFields = requestSchema.safeParse({
    class: formData.get('class'),
    date: formData.get('date'),
    time: formData.get('time'),
    reason: formData.get('reason'),
    substitute: formData.get('substitute'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Please check the form for errors.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // In a real app, you would save this to a database.
  console.log('New substitution request:', validatedFields.data);

  revalidatePath('/');
  return { success: true, message: 'Request submitted successfully.' };
}

export async function getAiSuggestions(
  classSubject: string,
  date: Date,
  time: string
) {
  if (!classSubject || !date || !time) {
    return [];
  }

  try {
    const result = await suggestSuitableSubstitutes({
      classSubject,
      date: format(date, 'yyyy-MM-dd'),
      time,
    });

    const suggestedNames = result.suggestedSubstitutes;

    // Map names to full teacher objects from our mock data
    const suggestions = allTeachers.filter((teacher) =>
      suggestedNames.includes(teacher.name)
    );
    // If AI returns nothing, return some defaults to ensure UI is populated
    if (suggestions.length === 0) {
      return allTeachers.slice(0, 2);
    }
    return suggestions;
  } catch (error) {
    console.error('Error fetching AI suggestions:', error);
    // Fallback to a default list in case of an error
    return allTeachers.slice(0, 2);
  }
}
