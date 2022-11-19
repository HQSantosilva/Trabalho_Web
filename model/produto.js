var DBConn = require('../db-conn.js');
var dbConn = new DBConn();
// var Participante = require('../model/participante')
// var Despesa = require('../model/despesa')


class Produto {

    constructor() {
        this.descricao = '';
        this.erros = [];
        this.preco = 0;
 
    }

    carregar(json){        
        this.id = json.id;
        this.descricao = json.descricao;
        this.preco = json.preco;  
    }

    validar() {
        this.erros = [];

        if (this.descricao == undefined || this.descricao == "") this.erros.push('Descrição em branco');
        else if (this.descricao.length < 3) this.erros.push('Descrição com menos de 3 caracteres');

        return this.erros.length == 0;
    }    

    static buscarTodos(callback) {
        return dbConn.db.all('SELECT * FROM PRODUTO', callback);
    }

    static buscarPeloId(id, callback) {
        return dbConn.db.get('SELECT * FROM PRODUTO WHERE id = (?)', id, callback);
    }

    salvar(callback) {
        if (this.id > 0) {
            this.atualizar(callback);
        } else {
            this.criar(callback);
        }
    }

    atualizar(callback) {
        var sql = `UPDATE PRODUTO 
            SET descricao = (?),
                preco = (?)
            WHERE ID = (?)`;

        var params = [this.descricao,this.preco, this.id];
        return dbConn.db.run(sql, params, callback);
    } 

    criar(callback) {
        var sql = `INSERT INTO PRODUTO (descricao,  preco)
        VALUES ((?),(?))`;

        var params = [this.nome];
        return dbConn.db.run(sql, params, callback);
    }    


    excluir(callback) {
        var sql = `DELETE FROM PRODUTO
        WHERE ID = (?)`;

        return dbConn.db.run(sql, this.id, callback);
    }      

}

module.exports = Produto