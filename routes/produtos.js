var express = require('express');
var router = express.Router();

var DBConn = require('../db-conn');
var db = new DBConn();


//home produtos. */
router.get('/', function (req, res, next) {
  db.findAllProdutosDescric( req.query.id, (err, data) => {
    if (err) next(err)
    else res.render('produtos/index', { produto: data });
  });
});

//Chamando novo produto
router.get('/novo', function (req, res, next) {
  res.render('produtos/novo');
});


router.post('/', function (req, res, next) {
  var errors = [];

  if (req.body.descricao == "") {
    errors.push("Descrição não informado.");
  }
  if (req.body.preco == "") {
    errors.push("Não é permitido salvar produto com preço nulo");
  }
  // if (red.body.descrição <=3){
  //   errors.push("Descrição com menos de 3 caracteres");
  // }

  if (errors.length == 0) {
    db.createProduto(req.body.descricao,req.body.preco, (err, data) => {
      if (err) next(err)
      else {
        db.getLastInsertRowId((err, data) => {
          res.redirect('/produtos/' + data['last_insert_rowid()'],);
        });
      }
    });
  } else {
    res.render('produtos/novo', { "errors": errors });
  }
});

router.post('/:id', function (req, res, next) {
  var errors = [];

  if (req.body.descricao == "") {
    errors.push("Descrição não informado.");
  }
  // if (red.body.descrição <=3){
  //   errors.push("Descrição com menos de 3 caracteres");
  // }

  if (errors.length == 0) {
    db.updateProdutos(req.body.id,req.body.descricao,req.body.preco,(err, data) => {
      if (err) next(err)
      else {
        res.redirect('/produtos/' + req.body.id);
      }
    });
  } else {
    var produto = {};
    produto.descricao = req.body.descricao;
    produto.preco = req.body.preco;
    
    res.render('produtos/editar', { "produto": produto, "errors": errors });
  }
});
router.post('/deletar/:id', function (req, res, next) {
  db.deleteProdutos(req.params.id, (err, data) => {
    if (err) next(err)
    else {
      res.redirect('/produtos/');
    }
  });

});


router.get('/:id', function (req, res, next) {
  db.getProdutoById(req.params.id, (err, data) => {
    if (err) next(err)
    else if (!data) res.status(404).send('Produto não encontrado.');
    else res.render('produtos/detalhe', { produto: data });
  });

});

router.get('/editar/:id', function (req, res, next) {
  db.getProdutoById(req.params.id, (err, data) => {
    if (err) next(err)
    else if (!data) res.status(404).send('Produto não encontrado.');
    else res.render('produtos/editar', { produto: data });
  });

});

module.exports = router;
