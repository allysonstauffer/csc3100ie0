import express from "express";
import cors from "cors";
// ChatGPT-5.6 Terra Light helped me figure out/organize that my
// mongodb connection is handled in user-service.js
import userService from "./services/user-service.js";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;

  userService
    .getUsers(name, job)
    .then((result) => res.send({ users_list: result }))
    .catch((error) => res.status(500).send(error));
});

app.get("/users/:id", (req, res) => {
  const id = req.params.id;
  userService
    .findUserById(id)
    .then((result) => {
      if (result === null) {
        res.status(404).send("Resource not found.");
      } else {
        res.send(result);
      }
    })
    .catch((error) => res.status(500).send(error));
});

app.post("/users", (req, res) => {
  userService
    .addUser(req.body)
    .then((result) => res.status(201).send(result))
    .catch((error) => res.status(500).send(error));
});

app.delete("/users/:id", (req, res) => {
  const id = req.params.id;
  userService
    .removeUser(id)
    .then((result) => {
      if (result === null) {
        res.status(404).send("Resource not found.");
      } else {
        res.status(204).send();
      }
    })
    .catch((error) => res.status(500).send(error));
});

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});
