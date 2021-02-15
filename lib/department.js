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

class Department {
  constructor(dep_name) {
    this.dep_name = dep_name;
  }
}

const wholesale = new Department("wholesale");

const viewDepartments = () => {
  connection.query("SELECT * FROM departments", (err, res) => {
    if (err) throw err;
    // Display a table with all departments data
    console.table(res);
    // connection.end();
  });
};

const addDepartment = (newDep) => {
  inquirer
    .prompt([
      {
        name: "dep_name",
        type: "input",
        message: "What is the new department name?",
      },
    ])
    .then((answer) => {
      newDep = answer.dep_name;
      connection.query(
        "INSERT INTO departments SET ?",
        { dep_name: newDep },
        (err, res) => {
          if (err) throw err;
          console.log("New department added");
        }
      );
    });
};

let depList = [];
let list = [];

const deleteDepartment = (depToDelete) => {
  connection.query("SELECT dep_name FROM departments", (err, res) => {
    if (err) throw err;
    depList.push(JSON.stringify(res));
    const parsed = JSON.parse(depList);
    for (let i = 0; i < parsed.length; i++) list.push(parsed[i].dep_name);
    console.log(list);
    inquirer
      .prompt([
        {
          name: "depToDelete",
          type: "list",
          message: "Which department do you want to delete?",
          choices: list,
        },
      ])
      .then((answer) => {
        depToDelete = answer.depToDelete;
        connection.query(
          "DELETE FROM departments WHERE ?",
          {dep_name : depToDelete},
          (err, res) => {
            if (err) throw err;
            console.log("Department deleted");
          }
        );
      });
  });
};

module.exports = {
  viewDepartments,
  addDepartment,
  deleteDepartment,
  Department,
};
