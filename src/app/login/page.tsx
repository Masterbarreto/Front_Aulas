'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GraduationCap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await fetch(
        'https://apisubaulas.onrender.com/api/v1/users/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: email, senha: password }),
        }
      );

      if (!response.ok) {
        throw new Error('Falha no login. Verifique suas credenciais.');
      }

      // Sucesso no login
      localStorage.setItem('isLoggedIn', 'true');
      
      router.push('/teacher/dashboard');
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('Ocorreu um erro desconhecido.');
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
        <CardContent className="flex flex-col gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              className="bg-gray-800 border-gray-700"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              className="bg-gray-800 border-gray-700"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700"
            onClick={handleLogin}
          >
            Entrar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
