'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GraduationCap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Email inválido.').min(1, 'Email é obrigatório.'),
  password: z.string().min(1, 'Senha é obrigatória.'),
});

type LoginSchema = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [apiError, setApiError] = useState<string | null>(null);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const handleLogin = async (data: LoginSchema) => {
    setApiError(null);
    try {
      const response = await fetch(
        'https://apisubaulas.onrender.com/api/v1/users/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: data.email, password: data.password }),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.message || 'Falha no login. Verifique suas credenciais.'
        );
      }

      // Sucesso no login
      localStorage.setItem('isLoggedIn', 'true');
      router.push('/teacher/dashboard');
    } catch (error) {
      if (error instanceof Error) {
        setApiError(error.message);
      } else {
        setApiError('Ocorreu um erro desconhecido.');
      }
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#1C1C24] p-4">
      <Card className="w-full max-w-sm bg-[#111115] border-gray-800 text-white">
        <CardHeader className="items-center text-center">
          <div className="mb-4 flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-white" />
            <h1 className="text-xl font-bold">Subaulas</h1>
          </div>
          <CardTitle className="text-2xl">Login Administrativo</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleLogin)} className="flex flex-col gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                className="bg-gray-800 border-gray-700"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                className="bg-gray-800 border-gray-700"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
            {apiError && <p className="text-sm text-red-500">{apiError}</p>}
            <Button
              type="submit"
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700"
            >
              Entrar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}