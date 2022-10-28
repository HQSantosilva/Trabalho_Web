var DBConn = require('../db-conn.js');
var dbConn = new DBConn();
// var Participante = require('../model/participante')
// var Despesa = require('../model/despesa')


class Produto {

    constructor() {
        this.descricao = '';
        this.erros = [];
        this.validade = DATE;
        this.preco = 0;
 
    }

    carregar(json){        
        this.id = json.id;
        this.descricao = json.descricao;
        this.validade = json.validade;
        this.preco = json.preco;
        //this.totalPago = json.totalPago;
        //this.totalRecebido = json.totalRecebido;
        //this.totalEmAberto = json.totalEmAberto;       
    }

    validar() {
        this.erros = [];

        if (this.descricao == undefined || this.descricao == "") this.erros.push('Descrição em branco');
        else if (this.descricao.length < 3) this.erros.push('Descrição com menos de 3 caracteres');

        return this.erros.length == 0;
    }    

    static buscarTodos(callback) {
        return dbConn.db.all('SELECT * FROM produtos', callback);
    }

    static buscarPeloId(id, callback) {
        return dbConn.db.get('SELECT * FROM produtos WHERE id = (?)', id, callback);
    }

    salvar(callback) {
        if (this.id > 0) {
            this.atualizar(callback);
        } else {
            this.criar(callback);
        }
    }

    atualizar(callback) {
        var sql = `UPDATE produtos 
            SET descricao = (?),
                preco = (?),
                validade = (?)
            WHERE ID = (?)`;

        var params = [this.descricao,this.validade,this.preco, this.id];
        return dbConn.db.run(sql, params, callback);
    } 

    criar(callback) {
        var sql = `INSERT INTO produtos (descricao, validade, preco)
        VALUES ((?),(?),(?))`;

        var params = [this.nome];
        return dbConn.db.run(sql, params, callback);
    }    


    excluir(callback) {
        var sql = `DELETE FROM produtos
        WHERE ID = (?)`;

        return dbConn.db.run(sql, this.id, callback);
    }      

}

module.exports = Produto