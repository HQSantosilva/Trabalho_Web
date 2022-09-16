var express = require('express');
var router = express.Router();

var DBConn = require('../db-conn');
var db = new DBConn();


/* GET home de eventos. */
router.get('/', function (req, res, next) {

  db.findAllEventos((err, data) => {
    if (err) next(err)
    else res.render('eventos/index', { eventos: data });
  });

});

/* GET Novo evento */
router.get('/novo', function (req, res, next) {
  res.render('eventos/novo');
});


router.post('/', function (req, res, next) {

  var errors = [];
  if (req.body.nome == "") {
    errors.push("Nome não informado.");
  }

  if (errors.length == 0) {
    db.createEvento(req.body.nome, (err, data) => {
      if (err) next(err)
      else {
        db.getLastInsertRowId((err, data) => {
          res.redirect('/eventos/' + data['last_insert_rowid()'],);
        });
      }
    });
  } else {
    res.render('eventos/form', { "errors": errors });
  }
});

router.post('/:id', function (req, res, next) {

  var errors = [];
  if (req.body.nome == "") {
    errors.push("Nome não informado.");
  }

  if (errors.length == 0) {
    db.updateEvento(req.body.id, req.body.nome, (err, data) => {
      if (err) next(err)
      else {
        res.redirect('/eventos/' + req.body.id);
      }
    });
  } else {
    res.render('eventos/editar', { "evento": evento, "errors": errors });
  }
});

router.post('/deletar/:id', function (req, res, next) {

  db.deleteEvento(req.params.id, (err, data) => {
    if (err) next(err)
    else {
      res.redirect('/eventos/');
    }
  });

});

/* GET home de eventos. */
router.get('/:id', function (req, res, next) {

  db.GetEventoById(req.params.id, (err, data) => {
    if (err) next(err)
    else if (!data) res.status(404).send('Evento não encontrado.');
    else res.render('eventos/detalhe', { evento: data });
  });

});

router.get('/editar/:id', function (req, res, next) {

  db.GetEventoById(req.params.id, (err, data) => {
    if (err) next(err)
    else if (!data) res.status(404).send('Evento não encontrado.');
    else res.render('eventos/editar', { evento: data });
  });

});

module.exports = router;
