'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Upload,
  LogOut,
  LayoutDashboard,
  FileText,
  Wrench,
  GraduationCap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { href: '/teacher/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    {
      href: '/teacher/dashboard/upload',
      icon: Upload,
      label: 'Upload de Atividades',
    },
    {
      href: '/teacher/dashboard/gerenciar',
      icon: Wrench,
      label: 'Gerenciar Atividades',
    },
    {
      href: '/teacher/dashboard/relatorio',
      icon: FileText,
      label: 'Relatório de Aula',
    },
  ];

  return (
    <div className="flex min-h-screen w-full bg-[#1C1C24] text-white">
      <aside className="w-64 flex-col border-r border-gray-800 bg-[#111115] p-4 hidden md:flex">
        <div className="mb-8 flex items-center gap-2 p-4">
          <LayoutDashboard className="h-8 w-8 text-white" />
          <h1 className="text-xl font-bold">Dashboard</h1>
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
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
