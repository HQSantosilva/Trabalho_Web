

var sqlite3 = require('sqlite3');

class DBConn {

    constructor() {
        this.db = new sqlite3.Database('db/dev.db');
    }

    createTables() {

        var sql =`CREATE TABLE IF NOT EXISTS PRODUTO (
            ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
            DESCRICAO VARCHAR (250) DEFAULT (0),
            PRECO DECIMAL NOT NULL DEFAULT (0)
        );
        CREATE TABLE IF NOT EXISTS ESTOQUE (
            ID INTEGER NOT NULL PRIMARY KEY,
            IDPRODUTO INTEGER NOT NULL REFERENCES PRODUTO(ID),
            QUANTIDADE INTEGER NULL
        );
        CREATE TABLE IF NOT EXISTS MOVIMENTACAO (
            ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
            IDESTOQUE INTEGER NOT NULL REFERENCES ESTOQUE(ID),
            QUANTIDADE INTEGER NOT NULL,
            ENTRADAOUSAIDA BIT NOT NULL
        );
        `;
        return this.db.run(sql);
    }

    getLastInsertRowId(callback) {
        return this.db.get('SELECT last_insert_rowid()', callback);
    }

    findAllProdutos(callback) {
        var sql = 'SELECT * FROM PRODUTO';
        return this.db.all(sql, [], callback);
    }

    findAllProdutosDescric(descricao, callback) {
        var sql = 'SELECT * FROM PRODUTO WHERE DESCRICAO LIKE (?)';
        return this.db.all(sql, [descricao + '%'], callback);
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
        var sql = 'SELECT * FROM PRODUTO WHERE ID = (?)';
        return this.db.get(sql, id, callback);
    }    

    deleteProdutos(id, callback) {
        var sql = 'DELETE FROM PRODUTO WHERE ID = (?)';
        return this.db.run(sql, id, callback);
    }    

    findAllEstoques(callback) {
        var sql = 'SELECT * FROM ESTOQUE';
        return this.db.all(sql, [], callback);
    }

    findAllEstoquesDados(descricao, callback) {
        var sql = 'SELECT * FROM ESTOQUE WHERE IDPRODUTO LIKE (?)';
        return this.db.all(sql, [descricao + '%'], callback);
    }

    createEstoque(produto,quantidade, data) {
        var sql = 'INSERT INTO ESTOQUE (IDPRODUTO, QUANTIDADE) VALUES ((?),(?),(?),(?))';
        return this.db.run(sql, [produto,quantidade, data], callback);
    }

    updateEstoque(produto,quantidade, data) {
        var sql = 'UPDATE ESTOQUE SET IDPRODUTO = (?),QUANTIDADE = (?) WHERE ID = (?)';
        return this.db.run(sql, [produto,quantidade,  data], callback);
    }

    getEstoqueById(id, callback) {
        var sql = 'SELECT * FROM ESTOQUE WHERE ID = (?)';
        return this.db.get(sql, id, callback);
    }    

    deleteEstoque(id, callback) {
        var sql = 'DELETE FROM ESTOQUE WHERE ID = (?)';
        return this.db.run(sql, id, callback);
    }    

    findAllMovimentacoes(callback) {
        var sql = 'SELECT * FROM MOVIMENTACAO';
        return this.db.all(sql, [], callback);
    }

    createMovimentacao(estoque,quantidade, entradasaida) {
        var sql = 'INSERT INTO MOVIMENTACAO (IDPRODUTO,QUANTIDADE,ENTRADAOUSAIDA) VALUES ((?),(?),(?),(?))';
        return this.db.run(sql, [estoque,quantidade, entradasaida], callback);
    }
}

module.exports = DBConn