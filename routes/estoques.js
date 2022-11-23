var express = require('express');
var router = express.Router();

var DBConn = require('../db-conn');
var db = new DBConn();


//home estoques. */
router.get('/', function (req, res, next) {
  db.findAllEstoquesDados( req.query.id, (err, data) => {
    if (err) next(err)
    else res.render('estoque/index', { estoque: data });
  });
});

//Chamando novo estoque
router.get('/novo', function (req, res, next) {
  res.render('estoque/novo');
});


router.post('/', function (req, res, next) {
  var errors = [];

  if (req.body.descricao == "") {
    errors.push("Descrição não informado.");
  } else if (req.body.validade == "") {
    errors.push("Informe uma validade");
  } if (req.body.precoe == "") {
    errors.push("Não é permitido salvar estoque com preço nulo");
  }

  if (errors.length == 0) {
    db.createEstoque(req.body.descricao,req.body.preco,req.body.validade, (err, data) => {
      if (err) next(err)
      else {
        db.getLastInsertRowId((err, data) => {
          res.redirect('/estoque/' + data['last_insert_rowid()'],);
        });
      }
    });
  } else {
    res.render('estoque/novo', { "errors": errors });
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
    db.updateestoques(req.body.id,req.body.descricao,req.body.preco,req.body.validade, (err, data) => {
      if (err) next(err)
      else {
        res.redirect('/estoque/' + req.body.id);
      }
    });
  } else {
    var estoque = {};
    estoque.descricao = req.body.descricao;
    estoque.preco = req.body.preco;
    estoque.validade = req.body.validade;
    
    res.render('estoque/editar', { "estoque": estoque, "errors": errors });
  }
});
router.post('/deletar/:id', function (req, res, next) {
  db.deleteestoques(req.params.id, (err, data) => {
    if (err) next(err)
    else {
      res.redirect('/estoque/');
    }
  });

});


router.get('/:id', function (req, res, next) {
  db.getestoqueById(req.params.id, (err, data) => {
    if (err) next(err)
    else if (!data) res.status(404).send('estoque não encontrado.');
    else res.render('estoque/detalhe', { estoque: data });
  });

});

router.get('/editar/:id', function (req, res, next) {
  db.getestoqueById(req.params.id, (err, data) => {
    if (err) next(err)
    else if (!data) res.status(404).send('estoque não encontrado.');
    else res.render('estoque/editar', { estoque: data });
  });

});

module.exports = router;
