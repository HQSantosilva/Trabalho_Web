var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;

router.get('/estoque/:id', function (req, res, next) {

db.GetEstoqueById(req.params.id, (err, data) => {
    if (err) next(err)
    else if (!data) res.status(404).send('estoque não encontrado.');
    else res.render('estoque/main', { estoque: data });
});

});

router.get('/estoque/novo', function (req, res, next) {
res.render('estoque/novo');
});


router.post('/', function (req, res, next) {
    var errors = [];
    if (req.body.nome == "") {
        errors.push("Nome não informado.");
    }

    if (errors.length == 0) {
        db.createEstoque(req.body.nome, (err, data) => {
        if (err) next(err)
        else {
            db.getLastInsertRowId((err, data) => {
            res.redirect('/estoque/' + data['last_insert_rowid()'],);
            });
        }
        });
    } else {
        res.render('estoque/form', { "errors": errors });
    }
});

router.post('/:id', function (req, res, next) {

var errors = [];
if (req.body.nome == "") {
    errors.push("Nome não informado.");
}

if (errors.length == 0) {
    db.updateestoque(req.body.id, req.body.nome, (err, data) => {
    if (err) next(err)
    else {
        res.redirect('/estoque/' + req.body.id);
    }
    });
} else {
    res.render('estoque/editar', { "estoque": estoque, "errors": errors });
}
});

router.post('/estoque/:id', function (req, res, next) {

db.deleteEstoque(req.params.id, (err, data) => {
    if (err) next(err)
    else {
    res.redirect('/estoque/');
    }
});

});