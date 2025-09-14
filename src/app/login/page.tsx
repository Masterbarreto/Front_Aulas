import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GraduationCap } from 'lucide-react';

export default function LoginPage() {
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
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              className="bg-gray-800 border-gray-700"
            />
          </div>
          <Button className="mt-4 w-full bg-blue-600 hover:bg-blue-700">
            Entrar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
