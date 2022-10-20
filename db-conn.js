var sqlite3 = require('sqlite3');

class DBConn {

    constructor() {
        this.db = new sqlite3.Database('db/trabalhofinal.db');
        this.createTables();
    }

    getLastInsertRowId(callback) {
        return this.db.get('SELECT last_insert_rowid()', callback);
    }


    createTables() {
        var sql = `CREATE TABLE IF NOT EXISTS eventos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL)`;

        return this.db.run(sql);
    }

    createEvento(nome, callback) {
        var sql = 'INSERT INTO eventos (nome) VALUES (?)';
        return this.db.run(sql, [nome], callback);
    }

    updateEvento(id, nome, callback) {
        var sql = 'UPDATE eventos SET nome = (?) WHERE ID = (?)';
        return this.db.run(sql, [nome, id], callback);
    }

    GetEventoById(id, callback) {
        var sql = 'SELECT * FROM eventos WHERE ID = (?)';
        return this.db.get(sql, id, callback);
    }    

    findAllEventos(callback) {
        var sql = 'SELECT * FROM COMPRA';
        return this.db.all(sql, [], callback);
    }

    deleteEvento(id, callback) {
        var sql = 'DELETE FROM COMPRA WHERE ID = (?)';
        return this.db.run(sql, id, callback);
    }    

    createCompra(nome, callback) {
        var sql = 'INSERT INTO COMPRA (nome) VALUES (?)';
        return this.db.run(sql, [nome], callback);
    }

    /*updateCompra(id, nome, callback) {
        var sql = 'UPDATE COMPRA SET nome = (?) WHERE ID = (?)';
        return this.db.run(sql, [nome, id], callback);
    }*/

    GetCompraById(id, callback) {
        var sql = 'SELECT * FROM COMPRA WHERE ID = (?)';
        return this.db.get(sql, id, callback);
    }    

    findAllCompras(callback) {
        var sql = 'SELECT * FROM COMPRA';
        return this.db.all(sql, [], callback);
    }

    deleteCompra(id, callback) {
        var sql = 'DELETE FROM COMPRA WHERE ID = (?)';
        return this.db.run(sql, id, callback);
    }   
    
    createEstoque(nome, callback) {
        var sql = 'INSERT INTO COMPRA (nome) VALUES (?)';
        return this.db.run(sql, [nome], callback);
    }

    /*updateEstoque(id, nome, callback) {
        var sql = 'UPDATE COMPRA SET nome = (?) WHERE ID = (?)';
        return this.db.run(sql, [nome, id], callback);
    }*/

    GetEstoqueById(id, callback) {
        var sql = 'SELECT * FROM ESTOQUE WHERE ID = (?)';
        return this.db.get(sql, id, callback);
    }    

    findAllEstoques(callback) {
        var sql = 'SELECT * FROM ESTOQUE';
        return this.db.all(sql, [], callback);
    }

    deleteEstoque(id, callback) {
        var sql = 'DELETE FROM ESTOQUE WHERE ID = (?)';
        return this.db.run(sql, id, callback);
    }   
    
    createProduto(nome, callback) {
        var sql = 'INSERT INTO PRODUTO (nome) VALUES (?)';
        return this.db.run(sql, [nome], callback);
    }

    /*updateProduto(id, nome, callback) {
        var sql = 'UPDATE PRODUTO SET nome = (?) WHERE ID = (?)';
        return this.db.run(sql, [nome, id], callback);
    }*/

    GetProdutoById(id, callback) {
        var sql = 'SELECT * FROM PRODUTO WHERE ID = (?)';
        return this.db.get(sql, id, callback);
    }    

    findAllProdutos(callback) {
        var sql = 'SELECT * FROM PRODUTO';
        return this.db.all(sql, [], callback);
    }

    deleteProduto(id, callback) {
        var sql = 'DELETE FROM PRODUTO WHERE ID = (?)';
        return this.db.run(sql, id, callback);
    }     
    createReserva(nome, callback) {
        var sql = 'INSERT INTO RESERVA (nome) VALUES (?)';
        return this.db.run(sql, [nome], callback);
    }

    /*updateReserva(id, nome, callback) {
        var sql = 'UPDATE RESERVA SET nome = (?) WHERE ID = (?)';
        return this.db.run(sql, [nome, id], callback);
    }*/

    GetReservaById(id, callback) {
        var sql = 'SELECT * FROM RESERVA WHERE ID = (?)';
        return this.db.get(sql, id, callback);
    }    

    findAllReservas(callback) {
        var sql = 'SELECT * FROM RESERVA';
        return this.db.all(sql, [], callback);
    }

    deleteReserva(id, callback) {
        var sql = 'DELETE FROM RESERVA WHERE ID = (?)';
        return this.db.run(sql, id, callback);
    }    
}

module.exports = DBConn