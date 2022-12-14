--
-- File generated with SQLiteStudio v3.3.3 on dom nov 27 22:20:16 2022
--
-- Text encoding used: System
--
PRAGMA foreign_keys = off;
BEGIN TRANSACTION;

-- Table: ESTOQUE
CREATE TABLE ESTOQUE (ID INTEGER NOT NULL PRIMARY KEY, IDPRODUTO INTEGER NOT NULL REFERENCES PRODUTO (ID), QUANTIDADE INTEGER);

-- Table: MOVIMENTACAO
CREATE TABLE MOVIMENTACAO (ID INTEGER PRIMARY KEY NOT NULL, IDESTOQUE INTEGER REFERENCES ESTOQUE (ID) NOT NULL, QUANTIDADE INTEGER NOT NULL, ENTRADAOUSAIDA BIT (1) NOT NULL);
INSERT INTO MOVIMENTACAO (ID, IDESTOQUE, QUANTIDADE, ENTRADAOUSAIDA) VALUES (1, 1251, 150, 'ENTRADA');
INSERT INTO MOVIMENTACAO (ID, IDESTOQUE, QUANTIDADE, ENTRADAOUSAIDA) VALUES (2, 1251, 150, 'ENTRADA');
INSERT INTO MOVIMENTACAO (ID, IDESTOQUE, QUANTIDADE, ENTRADAOUSAIDA) VALUES (3, 1251, 100, 'ENTRADA');
INSERT INTO MOVIMENTACAO (ID, IDESTOQUE, QUANTIDADE, ENTRADAOUSAIDA) VALUES (4, 1251, 100, 'ENTRADA');
INSERT INTO MOVIMENTACAO (ID, IDESTOQUE, QUANTIDADE, ENTRADAOUSAIDA) VALUES (5, 1251, 100, 'ENTRADA');
INSERT INTO MOVIMENTACAO (ID, IDESTOQUE, QUANTIDADE, ENTRADAOUSAIDA) VALUES (6, 1251, 100, 'ENTRADA');
INSERT INTO MOVIMENTACAO (ID, IDESTOQUE, QUANTIDADE, ENTRADAOUSAIDA) VALUES (7, 1251, 100, 'ENTRADA');
INSERT INTO MOVIMENTACAO (ID, IDESTOQUE, QUANTIDADE, ENTRADAOUSAIDA) VALUES (8, 1251, 150, 'ENTRADA');
INSERT INTO MOVIMENTACAO (ID, IDESTOQUE, QUANTIDADE, ENTRADAOUSAIDA) VALUES (9, 1251, 100, 'ENTRADA');
INSERT INTO MOVIMENTACAO (ID, IDESTOQUE, QUANTIDADE, ENTRADAOUSAIDA) VALUES (10, 1251, 100, 'ENTRADA');
INSERT INTO MOVIMENTACAO (ID, IDESTOQUE, QUANTIDADE, ENTRADAOUSAIDA) VALUES (11, 1251, 100, 'ENTRADA');
INSERT INTO MOVIMENTACAO (ID, IDESTOQUE, QUANTIDADE, ENTRADAOUSAIDA) VALUES (12, 1251, 100, 'ENTRADA');
INSERT INTO MOVIMENTACAO (ID, IDESTOQUE, QUANTIDADE, ENTRADAOUSAIDA) VALUES (13, 1251, 100, 'ENTRADA');

-- Table: PRODUTO
CREATE TABLE PRODUTO (ID INTEGER NOT NULL PRIMARY KEY, DESCRICAO VARCHAR (250) DEFAULT (0), PRECO DECIMAL NOT NULL DEFAULT (0));
INSERT INTO PRODUTO (ID, DESCRICAO, PRECO) VALUES (1, 'teste', 10);
INSERT INTO PRODUTO (ID, DESCRICAO, PRECO) VALUES (2, 'test', 12);

COMMIT TRANSACTION;
PRAGMA foreign_keys = on;
