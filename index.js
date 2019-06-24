#!/usr/bin/env node
const inquirer = require("inquirer");
const chalk = require("chalk");
const figlet = require("figlet");
const shell = require("shelljs");
const fs = require("fs");
const macroController = require("./macros/macroControler");
const macroRouter = require("./macros/macroRouter");
const config = require("./config/config");
const conexaoSetting = require("./config/conexao");
const macroDb = require("./macros/macroDb");

const DIR_ROOT = process.cwd();

//Cria estas três pastas:
shell.mkdir("-p", "controllers");
shell.mkdir("-p", "routes");
shell.mkdir("-p", "config");

const init = () => {
  console.log(
    chalk.green(
      figlet.textSync("API  REST - TX", {
        horizontalLayout: "default",
        verticalLayout: "default"
      })
    )
  );
};

const createFile = filename => {
  const filePath = `${DIR_ROOT}/${filename}.js`;
  shell.touch(filePath);
  return filePath;
};

const success = (filepath, mensagem) => {
  console.table([mensagem, filepath]);
};

const run = async () => {
  // Mostra o texto introdutório
  init();

  const result = await conexaoSetting.init();

  //Cria o arquivo de configuração
  fs.writeFile("config/db.js", macroDb.criarMacroBancoDeDados(result), function(
    err
  ) {
    if (err) {
      return console.log(err);
    }
    console.log("Rota Salva!");
  });

  macroDb
    .conectar(
      result.HOST,
      result.USER,
      result.PASSWORD,
      result.DBNAME,
      result.PORT
    )
    .then(conn => {
      const rows = conn.execute("show tables;");
      rows
        .then(elem => {

          let tableArr = [];

          for (let table of elem[0]) {
            tableArr.push(table.Tables_in_node);
          }

          let arr = [
            {
              type: "list",
              name: "tabelas",
              message: "\nEscolha uma tabela:",
              choices: tableArr
            }
          ];

          inquirer.prompt(arr).then(answers => {

            let table = answers.tabelas;

            let NOME_API = table;

            //Cria o controller:
            let controllerName = `controller${config.jsUcfirst(NOME_API)}`;
            const controller = createFile("controllers/" + controllerName);
            success(controller, "Controller Criado com sucesso em: ");

            //Cria a rota:
            let routeName = `route${config.jsUcfirst(NOME_API)}`;
            const rota = createFile("routes/" + routeName);
            success(rota, "Rota criada com sucesso em: ");

            fs.writeFile(
              "routes/" + routeName + ".js",
              macroRouter.criarMacro(NOME_API),
              function(err) {
                if (err) {
                  return console.log(err);
                }
                console.log(chalk.white.bgGreen.bold("Rota Salva!"));
              }
            );

            const linhas = conn.query(`SHOW COLUMNS FROM ${table};`);

            linhas
              .then(dtable => {
                fs.writeFile(
                  "controllers/" + controllerName + ".js",
                  macroController.criarMacro(table, dtable),
                  function(err) {
                    if (err) {
                      return console.log(err);
                    }
                    console.log(chalk.white.bgGreen.bold("Controller salvo!"));
                    shell.exit(0);
                  }
                );
              })
              .catch(err => {
                console.log("error!", err);
                throw err;
              });
          });
        })
        .catch(err => {
          console.log("error!", err);
          throw err;
        });

    })
    .catch(err => {
      console.log("error!", err);
      throw err;
    });
};

run();
