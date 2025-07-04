# GitHub Actions Secrets Configuration

Para configurar corretamente os workflows de CI/CD, você precisa adicionar os seguintes secrets no seu repositório GitHub:

## 📋 Secrets Necessários

### Para Docker Hub (Opcional):
- `DOCKERHUB_USERNAME` - Seu username do Docker Hub
- `DOCKERHUB_TOKEN` - Token de acesso do Docker Hub

### Para Vercel (Opcional):
- `VERCEL_TOKEN` - Token de API do Vercel
- `ORG_ID` - ID da organização Vercel
- `PROJECT_ID` - ID do projeto Vercel

## 🔧 Como Configurar os Secrets

1. Vá para seu repositório no GitHub
2. Clique em **Settings** → **Secrets and variables** → **Actions**
3. Clique em **New repository secret**
4. Adicione os secrets listados acima

## 📦 GitHub Container Registry

O GitHub Container Registry funciona automaticamente com o token `GITHUB_TOKEN` que é fornecido automaticamente pelos GitHub Actions.

### ⚙️ Permissões Necessárias

Para que o workflow funcione corretamente, certifique-se de que as seguintes permissões estão habilitadas:

1. **Workflow Permissions**:
   - Vá para **Settings** → **Actions** → **General**
   - Em "Workflow permissions", selecione **"Read and write permissions"**
   - Marque **"Allow GitHub Actions to create and approve pull requests"**

2. **Code Scanning** (para security scan):
   - O workflow tem permissões específicas para `security-events: write`
   - Isso permite upload de resultados SARIF para GitHub Advanced Security

### 🔧 Correções Aplicadas

- ✅ **CodeQL Action**: Atualizado de v2 para v3 (v2 está depreciado)
- ✅ **Security Permissions**: Adicionadas permissões específicas para o job de security
- ✅ **Git Repository**: Adicionado checkout no job de security para resolver erros de git

## 🚀 Workflows Disponíveis

### 1. `docker-simple.yml`
- Build básico para testes
- Ideal para desenvolvimento
- Não faz push para registries

### 2. `docker-production.yml`
- Pipeline completo de produção
- Build multi-platform
- Push para registries
- Security scanning
- Deploy notifications

### 3. `docker-ci.yml`
- Pipeline de integração contínua
- Testes automatizados
- Linting
- Build e push condicionais

## 🔄 Fluxo de Trabalho

1. **Push/PR** → Trigger do workflow
2. **Testes** → Execução de linting e testes
3. **Build** → Construção da imagem Docker
4. **Push** → Envio para registries (apenas em push para main)
5. **Security** → Scan de vulnerabilidades
6. **Deploy** → Notificação de deploy pronto

## 📊 Badges para README

Adicione estes badges ao seu README para mostrar o status dos builds:

```markdown
![Docker CI](https://github.com/seu-usuario/seu-repo/workflows/Sub_Aulas%20Docker%20Build%20&%20Deploy/badge.svg)
![Security Scan](https://github.com/seu-usuario/seu-repo/workflows/Security%20Scan/badge.svg)
```
