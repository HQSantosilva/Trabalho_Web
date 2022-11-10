var DBConn = require('../db-conn.js');
var dbConn = new DBConn();

class Estoque {
    constructor() {
        this.produto = '';
        this.erros = [];
        this.data = DATE;
        this.quantidade = 0;
    }

    carregar(json){        
        this.id = json.id;
        this.produto = json.produto
        this.quantidade = json.quantidade;
        this.data = json.validade; 
    }

    validar() {
        this.erros = [];

        if (this.quantidade == undefined || this.quantidade == "") this.erros.push('Quantidade precisa ser maior que 0');

        return this.erros.length == 0;
    }    

    static buscarTodos(callback) {
        return dbConn.db.all('SELECT * FROM ESTOQUE', callback);
    }

    static buscarPeloId(id, callback) {
        return dbConn.db.get('SELECT * FROM ESTOQUE WHERE id = (?)', id, callback);
    }

    salvar(callback) {
        if (this.id > 0) {
            this.atualizar(callback);
        } else {
            this.criar(callback);
        }
    }

    atualizar(callback) {
        var sql = `UPDATE ESTOQUE
        SET IDPRODUTO = (?),
        QUANTIDADE = (?),
         DATALOTE = (?)
         WHERE ID = (?)`;

        var params = [this.produto,this.quantidade,this.data, this.id];
        return dbConn.db.run(sql, params, callback);
    } 

    criar(callback) {
        var sql = `INSERT INTO ESTOQUE (IDPRODUTO, QUANTIDADE, DATALOTE) VALUES ((?),(?),(?),(?))`;

        var params = [this.produto,this.quantidade,this.data, this.id];
        return dbConn.db.run(sql, params, callback);
    }    


    excluir(callback) {
        var sql = `DELETE FROM ESTOQUE  WHERE ID = (?)`;

        return dbConn.db.run(sql, this.id, callback);
    }      

}

module.exports = Produto