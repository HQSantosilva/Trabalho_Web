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

  if (req.body.idProduto == "") {
    errors.push("Estoque não informado.");
  } else if (req.body.quantidade == "") {
    errors.push("Informe uma Quantidade");
  } if (req.body.tipo == "") {
    errors.push("Informe se haverá entrada ou saída de produtos.");
  }

  if (errors.length == 0) {
    var isEntrada = req.body.tipo == 'ENTRADA';
    db.getEstoqueByIdProduto(req.body.idProduto, (err, data) => {
      var precisaAtualizar = Boolean(data);
      var quantidadeEstoque;
      var deuErro = false;

      if (precisaAtualizar) {
        quantidadeEstoque = +data.QUANTIDADE;
        console.log(quantidadeEstoque);
        console.log(req.body.quantidade);
        if(isEntrada) {
          quantidadeEstoque += +req.body.quantidade;
        } else {
          quantidadeEstoque -= +req.body.quantidade;
        }
        console.log(quantidadeEstoque);

        if (quantidadeEstoque < 0) {
          deuErro = true;
          var estoqueTotal = +data.QUANTIDADE;
          db.findAllProdutos( (err, data) => {
            return res.render('movimentacoes/novo', { produtos: data, "errors": ["Criar essa movimentação deixaria o produto com estoque negativo (estoque atual: "+ estoqueTotal +")"] });
          });
        }
      } else {
        if(isEntrada) {
          quantidadeEstoque = +req.body.quantidade;
        } else {
          deuErro = true;
          db.findAllProdutos( (err, data) => {
            return res.render('movimentacoes/novo', { produtos: data, "errors": ["Criar essa movimentação deixaria o produto com estoque negativo (estoque atual: 0)"] });
          });
        }
      }

      if(!deuErro) {
        db.createMovimentacao(req.body.idProduto, req.body.quantidade, isEntrada, (err, dataInsert) => {
          if (err) next(err)
          else {
            db.getLastInsertRowId((err, dataInsert) => {
              if (precisaAtualizar) {
                db.updateEstoque(data.ID, data.IDPRODUTO, quantidadeEstoque, () => {
                  res.redirect('/movimentacoes/' + dataInsert['last_insert_rowid()'],);
                })
              } else {
                db.createEstoque(req.body.idProduto, quantidadeEstoque, () => {
                  res.redirect('/movimentacoes/' + dataInsert['last_insert_rowid()'],);
                })
              }
            });
          }
        });
      }
    });
  } else {
    res.render('movimentacoes/novo', { "errors": errors });
  }
});

router.post('/:id', function (req, res, next) {
  var errors = [];

  if (req.body.id == "") {
    errors.push("Id da movimentação não informado.");
  } else if (req.body.idProdutoAntigo == "") {
    errors.push("Id do produto antigo não informado.");
  } else if (req.body.idProdutoNovo == "") {
    errors.push("Id do produto antigo não informado.");
  } else if (req.body.quantidade == "") {
    errors.push("Informe uma Quantidade");
  } else if (req.body.movimentacaoAntiga == "") {
    errors.push("Valor anterior da movimentação não foi especificado");
  } else if (req.body.eraEntradaOuSaida == "") {
    errors.push("Não foi entregue se a movimentação anterior era entrada ou saída");
  } if (req.body.tipo == "") {
    errors.push("Informe se haverá entrada ou saída de produtos.");
  }

  if (errors.length == 0) {
    var isEntrada = req.body.tipo == "ENTRADA";
    var eraEntrada = req.body.eraEntradaOuSaida == "1";
    var deuErro = false;

    if (req.body.idProdutoAntigo == req.body.idProdutoNovo) {
      db.getEstoqueByIdProduto(req.body.idProdutoAntigo, (err, data) => {
        var valorAtual = data.QUANTIDADE;
        var modificacaoAnterior = +req.body.movimentacaoAntiga * (eraEntrada ? 1 : -1);
        var modificacaoNova = +req.body.quantidade * (isEntrada ? 1 : -1);

        var valorNovo = valorAtual - modificacaoAnterior + modificacaoNova;

        if (valorNovo < 0) {
          deuErro = true;
          db.findAllProdutos( (err, dataProdutos) => {
            db.getMovimentacaoById(req.body.id, (err, dataMovimentacao) => {
              return res.render('movimentacoes/editar', { movimentacao: dataMovimentacao, produtos: dataProdutos, "errors": ["Editar essa movimentação deixaria o produto com estoque negativo (estoque atual: "+ valorAtual +")"] });
            })
          });
        }
      });
    } else {
      db.getEstoqueByIdProduto(req.body.idProdutoAntigo, (err, data) => {
        var valorAtual = +data.QUANTIDADE;
        var modificacaoAnterior = +req.body.movimentacaoAntiga * (eraEntrada ? 1 : -1);

        var valorNovo = valorAtual - modificacaoAnterior;

        if (valorNovo < 0) {
          deuErro = true;
          db.findAllProdutos( (err, dataProdutos) => {
            db.getMovimentacaoById(req.body.id, (err, dataMovimentacao) => {
              return res.render('movimentacoes/editar', { movimentacao: dataMovimentacao, produtos: dataProdutos, "errors": ["Editar essa movimentação deixaria o produto com estoque negativo (estoque atual: "+ valorAtual +")"] });
            })
          });
        }

        if (!deuErro) {
          db.getEstoqueByIdProduto(req.body.idProdutoNovo, (err, data) => {
            var valorNovo;
            if (data) {
              var valorAtual = +data.QUANTIDADE;
              var modificacaoNova = +req.body.quantidade * (isEntrada ? 1 : -1);

              valorNovo = valorAtual + modificacaoNova;
            } else {
              valorNovo = 0;
            }

            if (valorNovo < 0) {
              deuErro = true;
              db.findAllProdutos( (err, dataProdutos) => {
                db.getMovimentacaoById(req.body.id, (err, dataMovimentacao) => {
                  return res.render('movimentacoes/editar', { movimentacao: dataMovimentacao, produtos: dataProdutos, "errors": ["Editar essa movimentação deixaria o produto com estoque negativo (estoque atual: "+ valorAtual +")"] });
                })
              });
            }
          });
        }
      });
    }


    if (!deuErro) {
      db.updateMovimentacao(req.body.id, req.body.idProdutoNovo, req.body.quantidade, isEntrada, (err, data) => {
        if (err) next(err)
        else {
          if (req.body.idProdutoAntigo != req.body.idProdutoNovo) {
            // Vixe, trocou o produto...
            // Tem que desfazer a mudança no velho
            // Pra isso precisamos do valor anterior do estoque
            db.getEstoqueByIdProduto(req.body.idProdutoAntigo, (err, data) => {
              var valorAntigo = +data.QUANTIDADE;
              // aquela coisa estranha ali serve pra inverter a movimentação
              var valorNovo = valorAntigo + ((eraEntrada ? -1 : 1) * req.body.movimentacaoAntiga);

              db.updateEstoque(data.ID, data.IDPRODUTO, valorNovo, () => {
                // Ok, agora o produto novo
                db.getEstoqueByIdProduto(req.body.idProdutoNovo, (err, data) => {
                  if (!data) {
                    // pra complicar ainda mais tem o caso do produto novo não ter estoque
                    var valor = (isEntrada ? 1 : -1) * req.body.quantidade;

                    db.createEstoque(req.body.idProdutoNovo, valor, (err, data) => {
                      res.redirect('/movimentacoes/' + req.body.id);
                    })
                  } else {
                    var valorAntigo = +data.QUANTIDADE;
                    // aquela coisa estranha ali serve pra inverter a movimentação
                    var valorNovo = valorAntigo + ((isEntrada ? 1 : -1) * req.body.quantidade);

                    db.updateEstoque(data.ID, req.body.idProdutoNovo, valorNovo, () => {
                      res.redirect('/movimentacoes/' + req.body.id);
                    });
                  }
                });
              });
            });

          } else {
            // Só tem um pra atualizar, bem mais tranquilo
            db.getEstoqueByIdProduto(req.body.idProdutoNovo, (err, data) => {
              var valorAtual = +data.QUANTIDADE;
              // aquela coisa estranha ali serve pra inverter a movimentação
              var modificacaoAnterior = +req.body.movimentacaoAntiga * (eraEntrada ? 1 : -1);
              var modificacaoNova = +req.body.quantidade * (isEntrada ? 1 : -1);

              var valorNovo = valorAtual - modificacaoAnterior + modificacaoNova;

              db.updateEstoque(data.ID, data.IDPRODUTO, valorNovo, () => {
                res.redirect('/movimentacoes/' + req.body.id);
              });
            });
          }
        }
      });
    }
  } else {
    res.render('movimentacoes/novo', { "errors": errors });
  }
});

router.get('/teste/', function (req, res, next) {
  db.getEstoqueByIdProduto('45324', (err, data) => {
    if (!data) {
      res.render('movimentacoes/teste', { movimentacao: {'hmmm': true} });
    } else {

      res.render('movimentacoes/teste', { movimentacao: data });
    }
  });
});

router.get('/:id', function (req, res, next) {
  db.getMovimentacaoByIdComProduto(req.params.id, (err, data) => {
    if (err) next(err)
    else if (!data) res.status(404).send('Movimentação não encontrada.');
    else res.render('movimentacoes/detalhe', { movimentacao: data });
  });
});

router.get('/editar/:id', function (req, res, next) {
  db.getMovimentacaoByIdComProduto(req.params.id, (err, dataMovimentacao) => {
    if (err) next(err)
    else if (!dataMovimentacao) res.status(404).send('Movimentação não encontrada.');
    else {
      db.findAllProdutos((err, dataProduto) => {
        res.render('movimentacoes/editar', { movimentacao: dataMovimentacao, produtos: dataProduto });
      })
    }
  });
});

router.post('/deletar/:id', function (req, res, next) {
  var errors = [];
  if (req.params.id == "") {
    errors.push("Id da movimentação não informado.");
  } else if (req.body.idProduto == "") {
    errors.push("Id do produto antigo não informado.");
  } else if (req.body.entradaSaida == "") {
    errors.push("Id do produto antigo não informado.");
  } else if (req.body.quantidade == "") {
    errors.push("Informe uma Quantidade");
  }

  if (errors.length == 0) {
    db.deleteMovimentacao(req.params.id, (err, data) => {
      if (err) next(err)
      else {
        db.getEstoqueByIdProduto(req.body.idProduto, (err, data) => {
          var valorAntigo = +data.QUANTIDADE;
          var isEntrada = req.body.entradaSaida == '1';
          var quantiaMovimentacao = req.body.quantidade * (isEntrada? -1 : 1);

          var valorNovo = valorAntigo + quantiaMovimentacao;

          db.updateEstoque(data.ID, req.body.idProduto, valorNovo, () => {
            res.redirect('/movimentacoes/');
          })
        })
      }
    });
  }
});

module.exports = router;
