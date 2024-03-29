const express = require('express');

const server = express();

server.use(express.json());


// Lista de projetos
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

let contRequest = 0;

server.use((req, res, next ) => {
  console.log(`Núnero de requisições: ${ ++contRequest }`);
  return next();
});


//Verifica se ID não é nullo ou diferente de string
function isValidId(req, res, next) {
  const { id } = req.params.id ? req.params : req.body;
  if (!id || typeof id !== "string") 
    return res.status(400).json({ error: " ID does not correct"});
  return next();
}


//Verifica se Title não é nullo ou diferente de string
function isValidTitle(req, res, next) {
  const { title } = req.body;
  if (!title || typeof title !== "string") 
    return res.status(400).json({ error: " Title does not correct"});
  return next();
}

//Verifica se existe o projeto com o ID específico
function existProjectId(req, res, next) {
  const { id } = req.params;

  const project = projects.find(project => project.id === id );

  if (!project) return res.status(400).json({ error: "Projeto não encontrado!"});

  req.project = project;

  return next();
}


//Rota para listar todos os projetos
server.get('/projects', (req, res) => {
  return res.json(projects);
});


//Rota para adicionar um novo projeto
server.post('/projects', isValidId, isValidTitle, (req, res) => {
  const { id, title } = req.body;
  
  const project = projects.find(project => project.id === id);
  if (project) return res.status(400).json({ error: "Id do projeto já existe"});

  const newProject = {
    id,
    title,
    tasks: [],
  };

  projects.push(newProject);
 
  return res.json(projects);
});


//Rota para editar um projeto
server.put('/projects/:id', isValidId, existProjectId, isValidTitle, (req, res) => {
  const { body: {title}, project } = req;
  
  project.title = title;
  
  return res.json(projects);
});


//Rota para apagar um projeto
server.delete('/projects/:id', isValidId, existProjectId, (req, res) => {
  const { id } = req.params;

  const index = projects.findIndex(project => project.id === id);

  if (index === -1) return res.status(400).json({ error: "Projeto não encontrado! " });

  projects.splice(index, 1);

  return res.send();

});

//Rota para cadastrar uma tarefa
server.post('/projects/:id/tasks', isValidId, existProjectId, isValidTitle, (req, res) => {
  const { body: { title }, project } = req;
  
  project.tasks.push(title);

  return res.json(projects);

});


//Inicia o servidor
server.listen(3000, (err)=>{
  if (err) return err;
  console.log("Rodando na porta 3000");
});