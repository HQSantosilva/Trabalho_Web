var express = require('express');
var router = express.Router();

var DBConn = require('../db-conn');
var db = new DBConn();


//home estoques. */
router.get('/', function (req, res, next) {
  db.findAllMovimentacoesWithProdutos( (err, data) => {
    if (err) next(err)
    else {
      for (let i = 0; i < data.length; i++) {
        if (data[i].ENTRADAOUSAIDA == 1) {
          data[i].cor = 'verde';
          data[i].acao = 'Entrada';
        } else {
          data[i].cor = 'vermelho';
          data[i].acao = 'Saída';
        }
      }

      res.render('movimentacoes/index', { movimentacao: data });
    }
  });
});

//Chamando novo estoque
router.get('/novo', function (req, res, next) {
  db.findAllProdutos( (err, data) => {
    res.render('movimentacoes/novo', {produtos: data});
  })
});


router.post('/', function (req, res, next) {
  var errors = [];

  if (req.body.estoque == "") {
    errors.push("Estoque não informado.");
  } else if (req.body.quantidade == "") {
    errors.push("Informe uma Quantidade");
  } if (req.body.tipo == "") {
    errors.push("Informe se haverá entrada ou saída de produtos.");
  }

  if (errors.length == 0) {
    db.createMovimentacao(req.body.estoque,req.body.quantidade,req.body.tipo, (err, data) => {
      if (err) next(err)
      else {
        db.getLastInsertRowId((err, data) => {
          res.redirect('/movimentacoes/' + data['last_insert_rowid()'],);
        });
      }
    });
  } else {
    res.render('movimentacoes/novo', { "errors": errors });
  }
});

router.get('/:id', function (req, res, next) {
  db.getMovimentacaoById(req.params.id, (err, data) => {
    if (err) next(err)
    else if (!data) res.status(404).send('Movimentação não encontrada.');
    else res.render('movimentacoes/detalhe', { estoque: data });
  });

});

module.exports = router;
