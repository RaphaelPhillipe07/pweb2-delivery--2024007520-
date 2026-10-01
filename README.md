# Delivery Tracker API — Cap. 4

API em camadas para rastreamento do ciclo de vida de encomendas, desenvolvida para a disciplina de **Programação Web II — IFAL Maceió**.

## Como Executar

### 1. Instalar as dependências

```bash
npm install
```

### 2. Iniciar o servidor

```bash
npm start
```

A aplicação será executada, por padrão, em:

```text
http://localhost:3000
```

### 3. Executar o Autograder

Com o servidor em execução, utilize:

```bash
BASE_URL=http://localhost:3000 node autograder/check.mjs
```

---

## Exemplos de Requisições

As requisições abaixo utilizam **cURL**.

### Health Check

Verifica se a API está disponível:

```bash
curl -X GET http://localhost:3000/api/health
```

### Criar Entrega

Cria uma nova entrega informando descrição, origem e destino:

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

Lista todas as entregas:

```bash
curl -X GET http://localhost:3000/api/entregas
```

Também é possível filtrar as entregas por status:

```bash
curl -X GET "http://localhost:3000/api/entregas?status=CRIADA"
```

### Buscar Entrega por ID

Consulta uma entrega específica pelo seu ID:

```bash
curl -X GET http://localhost:3000/api/entregas/1
```

### Avançar Status da Entrega

Avança a entrega para o próximo status do ciclo de vida:

```bash
curl -X PATCH http://localhost:3000/api/entregas/1/avancar
```

### Cancelar Entrega

Cancela uma entrega:

```bash
curl -X PATCH http://localhost:3000/api/entregas/1/cancelar
```

### Consultar Histórico de Eventos

Consulta o histórico de eventos de uma entrega:

```bash
curl -X GET http://localhost:3000/api/entregas/1/historico
```

### Criar Motorista

Cria um novo motorista informando nome e CPF:

```bash
curl -X POST http://localhost:3000/api/motoristas \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João",
    "cpf": "123.456.789-00"
  }'
```

### Listar Motoristas

Lista todos os motoristas cadastrados:

```bash
curl -X GET http://localhost:3000/api/motoristas
```

### Buscar Motorista por ID

Consulta um motorista específico pelo seu ID:

```bash
curl -X GET http://localhost:3000/api/motoristas/1
```

### Listar Entregas de um Motorista

Lista apenas as entregas atribuídas a um motorista:

```bash
curl -X GET http://localhost:3000/api/motoristas/1/entregas
```

Também é possível combinar com o filtro por status:

```bash
curl -X GET "http://localhost:3000/api/motoristas/1/entregas?status=CRIADA"
```

### Atribuir Motorista a Entrega

Atribui um motorista a uma entrega com status `CRIADA`:

```bash
curl -X PATCH http://localhost:3000/api/entregas/1/atribuir \
  -H "Content-Type: application/json" \
  -d '{ "motoristaId": 1 }'
```

---

## Contratos de Repository

```text
IEntregasRepository
  listarTodos(filtros?) → Entrega[]
  buscarPorId(id)       → Entrega | null
  criar(dados)          → Entrega
  atualizar(id, dados)  → Entrega

IMotoristasRepository
  listarTodos()         → Motorista[]
  buscarPorId(id)       → Motorista | null
  buscarPorCpf(cpf)     → Motorista | null
  criar(dados)          → Motorista
```

---

## Composição de Dependências

A injeção de dependências acontece em um único ponto (`src/routes/index.js`):

```text
server.js
  └── app (express)
        ├── GET /api/health
        └── /api → criarRotas()                      ← composition root (src/routes/index.js)
              ├── new Database()
              ├── new EntregasRepository(database)
              ├── new MotoristasRepository(database)
              ├── new EntregasService(entregasRepository, motoristasRepository)
              ├── new MotoristasService(motoristasRepository, entregasRepository)
              ├── new EntregasController(entregasService)      → /api/entregas
              └── new MotoristasController(motoristasService)  → /api/motoristas
```
