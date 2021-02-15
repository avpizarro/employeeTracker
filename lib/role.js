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

let depID = {};

const defineDepID = (data) => {

  const query = "SELECT id FROM departments WHERE ?";
  connection.query(query, { dep_name: data }, (err, res) => {
    if (err) throw err;
    depID =  JSON.stringify(res[0]);
    console.log(depID);
    connection.end();
  });
};

// defineDepID("design");

class Role {
  constructor(title, salary, department, department_id) {
    this.title = title;
    this.salary = salary;
    this.department = department;
    this.department_id = defineDepID(this.department);
  }
}

// const graphic_designer = new Role(
//   "graphic designer",
//   70000,
//   "design",
//   defineDepID("design"),
// );

// console.log(graphic_designer);

const viewRoles = () => {
  connection.query("SELECT * FROM roles", (err, res) => {
    if (err) throw err;
    // Display a table with all employees data
    console.table(res);
  });
};

const addRole = () => {
  connection.query(
    "INSERT INTO roles SET ?",
    {
      title: "graphic designer",
      salary: 60000,
      department: "marketing and sales",
      department_id: 1,
    },
    (err, res) => {
      if (err) throw err;
      console.log("New role added");
      viewRoles();
      connection.end();
    }
  );
};

let roleList = [];
let roleChoicelist = [];

const deleteRole = (roleToDelete) => {
  connection.query("SELECT title FROM roles", (err, res) => {
    if (err) throw err;
    roleList.push(JSON.stringify(res));
    const parsed = JSON.parse(roleList);
    for (let i = 0; i < parsed.length; i++) roleChoicelist.push(parsed[i].title);
    console.log(roleChoicelist);
    inquirer
      .prompt([
        {
          name: "roleToDelete",
          type: "list",
          message: "Which role do you want to delete?",
          choices: roleChoicelist,
        },
      ])
      .then((answer) => {
        roleToDelete = answer.roleToDelete;
        connection.query(
          "DELETE FROM roles WHERE ?",
          {title: roleToDelete},
          (err, res) => {
            if (err) throw err;
            console.log("Role deleted");
          }
        );
      });
  });
};

module.exports = {
  viewRoles,
  addRole,
  deleteRole,
  Role,
};
