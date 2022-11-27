var DBConn = require('../db-conn.js');
var dbConn = new DBConn();

class Estoque {
    constructor() {
        this.produto = 0;
        this.erros = [];
        this.quantidade = 0;
    }

    carregar(json){        
        this.id = json.id;
        this.produto = json.produto
        this.quantidade = json.quantidade;
    }

    validar() {
        this.erros = [];

        if (this.quantidade == undefined || this.quantidade == "") this.erros.push('Quantidade precisa ser maior que 0');

        return this.erros.length == 0;
    }    

    static buscarTodos(callback) {
        return dbConn.db.all('SELECT * FROM ESTOQUE', callback);
    }

    static getEstoqueById(id, callback) {
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
        QUANTIDADE = (?)
         WHERE ID = (?)`;

        var params = [this.produto,this.quantidade, this.id];
        return dbConn.db.run(sql, params, callback);
    } 

    createEstoque(produto,quantidade, id, callback) {
        var sql = `INSERT INTO ESTOQUE (IDPRODUTO, QUANTIDADE) VALUES ((?),(?),(?))`;

        var params = [produto,quantidade, id];
        return dbConn.db.run(sql, params, callback);
    }


    excluir(callback) {
        var sql = `DELETE FROM ESTOQUE  WHERE ID = (?)`;

        return dbConn.db.run(sql, this.id, callback);
    }  
    
    getQuantidadeEstoque(idestoque){
    return dbConn.db.get('SELECT QUANTIDADE FROM ESTOQUE WHERE ID = (?)',idestoque, callback.quantidade);    
    }

}

module.exports = Estoque