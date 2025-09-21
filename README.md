# Sub_Aulas - Sistema de Gestão de Substituição de Aulas

<div align="center">

![Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow)
![License](https://img.shields.io/badge/License-MIT-blue)
![Version](https://img.shields.io/badge/Version-1.5.0-orange)

**Plataforma web para otimizar o processo de substituição de aulas no ambiente educacional.**

</div>

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Instalação](#-instalação)
- [Uso](#-uso)
- [Licença](#-licença)

---

## 🎯 Sobre o Projeto

O **Sub_Aulas** é uma solução tecnológica desenvolvida para modernizar e otimizar o processo de substituição de aulas. O sistema oferece uma interface intuitiva e segura que permite aos professores cadastrar, visualizar e gerenciar aulas disponíveis para substituição de forma eficiente.

### 🔍 Problema Identificado
- Processo manual e demorado para substituição de aulas.
- Falta de transparência na disponibilidade de substituições.
- Dificuldade no controle administrativo e pedagógico.
- Comunicação ineficiente entre professores e coordenação.

### 💡 Solução Proposta
Uma plataforma web centralizada que garante:
- **Agilidade** na busca e cadastro de aulas.
- **Transparência** no processo de substituição.
- **Controle** administrativo e pedagógico aprimorado.
- **Segurança** através de um sistema de autenticação robusto.

---

## ⚡ Funcionalidades

### 🔐 Autenticação e Gestão
- **Login Administrativo:** Acesso seguro para professores gerenciarem as aulas.
- **Dashboard Intuitivo:** Visualização de cursos organizados por ano, curso e matéria.
- **Gerenciamento de Aulas:** Cadastro, edição, exclusão e visualização de todas as aulas.
- **Conclusão de Aulas:** Permite marcar uma aula como "concluída", registrando o professor que a ministrou.

### 👨‍🏫 Acesso do Professor
- **Filtro de Aulas:** Professores podem encontrar aulas por ano, curso e matéria.
- **Visualização de Detalhes:** Cada aula possui uma página dedicada com descrição, arquivos para download e links externos.
- **Responsividade:** Design adaptável para desktops, tablets e celulares.

### 📊 Relatórios e Monitoramento
- **Relatório de Aulas Concluídas:** Uma tabela para visualizar todas as aulas que já foram aplicadas.
- **Dashboard de Gerenciamento:** Gráficos e estatísticas sobre as aulas cadastradas, incluindo aulas por dia e as matérias com mais substituições.

---

## 🛠 Tecnologias

O projeto é construído com tecnologias modernas, focando em performance, escalabilidade e uma ótima experiência de desenvolvimento.

### Frontend
- **Framework**: [Next.js](https://nextjs.org/) (com App Router)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
- **Biblioteca UI**: [React](https://react.dev/)
- **Estilização**: [Tailwind CSS](https://tailwindcss.com/)
- **Componentes UI**: [Shadcn/UI](https://ui.shadcn.com/)
- **Ícones**: [Lucide React](https://lucide.dev/)
- **Formulários**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Gráficos**: [Recharts](https://recharts.org/)

### Backend (API Externa)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Banco de Dados**: MongoDB

### Infraestrutura e Deploy
- **Hospedagem Frontend**: Firebase App Hosting / Vercel
- **Hospedagem Backend (API)**: Render
- **Controle de Versão**: Git & GitHub

---

## 🚀 Instalação

Para rodar este projeto localmente, siga os passos abaixo:

### Pré-requisitos
- Node.js (v18 ou superior)
- npm, yarn ou pnpm
- Git

### Configuração

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/Masterbarreto/Front_Aulas.git
   ```

2. **Navegue até o diretório do projeto:**
   ```bash
   cd Front_Aulas
   ```

3. **Instale as dependências:**
   ```bash
   npm install
   ```

4. **Configure as variáveis de ambiente (se necessário):**
   Crie um arquivo `.env.local` na raiz do projeto se precisar sobrescrever as URLs da API ou outras variáveis.

---

## 📖 Uso

Após a instalação, você pode iniciar o servidor de desenvolvimento:

```bash
npm run dev
```

Abra [http://localhost:3000/teacher/dashboard](http://localhost:3000/teacher/dashboard) no seu navegador para ver a aplicação em funcionamento.

### Login Administrativo
1. No menu lateral, clique em "Login Administrativo".
2. Use as credenciais fornecidas para acessar as funcionalidades de gerenciamento.
3. Após o login, os links "Upload de Atividades" e "Gerenciar Atividades" aparecerão no menu.

### Gerenciamento de Aulas
- **Upload**: Na tela "Upload de Atividades", preencha o formulário para criar uma nova aula.
- **Gerenciar**: Na tela "Gerenciar Atividades", visualize todas as aulas em uma tabela, com opções para editar ou deletar.
- **Detalhes**: Clique em uma aula na tabela para ver seus detalhes, marcar como concluída ou desconcluir.


---

## 📄 Licença

Este projeto está sob a licença MIT.

---

<div align="center">

**Desenvolvido com ❤️**

[⬆️ Voltar ao topo](#sub_aulas---sistema-de-gestão-de-substituição-de-aulas)

</div>
