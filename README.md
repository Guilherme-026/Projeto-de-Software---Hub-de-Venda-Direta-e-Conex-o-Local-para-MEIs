# 🍲 Hub de Venda Direta e Conexão Local para MEIs

[![Python](https://img.shields.io/badge/Python-3.12%2B-blue?logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115%2B-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Pydantic v2](https://img.shields.io/badge/Pydantic-v2.8%2B-e92063?logo=pydantic&logoColor=white)](https://docs.pydantic.dev/)
[![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-2.0%2B-red?logo=sqlalchemy&logoColor=white)](https://www.sqlalchemy.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb?logo=react&logoColor=black)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-Mobile--First-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![CI / GitHub Actions](https://img.shields.io/badge/CI-GitHub_Actions-2088FF?logo=githubactions&logoColor=white)](https://github.com/features/actions)
[![ODS 8 & 10](https://img.shields.io/badge/ONU-ODS_8_%7C_ODS_10-4C9F38?logo=unitednations&logoColor=white)](https://brasil.un.org/pt-br/sdgs)

> **Piloto Comunitário:** Marmitaria Sabor da Vila  
> **Alinhamento ODS:** **ODS 8** (Trabalho Decente e Crescimento Econômico — Meta 8.3) e **ODS 10** (Redução das Desigualdades — Meta 10.2)  
> **Disciplina:** Projeto de Software / Experiência Prática III  

Plataforma web responsiva (*Mobile-First*) desenvolvida para devolver autonomia financeira e previsibilidade logística a microempreendedores individuais (MEIs) de bairro do setor de alimentação e motoboys autônomos locais.

---

## 🎯 Problema e Proposta de Valor

Pequenos negócios alimentícios enfrentam dois gargalos críticos, especialmente no horário de pico (11h às 13h):

1. **Asfixia Financeira:** Plataformas de intermediação tradicionais cobram comissões predatórias de até **26,5%** e retêm o repasse do capital de giro por até 30 dias.
2. **Vulnerabilidade Logística e Caos Operacional:** Pedidos desorganizados em conversas de WhatsApp e alto risco de faltas de última hora (*no-show*) de entregadores, comprometendo a operação diária.

### Como o MVP Resolve:

- **Cardápio Relâmpago com Pix Direto (`RF01`):** Link web público e direto. O cliente final escolhe os pratos sem necessidade de cadastro burocrático ou download de app, visualizando a chave Pix oficial do estabelecimento para liquidação imediata na conta do comerciante (taxa 0%).
- **Painel Operacional da Cozinha (`RF02`):** Gestão visual simplificada da esteira de pedidos (`aguardando_pix` ➔ `em_preparo` ➔ `saiu_entrega` ➔ `concluido`) desenhada para agilidade operacional sob forte pressão de tempo.
- **Botão SOS Geolocalizado (`RF03`):** Em caso de falta ou pico inesperado, o estabelecimento aciona um chamado emergencial de diária que notifica motoboys autônomos disponíveis e cadastrados no próprio bairro em ondas de proximidade (3 km e 5 km), com garantia de aceite único (*race condition safe*).
- **Trava Mútua por PIN e Regra 50/50 (`RF04`):** O sistema gera um PIN de 4 dígitos para confirmação presencial entre o comerciante e o entregador na chegada ao balcão. A validação destrava a primeira metade (50%) da diária e ativa o contador de entregas, com a segunda metade liquidada no encerramento do turno. Faltas injustificadas aplicam *strikes* automáticos com bloqueio preventivo temporário.

---

## 🏗️ Arquitetura e Tecnologias

O projeto adota uma arquitetura **Cliente-Servidor em Camadas**, prezando pela alta coesão, baixo acoplamento e separação estrita de responsabilidades:

```
[ Front-end Mobile-First ] 
       │  (JSON / REST API + JWT)
       ▼
┌───────────────────────────────────────────────┐
│               API REST (FastAPI)              │
│  ├── Routers (Entrada HTTP e Schemas Pydantic)│
│  ├── Security (Argon2id, JWT, RBAC / IDOR)    │
│  ├── Services (Regras de Negócio e Transações)│
│  └── Models (Mapeamento ORM SQLAlchemy 2.0)   │
└──────────────────────┬────────────────────────┘
                       │
        ┌──────────────┴──────────────┐
        ▼                             ▼
[ SQLite 3 ] (Dev/Testes CI)   [ PostgreSQL 16 ] (Supabase Produção)
```

- **Back-end:** Python 3.12+, FastAPI 0.115+, Pydantic v2 (validação estrita e tipada).
- **ORM e Persistência:** SQLAlchemy 2.0 (consultas parametrizadas anti-SQLi e integridade relacional).
- **Front-end:** Aplicação Web Responsiva (*Mobile-First*, viewport padrão 420px adaptável para desktop) construída em React 19 / TypeScript com Tailwind CSS e ícones acessíveis (Lucide React).
- **Segurança da Informação (`RNF01` / `RNF02`):**
  - Criptografia de senhas com algoritmo de derivação seguro (**Argon2id/bcrypt**).
  - Autenticação stateless via **Bearer Tokens JWT** com expiração controlada.
  - Prevenção rigorosa a IDOR (*Insecure Direct Object References*) validando a titularidade dos recursos do estabelecimento.
  - Sanitização de entradas contra Cross-Site Scripting (XSS).
  - Princípio da Minimização de Dados (LGPD): ausência de coleta de CPF ou dados financeiros de consumidores finais.
- **Acessibilidade Web (`RNF04`):**
  - Conformidade com critérios WCAG AA (taxa de contraste mínima de 4,5:1).
  - Alvos de toque táteis mínimos de 48x48 px para telas móveis.
  - Feedback multimodal em estados operacionais (combinação de ícone, texto e cor, sem depender apenas de cores).
- **Qualidade de Software e CI:**
  - Testes automatizados unitários e de integração com **Pytest**.
  - Pipeline de Integração Contínua automatizado via **GitHub Actions** a cada *Push* e *Pull Request*.

---

## 📁 Estrutura do Repositório

```text
├── .github/
│   └── workflows/
│       └── ci.yml              # Pipeline de Integração Contínua (GitHub Actions)
├── app/
│   ├── main.py                 # Ponto de entrada FastAPI, CORS e Middlewares de Segurança
│   ├── config.py               # Configurações tipadas via Pydantic Settings (.env)
│   ├── database.py             # Conexão de banco e Injeção de Dependência (get_db)
│   ├── models.py               # Entidades ORM: Estabelecimento, Pedido, Entregador, Turno
│   ├── schemas.py              # Contratos de Entrada/Saída e validações Pydantic v2
│   ├── security.py             # Hash seguro de senhas, criação e decodificação de JWT
│   └── routers/                # Controladores REST desacoplados (auth, pedidos, turnos)
├── src/                        # Componentes e Telas do Front-end Mobile-First
│   ├── App.tsx                 # Interface unificada (Cardápio, Cozinha e Painel Entregador)
│   ├── main.tsx                # Ponto de montagem React
│   └── index.css               # Estilização utilitária Tailwind CSS
├── tests/                      # Bateria de testes automatizados com Pytest
│   └── test_models.py          # Testes unitários das entidades e regras relacionais
├── AGENTS.md                   # Diretrizes técnicas, papéis e critérios do projeto
├── .env.example                # Modelo oficial de variáveis de ambiente
├── requirements.txt            # Dependências Python oficiais
├── package.json                # Dependências Node.js / Vite / Tailwind
└── README.md                   # Documentação arquitetural e guia de execução
```

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
- **Python 3.12+** instalado
- **Node.js 18+** e npm/pnpm instalado
- **Git** configurado

### 1. Clonar o Repositório e Acessar a Pasta
```bash
git clone https://github.com/Guilherme-026/Projeto-de-Software---Hub-de-Venda-Direta-e-Conex-o-Local-para-MEIs.git
cd Projeto-de-Software---Hub-de-Venda-Direta-e-Conex-o-Local-para-MEIs
```

### 2. Configurar o Back-end (Python & FastAPI)
```bash
# Criar ambiente virtual
python -m venv .venv

# Ativar o ambiente virtual:
# Windows (PowerShell):
.\.venv\Scripts\Activate.ps1
# Linux / macOS:
source .venv/bin/activate

# Instalar dependências
pip install -r requirements.txt

# Configurar variáveis de ambiente
cp .env.example .env

# Executar os testes automatizados
pytest tests/
```

### 3. Configurar e Executar o Front-end (React & Vite)
```bash
# Instalar dependências do front-end
npm install

# Iniciar o servidor de desenvolvimento
npm run dev
```
Acesse o aplicativo no navegador em: `http://localhost:3000`

---

## 🧪 Estratégia de Testes

Os testes automatizados foram construídos com **Pytest** utilizando fixtures isoladas com SQLite em memória (`sqlite:///:memory:`):
- **Testes Unitários:** Validação das entidades de domínio, integridade referencial de chaves estrangeiras, restrições numéricas de valores positivos e métodos de bloqueio por strikes.
- **Testes de Integração:** Simulação de requisições HTTP aos endpoints da API utilizando `TestClient` do FastAPI, validando autenticação, restrições de permissão por proprietário e regras do botão SOS.

Para rodar toda a suíte de testes com cobertura:
```bash
pytest -v --tb=short
```

---

## 👥 Equipe e Contexto Acadêmico

Projeto concebido e desenvolvido no âmbito do componente curricular **Projeto de Software / Experiência Prática III**, focado no desenvolvimento de soluções computacionais de impacto social positivo, inclusão produtiva e tecnologia aberta para pequenos empreendedores comunitários.
