

var sqlite3 = require('sqlite3');

class DBConn {

    constructor() {
        this.db = new sqlite3.Database('db/Trabalhofinal.db');
    }

    createTables() {

        var sql =`CREATE TABLE IF NOT EXISTS PRODUTO (
            ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
            DESCRICAO VARCHAR (250) DEFAULT (0),
            PRECO DECIMAL NOT NULL DEFAULT (0)
        );
        CREATE TABLE IF NOT EXISTS ESTOQUE (
            ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
            IDPRODUTO INTEGER NOT NULL REFERENCES PRODUTO(ID),
            QUANTIDADE INTEGER NOT NULL
        );
        CREATE TABLE IF NOT EXISTS MOVIMENTACAO (
            ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
            IDPRODUTO INTEGER NOT NULL REFERENCES PRODUTO(ID),
            QUANTIDADE INTEGER NOT NULL,
            ENTRADAOUSAIDA BIT NOT NULL
        );
        `;
        return this.db.run(sql);
    }

    getLastInsertRowId(callback) {
        return this.db.get('SELECT last_insert_rowid()',[], callback);
    }

    findAllProdutos(callback) {
        var sql = 'SELECT ID,DESCRICAO,PRECO FROM PRODUTO';
        return this.db.all(sql, [], callback);
    }

    findAllProdutosDescric(descricao, callback) {
        var sql = 'SELECT ID,DESCRICAO,PRECO FROM PRODUTO WHERE DESCRICAO LIKE (?)';
        return this.db.all(sql, ['%' + descricao + '%'], callback);
    }

    findAllEstoquesDescric(descricao, callback) {
        var sql = 'SELECT ESTOQUE.ID, ESTOQUE.IDPRODUTO, ESTOQUE.QUANTIDADE, PRODUTO.DESCRICAO FROM ESTOQUE INNER JOIN PRODUTO ON ESTOQUE.IDPRODUTO=PRODUTO.ID WHERE PRODUTO.DESCRICAO LIKE (?)';
        return this.db.all(sql, ['%' + descricao + '%'], callback);
    }

    createProduto(descricao,preco, callback) {
        var sql = 'INSERT INTO PRODUTO (descricao,preco) VALUES ((?),(?))';
        return this.db.run(sql, [descricao,preco], callback);
    }

    updateProdutos(id, descricao, preco, callback) {
        var sql = 'UPDATE PRODUTO SET descricao = (?),preco = (?) WHERE ID = (?)';
        return this.db.run(sql, [descricao,preco, id], callback);
    }

    getProdutoById(id, callback) {
        var sql = 'SELECT ID,DESCRICAO,PRECO FROM PRODUTO WHERE ID = (?)';
        return this.db.get(sql, id, callback);
    }

    deleteProdutos(id, callback) {
        var sql = 'DELETE FROM PRODUTO WHERE ID = (?)';
        return this.db.run(sql, [id], callback);
    }

    deleteEstoque(id, callback) {
        var sql = 'DELETE FROM ESTOQUE WHERE ID = (?)';
        return this.db.run(sql, [id], callback);
    }

    deleteMovimentacao(id, callback) {
        var sql = 'DELETE FROM MOVIMENTACAO WHERE ID = (?)';
        return this.db.run(sql, [id], callback);
    }

    findAllEstoques(callback) {
        var sql = 'SELECT ID,IDPRODUTO,QUANTIDADE FROM ESTOQUE';
        return this.db.all(sql, [], callback);
    }

    findAllEstoquesWithProdutos(callback) {
        var sql = 'SELECT ESTOQUE.ID, ESTOQUE.IDPRODUTO, ESTOQUE.QUANTIDADE, PRODUTO.DESCRICAO FROM ESTOQUE INNER JOIN PRODUTO ON ESTOQUE.IDPRODUTO=PRODUTO.ID';
        return this.db.all(sql, [], callback);
    }

    findAllEstoquesDados(descricao, callback) {
        var sql = 'SELECT ID,IDPRODUTO,QUANTIDADE  FROM ESTOQUE WHERE IDPRODUTO LIKE (?)';
        return this.db.all(sql, [descricao + '%'], callback);
    }

    createEstoque(produto, quantidade, callback) {
        var sql = 'INSERT INTO ESTOQUE (IDPRODUTO, QUANTIDADE) VALUES ((?),(?))';
        return this.db.run(sql, [produto, quantidade], callback);
    }

    updateEstoque(id, idProduto, quantidade, callback) {
        var sql = 'UPDATE ESTOQUE SET IDPRODUTO = (?),QUANTIDADE = (?) WHERE ID = (?)';
        return this.db.run(sql, [idProduto, quantidade, id], callback);
    }

    updateEstoqueByIdProduto(idProduto, quantidade, callback) {
        var sql = 'UPDATE ESTOQUE SET QUANTIDADE = (?) WHERE IDPRODUTO = (?)';
        return this.db.run(sql, [quantidade, idProduto], callback);
    }

    getEstoqueById(id, callback) {
        var sql = 'SELECT ID, IDPRODUTO, QUANTIDADE FROM ESTOQUE WHERE ID = (?)';
        return this.db.get(sql, [id], callback);
    }

    getEstoqueByIdProduto(id, callback) {
        var sql = 'SELECT ID, IDPRODUTO, QUANTIDADE FROM ESTOQUE WHERE IDPRODUTO = (?)';
        return this.db.get(sql, [id], callback);
    }

    getMovimentacaoById(id, callback) {
        var sql = 'SELECT ID, IDPRODUTO, QUANTIDADE FROM MOVIMENTACAO WHERE ID = (?)';
        return this.db.get(sql, [id], callback);
    }

    getMovimentacaoByIdComProduto(id, callback) {
        var sql = 'SELECT MOVIMENTACAO.ID, MOVIMENTACAO.IDPRODUTO, MOVIMENTACAO.QUANTIDADE, MOVIMENTACAO.ENTRADAOUSAIDA, PRODUTO.DESCRICAO FROM MOVIMENTACAO INNER JOIN PRODUTO ON MOVIMENTACAO.IDPRODUTO=PRODUTO.ID WHERE MOVIMENTACAO.ID = (?)';
        return this.db.get(sql, [id], callback);
    }

    findAllMovimentacoes(callback) {
        var sql = 'SELECT ID, IDPRODUTO, QUANTIDADE, ENTRADAOUSAIDA FROM MOVIMENTACAO';
        return this.db.all(sql, [], callback);
    }

    findAllMovimentacoesWithProdutos(callback) {
        var sql = 'SELECT MOVIMENTACAO.ID, MOVIMENTACAO.IDPRODUTO, MOVIMENTACAO.QUANTIDADE, MOVIMENTACAO.ENTRADAOUSAIDA, PRODUTO.DESCRICAO FROM MOVIMENTACAO INNER JOIN PRODUTO ON MOVIMENTACAO.IDPRODUTO=PRODUTO.ID';
        return this.db.all(sql, [], callback);
    }

    createMovimentacao(idProduto, quantidade, tipo, callback ) {
        var sql = 'INSERT INTO MOVIMENTACAO (IDPRODUTO, QUANTIDADE, ENTRADAOUSAIDA) VALUES ((?),(?),(?))';
        return this.db.run(sql, [idProduto, quantidade, tipo], callback);
    }

    updateMovimentacao(id, idProduto, quantidade, isEntrada, callback) {
        var sql = 'UPDATE MOVIMENTACAO SET IDPRODUTO = (?),QUANTIDADE = (?), ENTRADAOUSAIDA = (?) WHERE ID = (?)';
        return this.db.run(sql, [idProduto ,quantidade, isEntrada, id], callback);
    }
}

module.exports = DBConn