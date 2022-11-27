var express = require('express');
var router = express.Router();

var DBConn = require('../db-conn');
var db = new DBConn();


//home estoques. */
router.get('/', function (req, res, next) {
  db.findAllEstoquesDados( req.query.id, (err, data) => {
    if (err) next(err)
    else res.render('estoques/index', { estoque: data });
  });
});

//Chamando novo estoque
router.get('/novo', function (req, res, next) {
  res.render('estoques/novo');
});


router.post('/', function (req, res, next) {
  var errors = [];

  if (req.body.id == "") {
    errors.push("Descrição não informado.");
  } else if (req.body.quantidade == "") {
    errors.push("Informe uma validade");
  } if (req.body.tipo == "") {
    errors.push("Não é permitido salvar estoque com preço nulo");
  }

  if (errors.length == 0) {
    db.createMovimentacao(req.body.id,req.body.quantidade,req.body.tipo, (err, data) => {
      if (err) next(err)
      else {
        db.getLastInsertRowId((err, data) => {
          res.redirect('/estoques/' + data['last_insert_rowid()'],);
        });
      }
    });
  } else {
    res.render('estoques/novo', { "errors": errors });
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
        res.redirect('/estoques/' + req.body.id);
      }
    });
  } else {
    var estoque = {};
    estoque.descricao = req.body.descricao;
    estoque.preco = req.body.preco;
    estoque.validade = req.body.validade;
    
    res.render('estoques/editar', { "estoque": estoque, "errors": errors });
  }
});
router.post('/deletar/:id', function (req, res, next) {
  db.deleteestoques(req.params.id, (err, data) => {
    if (err) next(err)
    else {
      res.redirect('/estoques/');
    }
  });

});


router.get('/:id', function (req, res, next) {
  db.getMovimentacaoById(req.params.id, (err, data) => {
    if (err) next(err)
    else if (!data) res.status(404).send('estoque não encontrado.');
    else res.render('estoques/detalhe', { estoque: data });
  });

});

router.get('/editar/:id', function (req, res, next) {
  db.getestoqueById(req.params.id, (err, data) => {
    if (err) next(err)
    else if (!data) res.status(404).send('estoque não encontrado.');
    else res.render('estoques/editar', { estoque: data });
  });

});

module.exports = router;
