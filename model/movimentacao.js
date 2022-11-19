var DBConn = require('../db-conn.js');
const Estoque = require('./estoque.js');
var dbConn = new DBConn();

class Movimentacao {
    constructor() {
        this.estoque = 0;
        this.erros = [];
        this.quantidade = 0;
        this.entradasaida = false;
    }

    carregar(json){        
        this.id = json.id;
        this.estoque = json.estoque;
        this.quantidade = json.quantidade;
        this.entradasaida = json.entradasaida;
    }

    validar() {
        this.erros = [];
        quantidadeestoque = Estoque.getQuantidadeEstoque;
        if (quantidadeestoque -this.quantidade < 0)
            this.erros.push('A quantidade a ser removida do estoque não pode ser menor que 0');

        return this.erros.length == 0;
    }    

    static buscarTodos(callback) {
        return dbConn.db.all('SELECT * FROM MOVIMENTACAO', callback);
    }

    salvar(callback) {
        if (this.id > 0) {
            this.atualizar(callback);
        } else {
            this.criar(callback);
        }
    }

    criar(callback) {
        valormovimentacao = 0;
        switch(this.entradasaida){
            case true:
                valormovimentacao = 1;
                break
            case false:
                valormovimentacao = 0;
        }
        var sql = `INSERT INTO MOVIMENTACAO (IDESTOQUE, QUANTIDADE,ENTRADAOUSAIDA) VALUES ((?),(?),(?))`;

        var params = [this.produto,this.quantidade,valormovimentacao, this.id];
        return dbConn.db.run(sql, params, callback);
    }     

}

module.exports = Movimentacao