/* 
Estrutura de backend, em que iremos selecionar, cadastrar, atualizar e
deletar dados sobre os produtos, ou seja, criaremos um crud
CRUD
C -> Create: Quando cria-se dados no banco
R -> Read: Quando lemos dados no banco
U -> Update: Quando atualizamos dados no banco
D -> Delete: Quando apagamos dados no banco
Vamos usar os verbos: GET, POST, PUT, DELETE, onde:
GET -> Read
POST -> Create
PUT -> Update
DELETE -> Delete
*/

//Importação do módulo express
var express = require("express");

//Criação do app referente ao express
var app = express();

var bodyParser = require("body-parser");

//Importação do módulo do Mongoose
var mongoose = require("mongoose");

var Produto = require("./models/model");

var fs = require("fs");

var path = require("path");

require("dotenv/config");

//MONGO_URL = mongodb+srv://pamellapereto:Notade100@clustercliente.dqmxy.mongodb.net/bancodedados?retryWrites=true&w=majority

mongoose.connect(
  process.env.MONGO_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (connected) => {
    console.log("Database conectado");
  }
);

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use("/public", express.static("public"));

app.set("view engine", "ejs");

var multer = require("multer");

var Storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

var upload = multer({ storage: Storage });

app.get(`/inesquecivel/sobre`, (req, res) => {
  res.render("sobre");
});

//Rota para listar os produtos com endpoint produtos
app.get(`/inesquecivel/produtos`, (req, res) => {
  Produto.find({}, (err, items) => {
    if (err) {
      console.log(err);
      res.status(500).send(`Erro interno ao processar a consulta ➙`, err);
    } else {
      res.render("produtos", { items: items });
    }
  });
});

app.get(`/inesquecivel/localizacao`, (req, res) => {
  res.render("localizacao");
});

app.get(`/inesquecivel/contato`, (req, res) => {
  res.render("contato");
});

//Rota para cadastrar os produtos com endpoint cadastro
app.post(`/inesquecivel/cadastro`, upload.single("image"), (req, res) => {
  var pro = {
    imagemProduto: {
      data: fs.readFileSync(
        path.join(__dirname + "/uploads/" + req.file.filename)
      ),
      contentType: "image/png",
    },
    nomeProduto: req.body.nomeProduto,
    descricao: req.body.descricao,
    tamanho: req.body.tamanho,
    quantidade: req.body.quantidade,
    preco: req.body.preco,
  };

  Produto.create(pro, (err, item) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/inesquecivel/cadastro");
    }
  });
});

app.get(`/inesquecivel/cadastro`, (req, res) => {
  res.render("cadastro");
});

//Rota para atualizar os produtos com endpoint atualizar
//Passagem de argumentos pela url com o id do produto
app.put(`/inesquecivel/atualizar/:id`, (req, res) => {
  Produto.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, dados) => {
      if (err) {
        console.log(err);
        return res.status(500).send(`Erro interno ao atualizar o produto ➙`, err);
      }
      else {
      res.status(200).send(`Atualizado!`);
      }
    }
  );
});

//Rota para apagar produto com endpoint deletar
app.delete(`/inesquecivel/apagar/:id`, (req, res) => {
  Produto.findByIdAndDelete(req.params.id, (err, dados) => {
     if (err) {
      console.log(err);
      res.status(500).send(`Erro interno ao deletar o produto ➙`, err);
     }
    else {
    res.status(204).send(`Apagado!`);
    }
  });
});

var port = process.env.PORT || "5000";
app.listen(port, (err) => {
  if (err) throw err;
  console.log("Servidor on-line na porta", port);
});