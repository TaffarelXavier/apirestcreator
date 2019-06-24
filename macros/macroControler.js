const Config = require("../config/config");

module.exports = {
  criarMacro(table, arrTable) {
    let nomeTabela = table;

    let tableAsSingular = Config.removeLastCharacter(nomeTabela);

    let content = `
    const dbConn = require('../config/db');\n
    module.exports = {
        tableName: "${nomeTabela}",
        getTableName() {
          return this.tableName;
        },
        setTableName(tableName) {
          this.tableName = tableName;
          return;
        },`;
    content += `count() {
          return dbConn.query(`;

    content += "`SELECT COUNT(*) FROM ${this.tableName};`,";
    content += `(error, results, fields) => {
              if (error) throw error;
              return res.send({
                error: false,
                data: results,
                message: "count"
              });
            }
          );
        },`;
    content += `findAll${Config.jsUcfirst(nomeTabela)}(res) {
          return dbConn.query(`;
    content += "`SELECT * FROM ${this.getTableName()};`,";
    content += `(error, results, fields) => {
              if (error) throw error;
              return res.send({
                error: false,
                data: results,
                message: "findall"
              });
            }
          );
        },
        find${Config.jsUcfirst(tableAsSingular)}Id(res, ${tableAsSingular}_id) {
          return dbConn.query(`;
    content += "`SELECT * FROM ${this.getTableName()} where id = ?`,";
    content += `  ${tableAsSingular}_id,
            (error, results, fields) => {
              if (error) throw error;
              return res.send({
                error: false,
                data: results[0],
                message: "find"
              });
            }
          );
        },delete(res, req){`;
    content += "dbConn.query(";
    content += "`DELETE FROM ${this.getTableName()} WHERE id = ?`,";
    content += `[id],
          function(error, results, fields) {
            if (error) throw error;
            return res.send({
              error: false,
              data: results.affectedRows,
              message: "delete"
            });
          }
        );},`;

    //Incluir: Create
    content +=
      "create(res, user) {" +
      "dbConn.query(`INSERT INTO ${this.tableName} SET ?`, ";

    content += "{";

    arrTable[0].forEach((element, i) => {
  
      if (i > 0) {
        if (i == 1) {
          //Não inclui updated_at.
          content += `${element.Field + ":" + element.Field}`;
        } else if (element.Field == "created_at") {
          content += `,${element.Field + ": Date.now()"}`;
        } else if (element.Field != "updated_at") {
          //Não inclui updated_at.
          content += `,${element.Field + ":" + element.Field}`;
        }
      }
    });
    content += `},
      function (error, results, fields) {
        if (error) throw error;
        return res.json({
          error: false,
          data: results.insertId,
          message: "create"
        });
      }); },update(res, req){

        var arr = Object.values(req);`;

    content += "conn.query(";
    content += "`UPDATE servicos SET ";

    /*ser_condicoes_recebimento = ?, ser_defeito_constatado = ?, ser_observacoes = ?,
            ser_status_servico_fk_id = ?, ser_cor = ?, ser_modelo_fk_id = ?, ser_foto = ?, 
            ser_fonte_imagem = ?, ser_data_modificacao = ?, ser_valor_servico = ?,
            ser_situacao_pagamento = ?, ser_marca = ?, ser_cliente_fk_id = ?,
            ser_forma_pagamento = ? WHERE ser_id = ?;`,*/

    content += "`";
    content += `,arr,
          function (error, results) {`;
    content += "if (error) return res.json(`${error}`);";
    content += `return res.json(results);
          }
        );
      }}`;

    return content;
  }
};
