# Barbershop App

Um sistema completo para gerenciamento de barbearias, incluindo agendamentos, vendas de produtos, cursos e análise de clientes.

## Funcionalidades

- Autenticação de usuários (login, cadastro, recuperação de senha)
- Alternância entre temas claro/escuro
- Agendamento de horários
- Marketplace de produtos com integração com os Correios
- Cursos online e vídeo-aulas
- Rastreamento de pedidos
- Cálculo automático de frete
- CRM com análise de comportamento de clientes
- Segmentação de clientes
- Relatórios e estatísticas

## Como Iniciar

### Pré-requisitos

- Node.js (v14 ou posterior)
- npm ou yarn

### Instalação Fácil (Solução para Erro de Execução de Scripts)

1. Execute o arquivo `run-as-admin.bat` na pasta raiz do projeto
   - Este arquivo vai abrir o PowerShell como administrador
   - Vai habilitar a execução de scripts para o usuário atual
   - Vai instalar as dependências e iniciar o servidor

### Instalação Manual

1. Abra o PowerShell como administrador
2. Execute: `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`
3. Navegue até a pasta do projeto: `cd barbershop-app`
4. Instale as dependências: `npm install`
5. Inicie o servidor: `npm run dev`

### Acessando o Sistema

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o resultado.

#### Páginas Principais

- **Login**: http://localhost:3000/auth/login
- **Dashboard**: http://localhost:3000/dashboard
- **Agendamentos**: http://localhost:3000/dashboard/appointments
- **Pedidos**: http://localhost:3000/dashboard/orders
- **Produtos**: http://localhost:3000/dashboard/products
- **Cursos**: http://localhost:3000/dashboard/courses

## Estrutura do Projeto

O projeto foi reorganizado para seguir uma arquitetura mais modular e fácil de manter:

```
barbershop-app/
├── public/            # Arquivos estáticos
├── src/
│   ├── app/           # Rotas e páginas do Next.js
│   │   ├── api/       # API Routes do Next.js
│   │   ├── auth/      # Páginas de autenticação
│   │   └── dashboard/ # Páginas do dashboard
│   ├── components/    # Componentes React reutilizáveis
│   ├── hooks/         # Hooks personalizados
│   ├── lib/           # Lógica de negócios e serviços
│   │   ├── services/  # Serviços da aplicação
│   │   └── types/     # Definições de tipos TypeScript
│   ├── styles/        # Estilos globais
│   └── utils/         # Funções utilitárias
```

## Camadas da Aplicação

O projeto segue uma arquitetura em camadas:

1. **Camada de Apresentação**: Componentes React e páginas Next.js
2. **Camada de API**: Endpoints da API para comunicação cliente-servidor
3. **Camada de Serviços**: Lógica de negócios e operações
4. **Camada de Dados**: Acesso e manipulação de dados

## Modo de Armazenamento

O aplicativo suporta dois modos de armazenamento:

1. **localStorage**: Para desenvolvimento e demonstração (padrão)
2. **Supabase**: Para produção e dados persistentes

Para usar o Supabase, configure as variáveis de ambiente no arquivo `.env.local`.

## Autenticação

O aplicativo usa Supabase para autenticação em produção e uma implementação local para desenvolvimento. Para configurar o Supabase:

1. Crie uma conta e projeto no Supabase
2. Adicione sua URL do Supabase e chave anônima às variáveis de ambiente
3. Configure os provedores de autenticação no painel do Supabase

## Integração com Correios

O sistema inclui integração com a API dos Correios para:

1. Cálculo automático de frete baseado no CEP, peso e dimensões
2. Geração de etiquetas de envio
3. Rastreamento de encomendas em tempo real

Para usar a integração real com os Correios, você precisará substituir as funções simuladas em `src/lib/correios.ts` por chamadas reais à API dos Correios.

## Estrutura de Dados

O sistema utiliza as seguintes entidades principais:

- **User**: Usuários do sistema (clientes e profissionais)
  - id, name, email, phone, type, birthDate, createdAt, lastLogin, preferences

- **Appointment**: Agendamentos de serviços
  - id, clientId, barberId, serviceId, date, time, duration, status, price, notes, createdAt, updatedAt

- **Service**: Serviços oferecidos pela barbearia
  - id, name, description, price, duration, category, image, isActive

- **Product**: Produtos disponíveis para venda
  - id, name, description, price, stock, category, image, isActive, createdAt, updatedAt

- **Order**: Pedidos de produtos
  - id, clientId, items, total, status, paymentMethod, createdAt, updatedAt

- **ClientInteraction**: Interações com clientes para análise
  - id, clientId, type, date, value, details, source

- **ClientSegment**: Segmentos de clientes para marketing
  - id, name, description, criteria, color

- **ClientInsight**: Análises e recomendações para clientes
  - clientId, visitFrequency, lastVisit, totalSpent, preferredServices, preferredBarbers, purchaseHistory, lifetimeValue, churnRisk, segments, nextVisitPrediction, recommendedServices, recommendedProducts
