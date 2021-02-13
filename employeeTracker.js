// const mysql = require("mysql");
// const inquirer = require("inquirer");
// const table = require("console.table");
const clear = require("clear");
const figlet = require("figlet");
const boxen = require("boxen");

clear();
const text = figlet.textSync("Employee Traker", {
  horizontalLayout: "default",
  width: "50",
  whitespaceBreak: true,
});

console.log(
  boxen(text, { padding: 1, borderStyle: "single", borderStyle: "classic" })
);
