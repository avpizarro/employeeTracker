const mysql = require("mysql");
const table = require("console.table");
const inquirer = require("inquirer");
const ask = require("./ask");

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

// class Employee {
//     constructor()
// }

const viewEmployees = () => {
  connection.query("SELECT * FROM employees", (err, res) => {
    if (err) throw err;
    // Display a table with all employees data
    console.table(res);
  });
};

let manList = [];
let manListFull = [];
let manChoiceList = [];

const viewByManager = () => {
  connection.query("SELECT manager FROM employees", (err, res) => {
    if (err) throw err;
    // Display a table with all employees data
    manList.push(JSON.stringify(res));
    const parsed = JSON.parse(manList);
    for (let i = 0; i < parsed.length; i++)
      if (parsed[i].manager) {
        manListFull.push(parsed[i].manager);
      }
    manChoiceList = manListFull.filter(
      (item, index) => manListFull.indexOf(item) == index
    );
    console.log(manChoiceList);
    inquirer
      .prompt([
        {
          name: "manager",
          type: "list",
          message: "Which manager do you want to view employees for?",
          choices: manChoiceList,
        },
      ])
      .then((answer) => {
        connection.query(
          "SELECT * FROM employees WHERE ?",
          { manager: answer.manager },
          (err, res) => {
            if (err) throw err;
            console.log(`Showing ${answer.manager} employees`);
            console.table(res);
          }
        );
      });
  });
};


let employeeList = [];
let employeeChoicelist = [];

const deleteEmployee = (empToDelete) => {
  connection.query("SELECT first_name,last_name FROM employees", (err, res) => {
    if (err) throw err;
    employeeList.push(JSON.stringify(res));
    const parsed = JSON.parse(employeeList);
    for (let i = 0; i < parsed.length; i++)
      employeeChoicelist.push(
        (parsed[i].first_name + " ").concat(parsed[i].last_name)
      );
    console.log(employeeChoicelist);
    inquirer
      .prompt([
        {
          name: "employeeToDelete",
          type: "list",
          message: "Which employee do you want to delete?",
          choices: employeeChoicelist,
        },
      ])
      .then((answer) => {
        empToDelete = answer.employeeToDelete;
        const firstName = empToDelete.substr(0, empToDelete.indexOf(" "));
        const lastName = empToDelete.substr(empToDelete.indexOf(" ") + 1);
        connection.query(
          "DELETE FROM employees WHERE (first_name = ? AND last_name = ?)",
          [firstName, lastName],
          (err, res) => {
            if (err) throw err;
            console.log("Employee deleted");
          }
        );
      });
  });
};

const addEmployee = () => {
  // connection.query(
  //   "SELECT id FROM roles WHERE title = 'accountant' ",
  //   (err, res) => {
  //     if (err) throw err;
  //     roleID = JSON.parse(res);
  //     console.log(roleID[0]);
  //   }
  // );
  // connection.query(
  //   "SELECT id FROM employees WHERE first_name = 'Andrea' AND last_name = 'Chez' ",
  //   (err, res) => {
  //     if (err) throw err;
  //     managerID = res;
  //     console.log(managerID);
  //   }
  // );
  connection.query("INSERT INTO employees SET ?", {
    first_name: "AAA",
    last_name: "AAA",
    emp_role: "accountant",
    role_id: 10,
    manager: "Andrea Chez",
    manager_id: 46,
  });
  //   connection.end();
};

module.exports = {
  viewEmployees,
  viewByManager,
  deleteEmployee,
  addEmployee,
};
