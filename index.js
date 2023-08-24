const express = require("express");
const morgan = require("morgan");
const app = express();

app.use(express.json());

morgan.token('datan',(req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :datan'));

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

//GET
app.get("/", (request, response) => {
  response.send("<h1>Hello World </h1>");
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).send("Nakku");
  }
});

app.get("/info", (request, response) => {
  const html = `<p>Phonebook has info for ${
    persons.length
  } people</p> <p> ${Date()} </p>`;
  response.send(html);
});

//POST

app.post("/api/persons", (request, response) => {
  const body = request.body;
  const duplicate = persons.filter((person) => person.name === body.name);
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "Name or Number is missing",
    });
  } else if (duplicate.length !== 0) {
    return response.status(409).json({
      error: "Name must be unique",
    });
  }
  const person = {
    id: Math.floor(Math.random() * 10000),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);
  console.log(person);
  response.json(person);
});
//DELETE

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
