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
