import { format } from 'date-fns';
import type { SubstitutionRequest, Teacher } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export const classes = [
  'Mathematics 101',
  'History of Art',
  'Introduction to Physics',
  'Creative Writing',
  'Advanced Chemistry',
  'World Literature',
];

export const timeSlots = [
  '08:00 - 09:00',
  '09:00 - 10:00',
  '10:00 - 11:00',
  '11:00 - 12:00',
  '13:00 - 14:00',
  '14:00 - 15:00',
  '15:00 - 16:00',
];

export const pendingRequests: SubstitutionRequest[] = [
  {
    id: 'REQ-001',
    class: 'Mathematics 101',
    date: format(new Date(new Date().setDate(new Date().getDate() + 2)), 'yyyy-MM-dd'),
    time: '10:00 - 11:00',
    reason: "Doctor's appointment",
    status: 'Pending',
  },
  {
    id: 'REQ-002',
    class: 'History of Art',
    date: format(new Date(new Date().setDate(new Date().getDate() + 5)), 'yyyy-MM-dd'),
    time: '14:00 - 15:00',
    reason: 'Family emergency',
    status: 'Pending',
  },
];

export const historyRequests: SubstitutionRequest[] = [
  {
    id: 'REQ-003',
    class: 'Introduction to Physics',
    date: format(new Date(new Date().setDate(new Date().getDate() - 3)), 'yyyy-MM-dd'),
    time: '08:00 - 09:00',
    reason: 'Conference attendance',
    status: 'Approved',
    substitute: 'Dr. Evelyn Reed',
    substituteAvatar: PlaceHolderImages.find((p) => p.id === 'teacher-1')?.imageUrl,
  },
  {
    id: 'REQ-004',
    class: 'Creative Writing',
    date: format(new Date(new Date().setDate(new Date().getDate() - 10)), 'yyyy-MM-dd'),
    time: '11:00 - 12:00',
    reason: 'Personal leave',
    status: 'Approved',
    substitute: 'Mr. Samuel Chen',
    substituteAvatar: PlaceHolderImages.find((p) => p.id === 'teacher-2')?.imageUrl,
  },
  {
    id: 'REQ-005',
    class: 'Advanced Chemistry',
    date: format(new Date(new Date().setDate(new Date().getDate() - 15)), 'yyyy-MM-dd'),
    time: '13:00 - 14:00',
    reason: 'Sick leave',
    status: 'Denied',
  },
];

export const allTeachers: Teacher[] = [
  { name: 'Dr. Evelyn Reed', avatarUrl: PlaceHolderImages.find((p) => p.id === 'teacher-1')?.imageUrl || '' },
  { name: 'Mr. Samuel Chen', avatarUrl: PlaceHolderImages.find((p) => p.id === 'teacher-2')?.imageUrl || '' },
  { name: 'Ms. Clara Bell', avatarUrl: PlaceHolderImages.find((p) => p.id === 'teacher-3')?.imageUrl || '' },
  { name: 'Dr. Ben Carter', avatarUrl: PlaceHolderImages.find((p) => p.id === 'teacher-4')?.imageUrl || '' },
];
