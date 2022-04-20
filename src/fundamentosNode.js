const express = require("express");

const app = express();

//Esse método serve pra receber o body da requisição no formato json
app.use(express.json());

/**
 * GET - Buscar uma imforção dentro do servidor
 * POST - Criar uma informação no servidor
 * PUT - Alterar uma informação no servidor
 * PATCH - Alterar uma informação especifica no servidor
 * DELETE - Deletar uma informação no servidor
 */

/**
 * Tipos de parâmetros
 *
 * Route Params: Servem para identificar recursos pra editar, deletar ou buscar => Idenficado por : => courses/:id
 * Query Params: Servem para filtrar os dados ou para paginação => Idenficado por ? na url => courses?page=2&order=asc
 * Body Params: Servem para criar ou alterar recursos => Idenficado por body => courses (formato JSON quase sempre)
 */

app.get("/courses", (request, response) => {
  const query = request.query;
  console.log(query);
  return response.json(["Curso 1", "Curso 2", "Curso 3"]);
});

app.post("/courses", (request, response) => {
  const body = request.body;
  console.log(body);
  return response.json(["Curso 1", "Curso 2", "Curso 3", "Curso 4"]);
});

app.put("/courses/:id", (request, response) => {
  const { id } = request.params;
  console.log(id);
  return response.json(["Curso 9", "Curso 2", "Curso 3", "Curso 4"]);
});

app.patch("/courses/:id", (request, response) => {
  return response.json(["Curso 9", "Curso 8", "Curso 3", "Curso 4"]);
});

app.delete("/courses/:id", (request, response) => {
  return response.json(["Curso 9", "Curso 8", "Curso 4"]);
});

app.listen(3333);
