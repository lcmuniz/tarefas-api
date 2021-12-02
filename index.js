const express = require("express");
const cors = require("cors");
const pg = require("pg");

const Pool = pg.Pool;

const db = new Pool({
  host: "localhost",
  database: "postgres",
  user: "postgres",
  password: "senha123",
  port: 5432,
});

const app = express();

app.use(express.json());
app.use(cors());

const PORT = 3000;

app.get("/sobre", (req, res) => {
  res.json({ nome: "Tarefas", versao: "1.0.0", autor: "Pedro Pascal" });
});

app.get("/tarefas", async (req, res) => {
  const result = await db.query("select * from tarefasapp.tarefa");

  const tarefas = result.rows;

  res.json(tarefas);
});

app.get("/tarefas/:id", async (req, res) => {
  const id = req.params.id;

  const result = await db.query(
    "select * from tarefasapp.tarefa where tarefa_id = " + id
  );

  const rowCount = result.rowCount;

  if (rowCount === 0) {
    res.json(null);
  } else {
    const tarefa = result.rows[0];
    res.json(tarefa);
  }
});

app.post("/tarefas", (req, res) => {
  res.json("TAREFA CADASTRADA");
});

app.put("/tarefas/:id", (req, res) => {
  const id = req.params.id;
  res.json("ALTERANDO A TAREFA " + id);
});

app.delete("/tarefas/:id", async (req, res) => {
  const id = req.params.id;

  const result = await db.query(
    "select * from tarefasapp.tarefa where tarefa_id = " + id
  );
  if (result.rowCount === 0) {
    res.status(404).json({ erro: "Tarefa não encontrada" });
  } else {
    await db.query("delete from tarefasapp.tarefa where tarefa_id = " + id);
    res.status(200).json({ mensagem: "Tarefa excluída com sucesso" });
  }
});

app.listen(PORT, () => {
  console.log("Servidor iniciado na porta " + PORT);
});
