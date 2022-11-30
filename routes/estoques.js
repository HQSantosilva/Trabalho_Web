var express = require('express');
var router = express.Router();

var DBConn = require('../db-conn');
var db = new DBConn();


//home estoques. */
router.get('/', function (req, res, next) {
  if(req.query.pesquisa) {
    db.findAllEstoquesDescric(req.query.pesquisa, (err, data) => {
      console.log(data);
      if (err) next(err)
      else res.render('estoques/index',
      {
        estoque: data
      });
    });
  } else {
    db.findAllEstoquesWithProdutos( (err, data) => {
      if (err) next(err)
      else res.render('estoques/index', { estoque: data });
    });
  }
});

//Chamando novo estoque
router.get('/novo', function (req, res, next) {
  db.findAllProdutos( (err, dataProdutos) => {
    db.findAllEstoques( (err, dataEstoques) => {
      var produtosSemEstoque = []
      for (let i = 0; i < dataProdutos.length; i++) {
        var produto = dataProdutos[i];
        var adicionarProduto = true;
        for (let j = 0; j < dataEstoques.length; j++) {
          if (produto.ID == dataEstoques[j].IDPRODUTO){
            adicionarProduto = false;
          }
        }

        if (adicionarProduto) {
          produtosSemEstoque.push(produto);
        }
      }

      res.render('estoques/novo', {produtos: produtosSemEstoque});
    })
  })
});


router.post('/', function (req, res, next) {
  var errors = [];

  if (req.body.idProduto == "") {
    errors.push("Produto não especificado.");
  }
  if (req.body.quantidade == "") {
    errors.push("Informe uma quantidade");
  }

  if (errors.length == 0) {
    db.createEstoque(req.body.idProduto, req.body.quantidade, () => {
      res.redirect('/estoques/');
    })
  } else {
    res.render('estoques/novo', { "errors": errors });
  }
});

router.post('/:id', function (req, res, next) {
  var errors = [];

  if (req.body.quantidade == "") {
    errors.push("Quantidade não informado.");
  }
  if (req.body.idProduto == "") {
    errors.push("Id produto não informado.");
  }
  if (req.body.id == "") {
    errors.push("ID não informado.");
  }

  if (errors.length == 0) {
    db.updateEstoque(req.body.id, req.body.idProduto, req.body.quantidade, (err, data) => {
      if (err) next(err)
      else {
        res.redirect('/estoques/' + req.body.id);
      }
    });
  } else {
    var estoque = {};
    estoque.id = req.body.id;
    estoque.quantidade = req.body.quantidade;

    res.render('estoques/editar', { "estoque": estoque, "errors": errors });
  }
});
router.post('/deletar/:id', function (req, res, next) {
  db.deleteEstoque(req.params.id, (err, data) => {
    if (err) next(err)
    else {
      res.redirect('/estoques/');
    }
  });

});


router.get('/:id', function (req, res, next) {
  db.getEstoqueById(req.params.id, (err, data) => {
    if (err) next(err)
    else if (!data) res.status(404).send('estoque não encontrado.');
    else res.render('estoques/detalhe', { estoque: data });
  });

});

router.get('/editar/:id', function (req, res, next) {
  db.getEstoqueById(req.params.id, (err, data) => {
    if (err) next(err)
    else if (!data) res.status(404).send('estoque não encontrado.');
    else res.render('estoques/editar', { estoque: data });
  });

});

module.exports = router;
