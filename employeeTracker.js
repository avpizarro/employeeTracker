const mysql = require("mysql");
const table = require("console.table");
const clear = require("clear");
const figlet = require("figlet");
const boxen = require("boxen");
const ask = require("./lib/ask");

const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Be sure to update with your own MySQL password!
  password: "password",
  database: "employeeTracker_db",
});

const text = figlet.textSync("Employee Traker", {
  horizontalLayout: "default",
  width: "50",
  whitespaceBreak: true,
});

const start = () => {
  clear();
  console.log(
    boxen(text, { padding: 1, borderStyle: "single", borderStyle: "classic" })
  );
  setTimeout(ask.ask, 500);
};

// const wholesale = new dep.Department("wholesale");

start();

//  Queries
// SELECT id, first_name, last_name FROM employees WHERE manager = 'Andrea Chez';
// SELECT employees.id, employees.first_name, employees.emp_role, roles.department , roles.salary FROM employees
// INNER JOIN roles ON employees.role_id = roles.id;
