# Sub_Aulas - Sistema de Gestão de Substituição de Aulas

<div align="center">

![Status](https://img.shields.io/badge/Status-Em%20Produção-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)
![Version](https://img.shields.io/badge/Version-1.1.0-orange)

**Plataforma web para otimização do processo de substituição de aulas no ambiente educacional do Senac**

[🌐 Visualizar Aplicação](https://sub-aulas.vercel.app/) • [📋 Documentação da API](https://github.com/Masterbarreto/ApiSubAulas) • [🎨 Design System](https://www.figma.com/design/IUSOYtXSlyyjXeI9szk8z7/Projeto-de-Subtição-de-Aulas?node-id=82-2&p=f&t=IHAJcfgFbdfpIGJ8-0)

</div>

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Arquitetura](#-arquitetura)
- [Instalação](#-instalação)
- [Uso](#-uso)
- [Roadmap](#-roadmap)
- [Equipe](#-equipe)
- [Contribuição](#-contribuição)
- [Licença](#-licença)

---

## 🎯 Sobre o Projeto

O **Sub_Aulas** é uma solução tecnológica desenvolvida para modernizar e otimizar o processo de substituição de aulas no ambiente educacional do Senac. O sistema oferece uma interface intuitiva e segura que permite aos professores cadastrar, visualizar e gerenciar aulas disponíveis para substituição de forma eficiente.

### 🔍 Problema Identificado
- Processo manual e demorado para substituição de aulas
- Falta de transparência na disponibilidade de substituições
- Dificuldade no controle administrativo e fiscal
- Comunicação ineficiente entre professores e coordenação

### 💡 Solução Proposta
Uma plataforma web centralizada que garante:
- **Transparência** no processo de substituição
- **Agilidade** na busca e cadastro de aulas
- **Controle** administrativo e pedagógico aprimorado
- **Segurança** através de autenticação robusta

---

## ⚡ Funcionalidades

### 🔐 Autenticação e Segurança
- Sistema de login seguro para professores
- Criptografia de senhas com Bcrypt
- Controle de sessões e permissões

### 📚 Gestão de Aulas
- **Cadastro** de aulas disponíveis para substituição
- **Consulta** em tempo real de oportunidades
- **Filtros avançados** por curso, série e professor
- **Edição e exclusão** de registros próprios

### 📊 Monitoramento e Controle
- **Sistema de logs** detalhado com Chalk
- **Documentação automática** da API com Swagger
- **Rastreabilidade** completa das operações

### 🛠 Novidades na Versão 1.1.0
- **Integração com Segment Analytics**:
  - Rastreio de rotas e atividades do usuário.
  - Inicialização do Segment Analytics no componente `App`.
  - Registro de visualizações de página em mudanças de rota.
- **Registro de Atividades do Usuário**:
  - Implementado em `AulaScreens` e `EditarAula` para ações como concluir ou editar aulas.
- **Relatórios e Visualização de Dados**:
  - Adicionado um dashboard no componente `RelatorioEdit` com gráficos interativos.
  - Criados os componentes `Grafico1`, `Grafico2` e `Grafico3` para visualização de dados.
- **Melhorias na Interface**:
  - Estilos atualizados para gráficos e seções de relatórios.
- **Refatoração**:
  - Simplificação do arquivo `main.jsx` para uso do `BrowserRouter`.

---

## 🛠 Tecnologias

### Frontend
```
TypeScript    - Tipagem estática e desenvolvimento robusto
JavaScript    - Lógica de negócio do cliente
HTML5         - Estruturação semântica
CSS3          - Estilização e responsividade
```

### Backend
```
Node.js       - Runtime JavaScript server-side
Express.js    - Framework web minimalista e flexível
MongoDB       - Banco de dados NoSQL escalável
Yup           - Validação de esquemas de dados
Bcrypt        - Hashing seguro de senhas
Swagger       - Documentação automática de APIs
Chalk         - Sistema de logs colorido
```

### Infraestrutura e DevOps
```
Vercel        - Hospedagem e deploy do frontend
Render        - Hospedagem do backend e APIs
MongoDB Atlas - Banco de dados em nuvem
Git/GitHub    - Controle de versão e colaboração
```

### Design e Prototipagem
```
Figma         - Design system e prototipagem
Draw.io       - Diagramação da arquitetura
```

---

## 🏗 Arquitetura

```mermaid
graph TB
    A[Cliente/Browser] --> B[Frontend - Vercel]
    B --> C[API REST - Render]
    C --> D[MongoDB Atlas]
    
    E[Figma] --> F[Design System]
    G[GitHub] --> H[CI/CD Pipeline]
    H --> B
    H --> C
    
    subgraph "Frontend Stack"
        B --> I[TypeScript/JavaScript]
        I --> J[HTML5/CSS3]
    end
    
    subgraph "Backend Stack"
        C --> K[Node.js/Express]
        K --> L[Swagger Docs]
        K --> M[Chalk Logs]
    end
    
    subgraph "Database Layer"
        D --> N[Collections]
        N --> O[Users]
        N --> P[Classes]
        N --> Q[Substitutions]
    end
```

---

## 🚀 Instalação

### Pré-requisitos
```bash
Node.js >= 16.0.0
npm >= 8.0.0
MongoDB >= 5.0
Git >= 2.0
```

### Configuração do Ambiente

1. **Clone os repositórios**
```bash
# Backend
git clone https://github.com/Masterbarreto/ApiSubAulas.git
cd ApiSubAulas

# Frontend
git clone https://github.com/Masterbarreto/Front_Aulas.git
cd Front_Aulas
```

2. **Instale as dependências**
```bash
# No diretório do backend
npm install

# No diretório do frontend
npm install
```

3. **Configure as variáveis de ambiente**
```bash
# Crie um arquivo .env no backend
cp .env.example .env

# Configure as variáveis necessárias
DATABASE_URL=mongodb://localhost:27017/sub_aulas
JWT_SECRET=seu_jwt_secret_aqui
PORT=3001
```

4. **Execute o projeto**
```bash
# Frontend (terminal 1)
npm run dev

# Backend (terminal 2)
npm start
```

---

## 📖 Uso

### Acesso ao Sistema
1. Acesse [https://sub-aulas.vercel.app/](https://sub-aulas.vercel.app/)
2. Faça login com suas credenciais de professor
3. Navegue pelas funcionalidades disponíveis

### Cadastro de Aula para Substituição
1. Clique em "Nova Substituição"
2. Preencha os dados da aula (curso, série, data, horário)
3. Confirme o cadastro
4. A aula ficará disponível para outros professores

### Busca de Substituições
1. Use os filtros disponíveis (curso, série, professor)
2. Visualize as oportunidades em tempo real
3. Candidate-se às substituições desejadas

---

## 🗺 Roadmap

### 🎯 Curto Prazo (1-3 meses)
- [ ] **Sistema de Notificações**
  - Alertas por e-mail para novas oportunidades
  - Notificações push no navegador
  - Lembretes de aulas próximas

### 📊 Médio Prazo (3-6 meses)
- [ ] **Dashboard Analytics**
  - Métricas de substituições por professor
  - Relatórios de frequência e performance
  - Gráficos de demanda por curso/série

### 🤖 Longo Prazo (6-12 meses)
- [ ] **Chatbot Inteligente**
  - Assistente virtual para dúvidas
  - Sugestões automáticas de substituições
  - Integração com IA para otimização

### 🔄 Melhorias Contínuas
- [ ] App mobile nativo
- [ ] Integração com sistemas acadêmicos
- [ ] Sistema de avaliação de substituições
- [ ] Módulo financeiro automatizado

---

## 👥 Equipe

### Desenvolvedores
<table>
  <tr>
    <td align="center">
      <strong>Pedro Henrique Vieira Barreto</strong><br>
      <em>Full Stack Developer</em><br>
      📧 Contato disponível no GitHub
    </td>
    <td align="center">
      <strong>Aloisio Terra Nova Neto</strong><br>
      <em>Full Stack Developer</em><br>
      📧 Contato disponível no GitHub
    </td>
  </tr>
</table>

### Orientação Acadêmica
<table>
  <tr>
    <td align="center">
      <strong>Prof. Giuliana de Jesus Salles</strong><br>
      <em>Orientadora</em>
    </td>
    <td align="center">
      <strong>Prof. Victor Moreira Queiroz</strong><br>
      <em>Orientador</em>
    </td>
  </tr>
</table>

---

## 🤝 Contribuição

Contribuições são sempre bem-vindas! Para contribuir:

1. **Fork** o projeto
2. **Crie** uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. **Abra** um Pull Request

### 📋 Guidelines de Contribuição
- Siga os padrões de código estabelecidos
- Escreva testes para novas funcionalidades
- Documente mudanças significativas
- Mantenha commits claros e concisos

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 📞 Suporte

- 📧 **Issues:** [GitHub Issues](https://github.com/Masterbarreto/ApiSubAulas/issues)
- 📖 **Documentação:** [API Docs](https://github.com/Masterbarreto/ApiSubAulas)
- 🎨 **Design System:** [Figma](https://www.figma.com/design/IUSOYtXSlyyjXeI9szk8z7/Projeto-de-Subtição-de-Aulas)

---

<div align="center">

**Desenvolvido com ❤️ pela equipe Sub_Aulas**

[⬆️ Voltar ao topo](#sub_aulas---sistema-de-gestão-de-substituição-de-aulas)

</div>