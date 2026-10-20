# Delivery Tracker API — Atividade 07 (Prisma + SQLite)

API em camadas para rastreamento do ciclo de vida de encomendas, desenvolvida para a disciplina de **Programação Web II — IFAL Maceió**.

Persistência real com **Prisma ORM** sobre **SQLite**: entregas e motoristas agora sobrevivem a reinícios do servidor, sem mudar o contrato da API.

## Como Executar

### 1. Instalar as dependências

```bash
npm install
```

### 2. Configurar o banco

```bash
cp .env.example .env
```

O `.env` define a conexão (SQLite):

```text
DATABASE_URL="file:./dev.db"
```

### 3. Aplicar as migrations

```bash
npx prisma migrate dev
```

Isso cria o banco `prisma/dev.db` e aplica as migrations versionadas de `prisma/migrations/`.
Em um ambiente já migrado (como o CI), use `npx prisma migrate deploy`.

### 4. Iniciar o servidor

```bash
npm start
```

A aplicação será executada, por padrão, em:

```text
http://localhost:3000
```

O servidor respeita `process.env.PORT`.

### 5. Executar o Autograder

Com o servidor em execução:

```bash
BASE_URL=http://localhost:3000 node autograder/check.mjs
```

### Inspecionar os dados

```bash
npx prisma studio
```

---

## Exemplos de Requisições

As requisições abaixo utilizam **cURL**.

### Health Check

```bash
curl -X GET http://localhost:3000/api/health
```

### Criar Entrega

```bash
curl -X POST http://localhost:3000/api/entregas \
  -H "Content-Type: application/json" \
  -d '{
    "descricao": "Televisao",
    "origem": "Maceió",
    "destino": "Arapiraca"
  }'
```

### Listar Entregas

```bash
curl -X GET http://localhost:3000/api/entregas
```

Também é possível filtrar por status:

```bash
curl -X GET "http://localhost:3000/api/entregas?status=CRIADA"
```

### Buscar Entrega por ID

```bash
curl -X GET http://localhost:3000/api/entregas/1
```

### Avançar Status da Entrega

```bash
curl -X PATCH http://localhost:3000/api/entregas/1/avancar
```

### Cancelar Entrega

```bash
curl -X PATCH http://localhost:3000/api/entregas/1/cancelar
```

### Consultar Histórico de Eventos

```bash
curl -X GET http://localhost:3000/api/entregas/1/historico
```

### Criar Motorista

```bash
curl -X POST http://localhost:3000/api/motoristas \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João",
    "cpf": "123.456.789-00"
  }'
```

### Listar Motoristas

```bash
curl -X GET http://localhost:3000/api/motoristas
```

### Buscar Motorista por ID

```bash
curl -X GET http://localhost:3000/api/motoristas/1
```

### Listar Entregas de um Motorista

```bash
curl -X GET http://localhost:3000/api/motoristas/1/entregas
```

Também é possível combinar com o filtro por status:

```bash
curl -X GET "http://localhost:3000/api/motoristas/1/entregas?status=CRIADA"
```

### Atribuir Motorista a Entrega

```bash
curl -X PATCH http://localhost:3000/api/entregas/1/atribuir \
  -H "Content-Type: application/json" \
  -d '{ "motoristaId": 1 }'
```

---

```
