

var sqlite3 = require('sqlite3');

class DBConn {

    constructor() {
        this.db = new sqlite3.Database('db/dev.db');
    }

    createTables() {

        var sql =`CREATE TABLE IF NOT EXISTS PRODUTO (ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
            DESCRICAO VARCHAR (250) DEFAULT (0),
            preco DECIMAL NOT NULL DEFAULT (0),
            VALIDADE DATE DEFAULT (0) 
        );`;
        return this.db.run(sql);
    }

    getLastInsertRowId(callback) {
        return this.db.get('SELECT last_insert_rowid()', callback);
    }

    findAllProdutos(callback) {
        var sql = 'SELECT * FROM produtos';
        return this.db.all(sql, [], callback);
    }

    findAllProdutosDescric(descricao, callback) {
        var sql = 'SELECT * FROM produtos WHERE DESCRICAO LIKE (?)';
        return this.db.all(sql, [descricao + '%'], callback);
    }

    createProduto(descricao,preco, validade, callback) {
        var sql = 'INSERT INTO produtos (descricao,preco,validade) VALUES ((?),(?),(?))';
        return this.db.run(sql, [descricao,preco,validade], callback);
    }

    updateProdutos(id, descricao, preco,validade, callback) {
        var sql = 'UPDATE produtos SET descricao = (?),preco = (?),validade = (?) WHERE ID = (?)';
        return this.db.run(sql, [descricao,preco,validade, id], callback);
    }

    getProdutoById(id, callback) {
        var sql = 'SELECT * FROM produtos WHERE ID = (?)';
        return this.db.get(sql, id, callback);
    }    

    deleteProdutos(id, callback) {
        var sql = 'DELETE FROM produtos WHERE ID = (?)';
        return this.db.run(sql, id, callback);
    }    


}

module.exports = DBConn