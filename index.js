require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("dist"));

morgan.token("datan", (req) => JSON.stringify(req.body));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :datan")
);

const Person = require("./models/person");

//GET

app.get("/api/persons", (request, response) => {
  Person.find({}).then((result) => response.json(result));
});

app.get("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  Person.findById(id)
    .then((result) => {
      if (result) response.json(result);
      else response.status(404).end();
    })
    .catch((error) => next(error));
});

app.get("/info", (request, response) => {
  Person.countDocuments()
    .then((result) =>
      response.send(
        `<p>Phonebook has info for ${result} people</p> <p> ${Date()} </p>`
      )
    )
    .catch((error) => {
      console.log(error.message);
      response.status(500).end();
    });
});

//POST

app.post("/api/persons", (request, response, next) => {
  const body = request.body;

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((result) => response.json(result))
    .catch((error) => next(error));
});

//PUT

app.put("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  const person = {
    name: request.body.name,
    number: request.body.number,
  };
  Person.findByIdAndUpdate(id, person, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((result) => response.json(result))
    .catch((error) => next(error));
});

//DELETE

app.delete("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  Person.findByIdAndDelete(id)
    .then((result) => {
      console.log(result);
      response.status(204).end();
    })
    .catch((error) => next(error));
});

const errorHandler = (error, request, response, next) => {
  console.log(error.message);
  if (error.name === "CastError") {
    return response.status(400).send({ error: "Malformed ID" });
  } else if (error.name === "ValidationError") {
    return response.status(400).send({ error: error.message });
  }
  next(error);
};

app.use(errorHandler);
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
