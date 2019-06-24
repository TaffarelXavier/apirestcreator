const mysql2 = require("mysql2/promise");
module.exports = {
  conn: null,
  /**
   *
   * @param {*} host
   * @param {*} user
   * @param {*} password
   * @param {*} database
   * @param {*} port
   */
  async conectar(host, user, password, database, port = 3306) {
    try {
      // connection configurations
      const dbConn = await mysql2.createConnection({
        host: host,
        user: user,
        password: password,
        database: database,
        port: port,
        multipleStatements: true
      });

      // connect to database
      dbConn.connect(function(err) {
        if (err) {
          console.error(
            "Erro ao tentar conectar-se ao banco de dados:\n" + err.stack
          );
          return;
        }
      });

      //   const [rows, fields] = await dbConn.query("show tables;");

      //   let tableArr = [];

      //   for (let table of rows) {
      //     tableArr.push(table.Tables_in_node);
      //   }
      this.conn = dbConn;
      return dbConn;
    } catch (error) {
      return error;
    }
  },
  criarMacroBancoDeDados(_CONN) {
    let content = `const mysql2 = require('mysql2');

// connection configurations
const dbConn = mysql2.createConnection({
    host: '${_CONN.HOST}',
    user: '${_CONN.USER}',
    password: '${_CONN.PASSWORD}',
    database: '${_CONN.DBNAME}',
    port:${_CONN.PORT},
    multipleStatements: true,
});

// connect to database
dbConn.connect(function(err) {
  if (err) {
    console.error(
      "Erro ao tentar conectar-se ao banco de dados:" + err.stack
    );
    return;
  }
});

module.exports = dbConn;`;

    return content;
  }
};
