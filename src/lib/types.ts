export type SubstitutionRequest = {
  id: string;
  class: string;
  date: string; // YYYY-MM-DD
  time: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Denied';
  substitute?: string;
  substituteAvatar?: string;
};

export type Teacher = {
  name: string;
  avatarUrl: string;
};
