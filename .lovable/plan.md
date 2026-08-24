# Symetra — Plataforma SaaS de Estética

Aplicação web SaaS com a identidade visual Symetra (azul #0D47A1 / #1565C0, fundo #F6F7FA, tipografia Sora + Manrope), com dashboard, gestão de pacientes/atendimentos e base pronta para autenticação e permissões.

## Arquitetura

Stack fixa do projeto: React 19 + TanStack Start (roteamento por arquivos, SSR), TypeScript, Tailwind v4. O backend usa Lovable Cloud (Postgres + Auth + Storage integrados, sem contas externas).

```text
src/
  routes/            # páginas (roteamento por arquivo)
    index.tsx        # landing / entrada
    auth.tsx         # login e cadastro
    _authenticated/  # área logada (dashboard, pacientes, agenda, perfil)
  components/
    ui/              # base (shadcn) com variantes Symetra
    layout/          # AppSidebar, Topbar, PageHeader
    dashboard/       # cards de métrica, gráficos, notificações
    data/            # DataTable, filtros, paginação, form dialogs
  hooks/             # useAuth, useProfile, hooks de dados
  lib/               # utils, formatação, validação (zod)
  services/          # *.functions.ts (chamadas de servidor tipadas)
  types/             # tipos de domínio
  assets/            # logo e imagens
```

## Design system

Tokens semânticos em `src/styles.css` (oklch): azul institucional como `primary`, cinza-azulado neutro para superfícies, gradiente de marca para destaques, sombras suaves, raio 12px. Sora para títulos, Manrope para texto. Nada de cor fixa em componente.

## Banco de dados (Lovable Cloud)

- `profiles` — nome, avatar, telefone, especialidade (vinculado ao usuário, criado por trigger no cadastro)
- `user_roles` — tabela separada com enum `app_role` (admin / profissional / recepcao) + função `has_role` security definer (evita escalonamento de privilégio)
- `patients` — nome, e-mail, telefone, status, observações
- `appointments` — paciente, profissional, data/hora, procedimento, status, valor
- RLS em todas as tabelas + GRANTs explícitos; dados de demonstração inseridos via migração

## Funcionalidades da primeira entrega

1. **Auth**: cadastro e login por e-mail/senha + Google, perfil editável, papéis por usuário, rotas protegidas com redirecionamento.
2. **Dashboard**: cards de métricas (pacientes ativos, atendimentos, faturamento, taxa de retorno), gráfico de atendimentos no período, lista de próximos atendimentos, painel de notificações.
3. **CRUD de Pacientes**: tabela com busca, filtros por status, paginação, criar/editar/ver/excluir em modal com validação zod.
4. **CRUD de Atendimentos**: mesma base reutilizável (DataTable + form), com filtro por período e status.
5. **UX**: skeletons de carregamento, estados vazios, toasts de sucesso/erro, mensagens de erro amigáveis, layout responsivo (sidebar colapsável no desktop, drawer no mobile).

## Segurança

Papéis apenas em `user_roles` (nunca no perfil), RLS escopada por `auth.uid()`, validação no cliente e no servidor, nenhuma chave secreta no frontend.

## Ordem de execução

1. Ativar Lovable Cloud e criar schema + dados fictícios
2. Design system e layout (sidebar, topbar, tokens)
3. Auth + perfil + permissões
4. Dashboard
5. CRUDs de pacientes e atendimentos
