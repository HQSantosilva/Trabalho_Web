var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;

router.get('/compra/:id', function (req, res, next) {

db.GetCompraById(req.params.id, (err, data) => {
    if (err) next(err)
    else if (!data) res.status(404).send('Compra não encontrada.');
    else res.render('compras/main', { compra: data });
});

});

router.get('/compra/novo', function (req, res, next) {
res.render('compras/novo');
});


router.post('/', function (req, res, next) {
    var errors = [];
    if (req.body.nome == "") {
        errors.push("Nome não informado.");
    }

    if (errors.length == 0) {
        db.createCompra(req.body.nome, (err, data) => {
        if (err) next(err)
        else {
            db.getLastInsertRowId((err, data) => {
            res.redirect('/compra/' + data['last_insert_rowid()'],);
            });
        }
        });
    } else {
        res.render('compra/form', { "errors": errors });
    }
});

router.post('/:id', function (req, res, next) {

var errors = [];
if (req.body.nome == "") {
    errors.push("Nome não informado.");
}

if (errors.length == 0) {
    db.updateCompra(req.body.id, req.body.nome, (err, data) => {
    if (err) next(err)
    else {
        res.redirect('/compra/' + req.body.id);
    }
    });
} else {
    res.render('compra/editar', { "compra": compra, "errors": errors });
}
});

router.post('/compra/:id', function (req, res, next) {

db.deleteCompra(req.params.id, (err, data) => {
    if (err) next(err)
    else {
    res.redirect('/compra/');
    }
});

});