/*
Importações e Configuração Inicialjsimport express from "express";

import cors from "cors";

import pool from "./database.js";

express — framework HTTP para criar o servidor e definir rotas

cors — middleware que permite requisições de origens diferentes (ex: frontend em localhost:3000 acessando backend em localhost:5600)

pool — conexão com o banco de dados, importada de um arquivo local database.js. Um pool gerencia múltiplas conexões simultâneas de forma eficiente
*/

/*
jsconst app = express();

app.use(cors());

app.use(express.json());

Cria a instância do servidor e aplica dois middlewares globais: CORS e parsing de JSON no corpo das requisições.
*/

/*
Rotas

GET /clientes — Listar todos os clientes

jsapp.get("/clientes", async (req, res) => {
  const [rows] = await pool.execute("SELECT * FROM clientes;");
  if (rows.length === 0) {
    return res.json({ message: "Nenhum usuário encontrado!" });
  }
  return res.json(rows);
});

Busca todos os registros da tabela clientes no banco. 
Se não houver nenhum, retorna uma mensagem; caso contrário, retorna o array de clientes em JSON.
*/

/*
GET /:id — Duas rotas duplicadas com bug
js

Rota 1 — só faz console.log do id, não responde nada ao cliente

app.get("/:id", (req, res) => {
  const { id } = req.params;
  return console.log(id); // ⚠️ Não envia resposta HTTP
});

Rota 2 — nunca será executada, pois a rota acima a intercepta primeiro

app.get("/:id", (req, res) => {
  const { id } = req.params;
  const getUserById = users.find((user) => user.id == id);
  return console.log(getUserById); // ⚠️ "users" não existe mais (era o array em memória comentado)
});

Há dois problemas aqui: rotas duplicadas (o Express usa sempre a primeira) e referência à variável users que foi comentada/removida.
*/

/*
POST /clientes — Inserir cliente (com bugs)
jsapp.post("/clientes", async (req, res) => {
  const data = req.body;

  // ✅ Primeira inserção — usa data.nome, data.email etc. (correto)
  
  const [row] = await pool.execute(
    "INSERT INTO clientes (nome, email, telefone, cidade, estado) VALUES (?, ?, ?, ?, ?);",
    [data.nome, data.email, data.telefone, data.cidade, data.estado]
  );

  // ⚠️ Validação incompleta — verifica campos mas não faz nada dentro do if
  
  if (nome === "" || !email) {
    // bloco vazio
  }

  ❌ Segunda inserção com erro — usa variáveis soltas (nome, email...) que não existem
  além de redeclarar "row" com const, o que causa erro de execução
  
  const [row] = await pool.execute(
    "INSERT INTO clientes ...",
    [nome, email, telefone, cidade, estado] // ReferenceError: nome is not defined
  );
});

Os ? na query são prepared statements — uma proteção contra SQL Injection, onde os valores são passados separadamente da query.
*/

/*
Inicialização do Servidor

jsapp.listen(5600, () => {
  console.log("Servidor rodando na porta 5600");
});

Coloca o servidor para escutar na porta 5600.

Resumo dos Problemas no Código

Inicialização do Servidor

jsapp.listen(5600, () => {
  console.log("Servidor rodando na porta 5600");
});

Coloca o servidor para escutar na porta 5600.
*/

/*
Resumo dos Problemas no Código

Problema - Onde - Impacto 

Duas rotas GET /:id idênticas - Rotas GET - Segunda nunca executa

Referência a users removido - Segunda rota GET - ReferenceError

const [row] declarado duas vezes - POST /clientes - SyntaxError

Variáveis nome, email... soltas - POST /clientes - ReferenceError

if de validação vazioPOST /clientesValidação não funciona

Rota GET /:id não responde HTTP - Primeira rota GET - Cliente fica sem resposta
*/

/* O express é um framework para criar servidor e definir rotas. */
import express from "express";
import cors from "cors";
import pool from "./database.js";

/* Cria a instância do express. */
const app = express();

/* Dizendo para o express que vamos utilizar o formato JSON no corpo das requisições. */
app.use(express.json());
app.use(cors());

/* Banco de dados em memória. */
/*
  const users = 
    [
      {
        id: 1,
        name: "Daniel",
        email: "daniel@gmail.com",
      },
      {
        id: 2,
        name: "Eric Gregorio",
        email: "ericgregorio@gmail.com",
      },
    ];
 */

/* 
- Cria uma rota GET para o caminho raiz (/).
- Request: req - Requisição.
- Response: res - Resposta. 
*/
app.get("/clientes", async (req, res) => {
  const [rows] = await pool.execute
  (
    "SELECT * FROM clientes;"
  );

  if (rows.length === 0) 
  {
    return res.json
    (
      {
        message: "Nenhum usuário encontrado!",
      }
    );
  }
  return res.json(rows);
});

app.get("/:id", (req, res) => {
  const { id } = req.params;
  return console.log(id);
});

app.get("/:id", (req, res) => {
  const { id } = req.params;

  const getUserById = users.find((user) => user.id == id);
  return console.log(getUserById);
});

app.post("/clientes", async (req, res) => {
  const 
  { nome, email, telefone, cidade, estado } = req.body;

  /* 
  const data = req.body;

   const data = req.body;
   || => or - ou
   */

  // const [row] = await pool.execute(
  //   "INSERT INTO clientes (nome, email, telefone, cidade, estado) VALUES (?, ?, ?, ?, ?);",
  //   [data.nome, data.email, data.telefone, data.cidade, data.estado]
  // );

  console.log(row);

  if (nome === "" || !email || !telefone || !cidade || !estado) {
    return res.json
      (
        { 
          message: "Todos os campos são obrigatórios!!!" 
        }
      );
  }

  const [[verifyEmail]] = await pool.execute(
    "SELECT email FROM clientes WHERE email = ?",
    [email]
  );

  if (verifyEmail?.email === email) {
    return res.json
    (
      {
        message: "Email já cadastrado!",
      }
    );
  }

  const [row] = await pool.execute(
    "INSERT INTO clientes (nome, email, telefone, cidade, estado) VALUES (?, ?, ?, ?, ?);",
    [nome, email, telefone, cidade, estado]
  );

  if (row.affectedRows === 0) 
  {
    return res.json
    (
      {
        message: "Não foi possivel realizar o cadastro!",
      }
    );
  }

  /* 
  const [row] = await pool.execute(
    "INSERT INTO clientes (nome, email, telefone, cidade, estado) VALUES (?, ?, ?, ?, ?);",
    [data.nome, data.email, data.telefone, data.cidade, data.estado]
  ) 
  */

  return res.json
  (
    {
      message: "Cadastro realizado com sucesso!",
    }
  );
});

/* Metodo PUT atualiza dados na rota */
app.put("/clientes/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { nome, email, telefone, cidade, estado } = req.body;

  if (nome === "" || !email || !telefone || !cidade || !estado) 
  {
    return res.json
    (
      {
        message: "Todos os campos são obrigatórios!!!",
      }
    );
  }

  const [[verifyEmail]] = await pool.execute(
    "SELECT email FROM clientes WHERE email = ?",
    [email]
  );

  if (verifyEmail?.email === email) {
    return res.json
    (
      {
        message: "Email já cadastrado com outro cliente!",
      }
    );
  }

  const [getCliente] = await pool.execute(
    "SELECT * FROM clientes WHERE id_cliente = ?",
    [id]
  );

  if (getCliente.length === 0) {
    return res.json
    (
      {
        message: "Cliente não encontrado!!",
      }
    );
  }

  const [row] = await pool.execute(
    `
      UPDATE clientes SET
        nome = ?,
        email = ?, 
        telefone = ?,
        cidade = ?,
        estado = ?
      WHERE id_cliente = ? 
    `,
    [nome, email, telefone, cidade, estado, id]
  );

  console.log(row); 

  return res.json
  (
    {
      message: "Cliente atualizado com sucesso!"
    }
  );

  return res.json(getCliente);
});

app.delete
  (
    "/clientes/:id", 
      async (req, res) => {
        const id = Number(req.params.id);
        const [row] = await pool.execute(
          "DELETE FROM clientes WHERE id_cliente = ?",
          [id],
        )
        return res.json
          (
            {
              message: "Dados do cliente deletado com sucesso!"
            }
          ); 
    }
  );

  /* Inicia o servidor na porta 5600. */
app.listen
  (
  5600, () => {
    console.log
      (
        "Servidor rodando na porta 5600"
      );
    }
  );
