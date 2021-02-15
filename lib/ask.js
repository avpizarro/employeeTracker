const mysql = require("mysql");
const inquirer = require("inquirer");
const dep = require("./department");
const rol = require("./role");
const emp = require("./employee");

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

const ask = () => {
  inquirer
    .prompt([
      {
        name: "action",
        type: "list",
        message: "What do you want to do?",
        choices: [
          "Add department",
          "Add role",
          "Add employee",
          "View departments",
          "View roles",
          "View employees",
          "Update employee role",
          "Update employee manager",
          "View employees by manager",
          "Delete department",
          "Delete role",
          "Delete employee",
          "View department budget",
          "Exit",
        ],
      },
    ])
    .then((answer) => {
      switch (answer.action) {
        case "Add department":
          dep.addDepartment();
          break;
        case "Add role":
          rol.addRole();
          break;
        case "Add employee":
          emp.addEmployee();
          break;
        case "View departments":
          dep.viewDepartments();
          break;
        case "View roles":
          rol.viewRoles();
          break;
        case "View employees":
          emp.viewEmployees();
          break;
        case "Update employee role":
            emp.updateEmpRole();
          break;
        case "Update employee manager":
          emp.updateEmpManager();
          break;
        case "View employees by manager":
          emp.viewByManager();
          break;
        case "Delete department":
          dep.deleteDepartment();
          break;
        case "Delete role":
          rol.deleteRole();
          break;
        case "Delete employee":
          emp.deleteEmployee();
          break;
        case "View department budget":
        //   dep.viewDepartmentBudget();
          break;
        case "Exit":
          exit();
          break;
      }
    });
};

const askAgain = () => {
  setTimeout(ask, 500);
};

const exit = () => {
  connection.end();
  console.log(figlet.textSync("THE END"));
};

module.exports = { ask, askAgain };
