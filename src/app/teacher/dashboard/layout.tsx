'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bell,
  Book,
  Home,
  LogOut,
  User,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { href: '/teacher/dashboard', icon: Home, label: 'Início' },
    { href: '/teacher/dashboard/turmas', icon: Users, label: 'Turmas' },
    { href: '/teacher/dashboard/alunos', icon: User, label: 'Alunos' },
    { href: '/teacher/dashboard/materias', icon: Book, label: 'Matérias' },
  ];

  return (
    <div className="flex min-h-screen w-full bg-gray-950 text-white">
      <aside className="w-64 flex-col border-r border-gray-800 bg-gray-900 p-4 hidden md:flex">
        <div className="mb-8 flex items-center gap-2">
          <Book className="h-8 w-8 text-purple-500" />
          <h1 className="text-2xl font-bold">SchoolApp</h1>
        </div>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white ${
                pathname === item.href ? 'bg-gray-800 text-white' : ''
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="mt-auto">
          <Button variant="ghost" className="w-full justify-start gap-3">
            <LogOut className="h-5 w-5" />
            Sair
          </Button>
        </div>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-gray-800 bg-gray-900 px-6">
          <div />
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <div className="h-10 w-10 rounded-full bg-gray-800" />
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
