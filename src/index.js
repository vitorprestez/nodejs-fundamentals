const { request } = require("express");
const express = require("express");
const { v4: uuidv4 } = require("uuid");
const app = express();

app.use(express.json());

/**
 * CPF - string
 * name - string
 * id - uuid
 * statement [] => extrato da conta
 */

//Middleware
function verifyIfCPFExists(req, res, next) {
  //Pegar dados pelos Headers da request -> Criados no campo headers no insomnia -> https:/localhost:3000/statement
  const { cpf } = req.headers;

  //Pegar dados pelos params -> https:/localhost:3000/statement/123456789
  //const { cpf } = req.params

  const customer = customers.find((customer) => customer.cpf === cpf);

  if (!customer) {
    return res.status(400).json({ error: "Customer not found" });
  }

  //Torna o customer disponivel para todas os metodos da aplicação usando o request do Express
  request.customer = customer;

  return next();
}

const customers = [];

/**
 *
 * Usar Middleware em todos os metodos
 * app.use(verifyIfCPFExists());
 *
 * Usar Middleware em um metodo especifico **O Middleware precisa ser passado entre o endpoint e o (req, res)**
 * app.get("/statement", verifyIfCPFExists, (req, res) => {});
 */

//Metodo que cadastra um cliente
app.post("/account", (req, res) => {
  const { cpf, name } = req.body;
  const uuid = uuidv4();

  const customerAlreadyExists = customers.some(
    (customer) => customer.cpf === cpf
  );

  if (customerAlreadyExists) {
    return res.status(400).json({ error: "Customer already exists" });
  }

  customers.push({ cpf, name, id: uuid, statement: [] });

  return res.status(201).json({ message: "Customer created" });
});

//Metodo que retorna a lista dos customers
app.get("/getCustomers", (req, res) => {
  if (!customers.length) {
    return res.status(400).json({ error: "No registered customers" });
  }

  return res.json(customers);
});

//Metodo que busca o extrato
app.get("/statement", verifyIfCPFExists, (req, res) => {
  //Pega o customer do middleware
  const { customer } = request;
  return res.json(customer.statement);
});

//Metodo que realiza um deposito
app.post("/deposit", verifyIfCPFExists, (req, res) => {
  const { description, value } = req.body;

  const { customer } = request;

  const statementOperation = {
    description,
    value,
    date: new Date().toLocaleDateString(),
    type: "credit",
  };

  customer.balance = customer.balance + value || value;
  customer.statement.push(statementOperation);

  return res
    .status(201)
    .json({ message: `Deposit successful at ${customer.name} account` });
});

//Metodo que realiza um saque
app.post("/debit", verifyIfCPFExists, (req, res) => {
  const { description, value } = req.body;

  const { customer } = request;

  const statementOperation = {
    description,
    value,
    date: new Date().toLocaleDateString(),
    type: "debit",
  };

  if (customer.balance > value) {
    customer.balance = customer.balance - value;
    customer.statement.push(statementOperation);
  } else {
    return res.status(400).json({ error: "Insufficient funds" });
  }

  return res
    .status(201)
    .json({ message: `Debit successful at ${customer.name} account` });
});

//Metodo que realiza busca de estrato por data
app.get("/statementPerDate", verifyIfCPFExists, (req, res) => {
  const { date } = req.body;
  const { customer } = request;
  const statements = [];

  customer.statement.filter((statement) => {
    if (statement.date === date) {
      statements.push(statement);
    }
  });

  if (statements.length) {
    return res.status(201).json(statements);
  } else {
    return res.status(400).json({ error: "No statement at this date" });
  }
});

//Metodo que deleta um customer
app.delete("/deleteCustomer", verifyIfCPFExists, (req, res) => {
  const { customer } = request;
  const index = customers.indexOf(customer);

  customers.splice(index, 1);

  return res.status(201).json({ message: "Customer deleted" });
});

//Metodo que retorna os dados de um customer
app.get("/customerData", verifyIfCPFExists, (req, res) => {
  const { customer } = request;

  return res.json(customer);
});

//Meotod que atualiza um valor do customer
app.patch("/customer/update", verifyIfCPFExists, (req, res) => {
  const { customer } = request;
  const { name, cpf } = req.query;

  if (name) {
    customer.name = name;
  }
  if (cpf) {
    customer.cpf = cpf;
  }

  return res.status(201).json({ message: "Customer updated" });
});

app.listen(3333);
