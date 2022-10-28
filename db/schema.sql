CREATE TABLE IF NOT EXISTS produtos (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    descricao          TEXT    NOT NULL,
    preco     DECIMAL NOT NULL
                          DEFAULT (0),
    validade DATE NOT NULL
                          DEFAULT (0)
);
-- CREATE TABLE IF NOT EXISTS estoqueitens (
--     id           INTEGER PRIMARY KEY AUTOINCREMENT,
--     descricao STRING  NOT NULL,
--     quantidade      NUMERIC    UNIQUE
--                          NOT NULL
--     email        STRING  UNIQUE
--                          NOT NULL,
--     chavePIX     STRING
-- );
-- CREATE TABLE IF NOT EXISTS participante_evento (
--     idEvento       INTEGER REFERENCES eventos (id) ON DELETE NO ACTION
--                                                    ON UPDATE NO ACTION
--                                                    MATCH SIMPLE
--                            NOT NULL,
--     idParticipante INTEGER REFERENCES participantes (id) ON DELETE NO ACTION
--                                                          ON UPDATE NO ACTION
--                                                          MATCH SIMPLE
--                            NOT NULL,
--     totalPago      DECIMAL NOT NULL
--                            DEFAULT (0),
--     totalRecebido  DECIMAL NOT NULL
--                            DEFAULT (0),
--     totalEmAberto  DECIMAL NOT NULL
--                            DEFAULT (0),
--     CONSTRAINT PK_Participante_Evento PRIMARY KEY (
--         idEvento,
--         idParticipante
--     )
-- );
-- CREATE TABLE IF NOT EXISTS despesas (
--     id             INTEGER PRIMARY KEY AUTOINCREMENT,
--     idEvento       INTEGER REFERENCES eventos (id) 
--                            NOT NULL,
--     idParticipante         REFERENCES participantes (id) 
--                            NOT NULL,
--     descricao      STRING  NOT NULL,
--     valor          DECIMAL NOT NULL,
--     FOREIGN KEY (
--         idEvento,
--         idParticipante
--     )
--     REFERENCES participante_evento (idEvento,
--     idParticipante) 
-- );
-- CREATE TABLE IF NOT EXISTS pagamentos (
--     id                      INTEGER PRIMARY KEY AUTOINCREMENT
--                                     NOT NULL,
--     idEvento                INTEGER REFERENCES eventos (id) 
--                                     NOT NULL,
--     idParticipanteRecebedor INTEGER REFERENCES participantes (id) 
--                                     NOT NULL,
--     idParticipantePagador   INTEGER REFERENCES participantes (id) 
--                                     NOT NULL,
--     valor                   DECIMAL NOT NULL,
--     status                  STRING  NOT NULL
