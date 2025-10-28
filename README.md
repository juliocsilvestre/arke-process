# 🎪 Carvalheira Event Management System# 🎪 Carvalheira Event Management System

[English](#english) | [Português](#português)Sistema de gestão e controle de funcionários para eventos desenvolvido para a empresa **Carvalheira - Criando Memórias**.

---## 📋 Sobre o Projeto

## EnglishEste sistema foi desenvolvido em **1 mês e meio** para gerenciar um evento de grande porte com:

### 📋 About the Project- 👥 **2.000 pessoas por dia**

- 📅 **4 dias de duração**

Event management and staff control system developed for **Carvalheira - Criando Memórias** event company.- 🏢 **Múltiplas empresas fornecedoras**

- ⏰ **Controle de entrada e saída de funcionários**

This system was developed in **1.5 months** to manage a large-scale event featuring:

- 👥 **2,000 people per day**O projeto foi executado **localmente** através de Docker em rede interna durante o evento, garantindo estabilidade e performance mesmo sem conexão com internet.

- 📅 **4-day duration**

- 🏢 **Multiple supplier companies**## 🚀 Tecnologias Utilizadas

- ⏰ **Staff check-in/check-out control**

- **Frontend**: React 18 + TypeScript

The project ran **locally** via Docker on an internal network during the event, ensuring stability and performance even without internet connection.- **Build Tool**: Vite 5

- **Runtime**: Bun (JavaScript runtime)

### 🚀 Technologies Used- **Styling**: TailwindCSS + Radix UI

- **State Management**: Zustand

- **Frontend**: React 18 + TypeScript- **Data Fetching**: TanStack Query (React Query)

- **Build Tool**: Vite 5- **Routing**: TanStack Router

- **Runtime**: Bun (JavaScript runtime)- **Forms**: React Hook Form + Zod

- **Styling**: TailwindCSS + Radix UI- **Testing**: Cypress (E2E)

- **State Management**: Zustand- **Code Quality**: Biome (Linting & Formatting)

- **Data Fetching**: TanStack Query (React Query)

- **Routing**: TanStack Router## 🏗️ Arquitetura do Sistema

- **Forms**: React Hook Form + Zod

- **Testing**: Cypress (E2E)### Frontend (este repositório)

- **Code Quality**: Biome (Linting & Formatting)

- Interface web responsiva para gestão

### 🏗️ System Architecture- Dashboard administrativo

- Controle de funcionários por empresa

#### Frontend (this repository)- Gestão de eventos e cronogramas

- Responsive web interface for management- Sistema de relatórios

- Administrative dashboard

- Staff control by company### Backend (não incluído)

- Event and schedule management

- Reporting system- API REST desenvolvida separadamente

- Controle de autenticação e autorização

#### Backend (not included)- Gestão de dados em tempo real

- REST API developed separately- Sistema de logs e auditoria

- Authentication and authorization control

- Real-time data management### Infraestrutura

- Logging and audit system

- **Docker** para containerização

#### Infrastructure- **Nginx** para proxy reverso

- **Docker** for containerization- **Rede local** para operação offline

- **Nginx** for reverse proxy- **SSL/TLS** para segurança

- **Local network** for offline operation

- **SSL/TLS** for security## 📦 Funcionalidades Principais

### 📦 Main Features### 👨‍💼 Gestão de Administradores

#### 👨‍💼 Administrator Management- Cadastro de usuários administrativos

- Administrative user registration- Controle de permissões (Admin/User)

- Permission control (Admin/User)- Histórico de ações

- Action history

### 🏢 Gestão de Fornecedores

#### 🏢 Supplier Management

- Supplier company registration- Cadastro de empresas fornecedoras

- CNPJ validation- Validação de CNPJ

- Staff control per company- Controle de funcionários por empresa

#### 👷 Staff Management### 👷 Gestão de Funcionários

- Complete registration with personal data

- Photo upload- Cadastro completo com dados pessoais

- Worker status (Active/Expelled/Banned)- Upload de fotos

- Company linking- Status de trabalhador (Ativo/Expulso/Banido)

- QR Code generation for identification- Vinculação a empresas

- Geração de QR Codes para identificação

#### 🎭 Event Management

- Multi-day event creation### 🎭 Gestão de Eventos

- Daily schedules

- Staff allocation per event- Criação de eventos multi-dias

- Replacement system- Cronogramas por dia

- Time control- Alocação de funcionários por evento

- Sistema de substituições

#### 📊 Reports and Analytics- Controle de horários

- Attendance reports

- Statistics by company### 📊 Relatórios e Analytics

- Working hours control

- Data export- Relatórios de presença

- Estatísticas por empresa

### 🛠️ How to Run the Project- Controle de horas trabalhadas

- Exportação de dados

#### Prerequisites

## 🛠️ Como Executar o Projeto

1. **Bun** (recommended) or **Node.js 18+**

2. **Git**### Pré-requisitos

#### 📥 Bun Installation1. **Bun** (recomendado) ou **Node.js 18+**

2. **Git**

**Windows (PowerShell):**

````powershell### 📥 Instalação do Bun

powershell -c "irm bun.sh/install.ps1 | iex"

```**Windows (PowerShell):**



**macOS/Linux:**```powershell

```bashpowershell -c "irm bun.sh/install.ps1 | iex"

curl -fsSL https://bun.sh/install | bash```

````

**macOS/Linux:**

#### 🚀 Running the Project

````bash

1. **Clone the repository:**curl -fsSL https://bun.sh/install | bash

```bash```

git clone https://github.com/juliocsilvestre/arke-process.git

cd arke-process### 🚀 Executando o Projeto

````

1. **Clone o repositório:**

2. **Install dependencies:**

`bash`bash

bun installgit clone https://github.com/juliocsilvestre/arke-process.git

```cd arke-process

```

3. **Run in development mode:**

```````bash2. **Instale as dependências:**

bun run dev

``````bash

bun install

4. **Access the application:**```

```````

http://localhost:30013. **Execute em modo de desenvolvimento:**

````

```bash

#### 🔐 Demo Loginbun run dev

````

For demonstration purposes, the system accepts **any credentials**:

- **CPF**: Enter any value (e.g., "123.456.789-01" or "demo")4. **Acesse a aplicação:**

- **Password**: Enter any value (e.g., "123" or "password")

```

> **Note**: In the production version, the system uses real authentication via API.http://localhost:3001

```

### 📝 Available Scripts

### 🔐 Login de Demonstração

````bash

# DevelopmentPara fins de demonstração, o sistema aceita **qualquer credencial**:

bun run dev              # Start development server

- **CPF**: Digite qualquer valor (ex: "123.456.789-01" ou "demo")

# Build- **Senha**: Digite qualquer valor (ex: "123" ou "password")

bun run build           # Generate production build

bun run preview         # Preview production build> **Nota**: Na versão de produção, o sistema utiliza autenticação real via API.



# Code Quality## 📝 Scripts Disponíveis

bun run check           # Check code with Biome

bun run lint            # Run linting with fixes```bash

# Desenvolvimento

# Testsbun run dev              # Inicia servidor de desenvolvimento

bun run test:e2e        # Run E2E tests (Cypress)

bun run test:e2e:ci     # Run E2E tests in CI mode# Build

```bun run build           # Gera build de produção

bun run preview         # Preview do build de produção

### 🏆 Results Achieved

# Qualidade de Código

- ✅ **2,000+ staff members** managed successfullybun run check           # Verifica código com Biome

- ✅ **4 days** of operation without interruptionsbun run lint            # Executa linting com correções

- ✅ **Zero downtime** during the event

- ✅ **100% uptime** of the application# Testes

- ✅ **80% reduction** in check-in/check-out timebun run test:e2e        # Executa testes E2E (Cypress)

- ✅ **Real-time control** of all operationsbun run test:e2e:ci     # Executa testes E2E em modo CI

````

---

## 🐳 Docker

## Português

O projeto inclui configuração Docker para execução em containers:

### 📋 Sobre o Projeto

````bash

Sistema de gestão e controle de funcionários para eventos desenvolvido para a empresa **Carvalheira - Criando Memórias**.# Build da imagem

docker build -t carvalheira-web .

Este sistema foi desenvolvido em **1 mês e meio** para gerenciar um evento de grande porte com:

- 👥 **2.000 pessoas por dia**# Executar container

- 📅 **4 dias de duração**docker run -p 3001:80 carvalheira-web

- 🏢 **Múltiplas empresas fornecedoras**```

- ⏰ **Controle de entrada e saída de funcionários**

## 📁 Estrutura do Projeto

O projeto foi executado **localmente** através de Docker em rede interna durante o evento, garantindo estabilidade e performance mesmo sem conexão com internet.

````

### 🚀 Tecnologias Utilizadassrc/

├── api/ # Configuração de API e queries

- **Frontend**: React 18 + TypeScript│ ├── mutations/ # Mutations do TanStack Query

- **Build Tool**: Vite 5│ ├── queries/ # Queries do TanStack Query

- **Runtime**: Bun (JavaScript runtime)│ └── api.ts # Configuração do Axios

- **Styling**: TailwindCSS + Radix UI├── components/ # Componentes reutilizáveis

- **State Management**: Zustand│ └── ui/ # Componentes base (Design System)

- **Data Fetching**: TanStack Query (React Query)├── hooks/ # Custom hooks

- **Routing**: TanStack Router├── layouts/ # Layouts de página

- **Forms**: React Hook Form + Zod├── pages/ # Páginas da aplicação

- **Testing**: Cypress (E2E)├── store/ # Estado global (Zustand)

- **Code Quality**: Biome (Linting & Formatting)├── styles/ # Arquivos de estilo

└── utils/ # Utilitários e helpers

### 🏗️ Arquitetura do Sistema```

#### Frontend (este repositório)## 🎯 Principais Desafios Superados

- Interface web responsiva para gestão

- Dashboard administrativo### 1. **Performance em Larga Escala**

- Controle de funcionários por empresa

- Gestão de eventos e cronogramas- Otimização para 2.000+ usuários simultâneos

- Sistema de relatórios- Lazy loading e code splitting

- Paginação eficiente de dados

#### Backend (não incluído)

- API REST desenvolvida separadamente### 2. **Operação Offline**

- Controle de autenticação e autorização

- Gestão de dados em tempo real- Sistema funcionando sem internet

- Sistema de logs e auditoria- Sincronização de dados local

- Backup automático de informações

#### Infraestrutura

- **Docker** para containerização### 3. **Prazo Apertado**

- **Nginx** para proxy reverso

- **Rede local** para operação offline- Desenvolvimento em 1,5 mês

- **SSL/TLS** para segurança- Metodologia ágil

- Priorização de features críticas

### 📦 Funcionalidades Principais

### 4. **Confiabilidade**

#### 👨‍💼 Gestão de Administradores

- Cadastro de usuários administrativos- Sistema crítico para operação do evento

- Controle de permissões (Admin/User)- Tratamento robusto de erros

- Histórico de ações- Logs detalhados para debugging

#### 🏢 Gestão de Fornecedores## 🏆 Resultados Alcançados

- Cadastro de empresas fornecedoras

- Validação de CNPJ- ✅ **2.000+ funcionários** gerenciados com sucesso

- Controle de funcionários por empresa- ✅ **4 dias** de operação sem interrupções

- ✅ **Zero downtime** durante o evento

#### 👷 Gestão de Funcionários- ✅ **100% uptime** da aplicação

- Cadastro completo com dados pessoais- ✅ **Redução de 80%** no tempo de check-in/check-out

- Upload de fotos- ✅ **Controle em tempo real** de todas as operações

- Status de trabalhador (Ativo/Expulso/Banido)

- Vinculação a empresas## 🤝 Contribuição

- Geração de QR Codes para identificação

Este projeto foi desenvolvido para um caso de uso específico, mas contribuições são bem-vindas:

#### 🎭 Gestão de Eventos

- Criação de eventos multi-dias1. Fork o projeto

- Cronogramas por dia2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)

- Alocação de funcionários por evento3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)

- Sistema de substituições4. Push para a branch (`git push origin feature/nova-feature`)

- Controle de horários5. Abra um Pull Request

#### 📊 Relatórios e Analytics## 📄 Licença

- Relatórios de presença

- Estatísticas por empresaEste projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

- Controle de horas trabalhadas

- Exportação de dados## 👨‍💻 Desenvolvedor

### 🛠️ Como Executar o Projeto**Júlio César Silvestre**

#### Pré-requisitos- GitHub: [@juliocsilvestre](https://github.com/juliocsilvestre)

- Email: jcss.silvestre@gmail.com

1. **Bun** (recomendado) ou **Node.js 18+**

2. **Git**---

#### 📥 Instalação do Bun<div align="center">

<strong>Desenvolvido com ❤️ para eventos inesquecíveis</strong>

**Windows (PowerShell):**</div>

```powershell
powershell -c "irm bun.sh/install.ps1 | iex"
```

**macOS/Linux:**

```bash
curl -fsSL https://bun.sh/install | bash
```

#### 🚀 Executando o Projeto

1. **Clone o repositório:**

```bash
git clone https://github.com/juliocsilvestre/arke-process.git
cd arke-process
```

2. **Instale as dependências:**

```bash
bun install
```

3. **Execute em modo de desenvolvimento:**

```bash
bun run dev
```

4. **Acesse a aplicação:**

```
http://localhost:3001
```

#### 🔐 Login de Demonstração

Para fins de demonstração, o sistema aceita **qualquer credencial**:

- **CPF**: Digite qualquer valor (ex: "123.456.789-01" ou "demo")
- **Senha**: Digite qualquer valor (ex: "123" ou "password")

> **Nota**: Na versão de produção, o sistema utiliza autenticação real via API.

### 📝 Scripts Disponíveis

```bash
# Desenvolvimento
bun run dev              # Inicia servidor de desenvolvimento

# Build
bun run build           # Gera build de produção
bun run preview         # Preview do build de produção

# Qualidade de Código
bun run check           # Verifica código com Biome
bun run lint            # Executa linting com correções

# Testes
bun run test:e2e        # Executa testes E2E (Cypress)
bun run test:e2e:ci     # Executa testes E2E em modo CI
```

### 🏆 Resultados Alcançados

- ✅ **2.000+ funcionários** gerenciados com sucesso
- ✅ **4 dias** de operação sem interrupções
- ✅ **Zero downtime** durante o evento
- ✅ **100% uptime** da aplicação
- ✅ **Redução de 80%** no tempo de check-in/check-out
- ✅ **Controle em tempo real** de todas as operações

---

## 🐳 Docker

The project includes Docker configuration for container execution:

```bash
# Build image
docker build -t carvalheira-web .

# Run container
docker run -p 3001:80 carvalheira-web
```

## 📁 Project Structure

```
src/
├── api/                    # API configuration and queries
│   ├── mutations/         # TanStack Query mutations
│   ├── queries/           # TanStack Query queries
│   └── api.ts            # Axios configuration
├── components/            # Reusable components
│   └── ui/               # Base components (Design System)
├── hooks/                # Custom hooks
├── layouts/              # Page layouts
├── pages/                # Application pages
├── store/                # Global state (Zustand)
├── styles/               # Style files
└── utils/                # Utilities and helpers
```

## 🎯 Main Challenges Overcome

### 1. **Large Scale Performance**

- Optimization for 2,000+ simultaneous users
- Lazy loading and code splitting
- Efficient data pagination

### 2. **Offline Operation**

- System working without internet
- Local data synchronization
- Automatic information backup

### 3. **Tight Deadline**

- Development in 1.5 months
- Agile methodology
- Critical feature prioritization

### 4. **Reliability**

- Critical system for event operation
- Robust error handling
- Detailed logs for debugging

## 🤝 Contributing

This project was developed for a specific use case, but contributions are welcome:

1. Fork the project
2. Create a branch for your feature (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## 📄 License

This project is under the MIT license. See the [LICENSE](LICENSE) file for more details.

## 👨‍💻 Developer

**Júlio César Silvestre**

- GitHub: [@juliocsilvestre](https://github.com/juliocsilvestre)
- Email: jcss.silvestre@gmail.com

---

<div align="center">
  <strong>Developed by init1 for unforgettable events</strong><br>
  <strong>Desenvolvido por init1 para eventos inesquecíveis</strong>
</div>
