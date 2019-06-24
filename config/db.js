const mysql2 = require('mysql2');

// connection configurations
const dbConn = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'chkdsk',
    database: 'node',
    port:3306,
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

module.exports = dbConn;