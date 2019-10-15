const express = require('express');

const server = express();
server.use(express.json());

let projects = [
  {
    id: "1",
    title: "Projeto Um",
    tasks: ["tarefa A"],
  },
  {
    id: "2",
    title: "Projeto Dois",
    tasks: ["tarefa B", "tarefa C"],
  }

];

server.get('/', (req, res) => {
  return res.json(projects);
});

server.listen(3000, (err)=>{
  if (err) return err;
  console.log("Rodando na porta 3000");
});