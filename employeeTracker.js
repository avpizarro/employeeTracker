// Dependencies
const mysql = require("mysql");
const table = require("console.table");
const clear = require("clear");
const figlet = require("figlet");
const boxen = require("boxen");
const ask = require("./lib/ask");

// Create the connection
const connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  password: "password",
  database: "employeeTracker_db",
});

// Set the initial text
const text = figlet.textSync("Employee Traker", {
  horizontalLayout: "default",
  width: "50",
  whitespaceBreak: true,
});

// Define the function that starts the app
const start = () => {
  clear();
  console.log(
    boxen(text, { padding: 1, borderStyle: "single", borderStyle: "classic" })
  );
  setTimeout(ask.ask, 500);
};

// Call the start function
start();

