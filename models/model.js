const mongoose = require("mongoose");

/*Definição do esquema de dados da tabela Schema*/
const tabelaProduto = new mongoose.Schema({
  imagemProduto: {
    data: Buffer,
    contentType: String,
  },
  nomeProduto: { type: String },
  descricao: { type: String },
  tamanho: { type: String },
  quantidade: { type: String },
  preco: { type: String },
});

module.exports = new mongoose.model("tbProduto", tabelaProduto);