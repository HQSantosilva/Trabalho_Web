var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;

router.get('/reserva/:id', function (req, res, next) {

db.GetReservaById(req.params.id, (err, data) => {
    if (err) next(err)
    else if (!data) res.status(404).send('reserva não encontrada.');
    else res.render('reserva/main', { reserva: data });
});

});

router.get('/reserva/novo', function (req, res, next) {
res.render('reservas/novo');
});


router.post('/', function (req, res, next) {
    var errors = [];
    if (req.body.nome == "") {
        errors.push("Nome não informado.");
    }

    if (errors.length == 0) {
        db.createReserva(req.body.nome, (err, data) => {
        if (err) next(err)
        else {
            db.getLastInsertRowId((err, data) => {
            res.redirect('/reserva/' + data['last_insert_rowid()'],);
            });
        }
        });
    } else {
        res.render('reserva/form', { "errors": errors });
    }
});

router.post('/:id', function (req, res, next) {

var errors = [];
if (req.body.nome == "") {
    errors.push("Nome não informado.");
}

if (errors.length == 0) {
    db.updateReserva(req.body.id, req.body.nome, (err, data) => {
    if (err) next(err)
    else {
        res.redirect('/reserva/' + req.body.id);
    }
    });
} else {
    res.render('reserva/editar', { "reserva": reserva, "errors": errors });
}
});

router.post('/reserva/:id', function (req, res, next) {

db.deleteReserva(req.params.id, (err, data) => {
    if (err) next(err)
    else {
    res.redirect('/reserva/');
    }
});

});