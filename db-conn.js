

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
            ID INTEGER NOT NULL PRIMARY KEY,
            IDPRODUTO INTEGER NOT NULL REFERENCES PRODUTO(ID),
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

    createProduto(descricao,preco, validade, callback) {
        var sql = 'INSERT INTO PRODUTO (descricao,preco,validade) VALUES ((?),(?),(?))';
        return this.db.run(sql, [descricao,preco,validade], callback);
    }

    updateProdutos(id, descricao, preco,validade, callback) {
        var sql = 'UPDATE PRODUTO SET descricao = (?),preco = (?),validade = (?) WHERE ID = (?)';
        return this.db.run(sql, [descricao,preco,validade, id], callback);
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
        var sql = 'INSERT INTO ESTOQUE (IDPRODUTO, QUANTIDADE, DATALOTE) VALUES ((?),(?),(?),(?))';
        return this.db.run(sql, [produto,quantidade, data], callback);
    }

    updateEstoque(produto,quantidade, data) {
        var sql = 'UPDATE ESTOQUE SET IDPRODUTO = (?),QUANTIDADE = (?), DATALOTE = (?) WHERE ID = (?)';
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



}

module.exports = DBConn