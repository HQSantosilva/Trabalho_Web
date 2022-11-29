var express = require('express');
var router = express.Router();

var DBConn = require('../db-conn');
var db = new DBConn();


//home estoques. */
router.get('/', function (req, res, next) {
  db.findAllEstoquesWithProdutos( (err, data) => {
    if (err) next(err)
    else res.render('estoques/index', { estoque: data });
  });
});

//Chamando novo estoque
router.get('/novo', function (req, res, next) {
  db.findAllProdutos( (err, data) => {
    res.render('estoques/novo', {produtos: data});
  })
});


router.post('/', function (req, res, next) {
  var errors = [];

  if (req.body.idProduto == "") {
    errors.push("Produto não especificado.");
  } else if (req.body.quantidade == "") {
    errors.push("Informe uma quantidade");
  } if (req.body.tipo != "ENTRADA" && req.body.tipo != "SAIDA") {
    errors.push("Não foi específicado se é entrada ou saída");
  }

  if (errors.length == 0) {
    var isEntrada = req.body.tipo == "ENTRADA";

    db.createMovimentacao(req.body.idProduto, req.body.quantidade, isEntrada, (err, data) => {
      if (err) next(err)
      else {
        db.getEstoqueByIdProduto(req.body.idProduto, (err, data) => {
          if (data) {
            var quantidade = +data.QUANTIDADE;
            if(isEntrada) {
              quantidade += req.body.quantidade;
            } else {
              quantidade -= req.body.quantidade;
            }

            db.updateEstoque(data.ID, data.IDPRODUTO, quantidade, () => {
              res.redirect('/estoques/');
            })
          } else {
            var quantidade = 0;
            if(isEntrada) {
              quantidade += req.body.quantidade;
            } else {
              quantidade -= req.body.quantidade;
            }

            db.createEstoque(req.body.idProduto, quantidade, () => {
              res.redirect('/estoques/');
            })
          }
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
