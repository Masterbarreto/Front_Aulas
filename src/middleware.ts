import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // As rotas a serem protegidas
  const protectedRoutes = ['/teacher/dashboard/upload', '/teacher/dashboard/gerenciar'];

  // Verifica se a rota atual é uma das protegidas
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute) {
    // A lógica atual usa localStorage, que não é acessível no middleware (server-side).
    // A abordagem correta seria usar cookies seguros (httpOnly).
    // Como a implementação atual depende de 'isLoggedIn' no localStorage,
    // o middleware não pode validar a sessão diretamente.
    // A verificação no `DashboardLayout` ainda será necessária, mas o middleware
    // estabelece a arquitetura correta para uma futura autenticação baseada em cookies.
    
    const isLoggedInCookie = request.cookies.get('isLoggedIn');

    if (!isLoggedInCookie || isLoggedInCookie.value !== 'true') {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      // Redireciona para a página de login se não estiver autenticado
      return NextResponse.redirect(url);
    }
  }

  // Permite o acesso se a rota não for protegida ou se o usuário estiver autenticado
  return NextResponse.next();
}

// Configuração para aplicar o middleware apenas nas rotas desejadas
export const config = {
  matcher: ['/teacher/dashboard/upload', '/teacher/dashboard/gerenciar'],
};
