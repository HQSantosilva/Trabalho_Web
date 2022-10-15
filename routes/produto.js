var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;

router.get('/produto/:id', function (req, res, next) {

db.GetProdutoById(req.params.id, (err, data) => {
    if (err) next(err)
    else if (!data) res.status(404).send('Produto não encontrada.');
    else res.render('produto/main', { produto: data });
});

});

router.get('/produto/novo', function (req, res, next) {
res.render('produtos/novo');
});


router.post('/', function (req, res, next) {
    var errors = [];
    if (req.body.nome == "") {
        errors.push("Nome não informado.");
    }

    if (errors.length == 0) {
        db.createProduto(req.body.nome, (err, data) => {
        if (err) next(err)
        else {
            db.getLastInsertRowId((err, data) => {
            res.redirect('/produto/' + data['last_insert_rowid()'],);
            });
        }
        });
    } else {
        res.render('produto/form', { "errors": errors });
    }
});

router.post('/:id', function (req, res, next) {

var errors = [];
if (req.body.nome == "") {
    errors.push("Nome não informado.");
}

if (errors.length == 0) {
    db.updateProduto(req.body.id, req.body.nome, (err, data) => {
    if (err) next(err)
    else {
        res.redirect('/produto/' + req.body.id);
    }
    });
} else {
    res.render('produto/editar', { "produto": produto, "errors": errors });
}
});

router.post('/produto/:id', function (req, res, next) {

db.deleteProduto(req.params.id, (err, data) => {
    if (err) next(err)
    else {
    res.redirect('/produto/');
    }
});

});