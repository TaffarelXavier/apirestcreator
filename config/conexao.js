#!/usr/bin/env node
const inquirer = require("inquirer");

function validar(value) {
  if (/\w/.test(value.trim())) {
    return true;
  }
  return "Por favor digite um valor válido.";
}

module.exports = {
  init() {
    let arr = [
      {
        name: "HOST",
        type: "input",
        message: "HOST:",
        default: "localhost",
        validate: validar
      },
      {
        name: "USER",
        type: "input",
        default: "root",
        message: "USER:",
        validate: validar
      },
      {
        name: "PORT",
        type: "number",
        default: 3306,
        message: "PORT:"
      },
      {
        name: "DBNAME",
        type: "input",
        default: "node",
        message: "DBNAME:",
        validate: validar
      },
      {
        name: "PASSWORD",
        type: "password",
        default: "chkdsk",
        mask: '*',
        message: "PASSWORD:"
      }
    ];

    return inquirer.prompt(arr);
  }
};
