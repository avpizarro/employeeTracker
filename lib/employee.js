const mysql = require("mysql");
const table = require("console.table");
const inquirer = require("inquirer");
const ask = require("./ask");
const { viewDepartmentBudget } = require("./department");

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

// viewDepartmentBudget();

let roleList = [];
let roleChoicelist = [];

const updateEmpRole = () => {
  connection.query("SELECT first_name,last_name FROM employees", (err, res) => {
    if (err) throw err;
    employeeList.push(JSON.stringify(res));
    const parsed = JSON.parse(employeeList);
    for (let i = 0; i < parsed.length; i++)
      employeeChoicelist.push(
        (parsed[i].first_name + " ").concat(parsed[i].last_name)
      );
    console.log(employeeChoicelist);
    connection.query("SELECT title FROM roles", (err, res) => {
      if (err) throw err;
      roleList.push(JSON.stringify(res));
      const parsed = JSON.parse(roleList);
      for (let i = 0; i < parsed.length; i++)
        roleChoicelist.push(parsed[i].title);
      console.log(roleChoicelist);
      inquirer
        .prompt([
          {
            name: "employeeChoice",
            type: "list",
            message: "Which employee do you want to update the role for?",
            choices: employeeChoicelist,
          },
          {
            name: "newRole",
            type: "list",
            message: "What is the new role?",
            choices: roleChoicelist,
          },
        ])
        .then((answer) => {
          employeeChoice = answer.employeeChoice;
          const firstName = employeeChoice.substr(
            0,
            employeeChoice.indexOf(" ")
          );
          const lastName = employeeChoice.substr(
            employeeChoice.indexOf(" ") + 1
          );
          connection.query(
            "UPDATE employees SET (emp_role = ?, role_id = ?) WHERE (first_name = ? AND last_name = ?)",
            [answer.newRole, firstName, lastName],
            (err, res) => {
              if (err) throw err;
              console.log("Role updated");
            }
          );
        });
    });
  });
};

let empId;

async function selectEmpID(employeeName) {
  const name = employeeName.substr(0, employeeName.indexOf(" "));
  const surname = employeeName.substr(employeeName.indexOf(" ") + 1);
  connection.query(
    "SELECT id FROM employees WHERE (first_name = ? AND last_name = ?)",
    [name, surname],
    (err, res) => {
      if (err) throw err;
      empId = parseInt(JSON.parse(JSON.stringify(res))[0].id);
      return empId;
    }
  );
}

const updateEmpManager = () => {
  connection.query("SELECT first_name,last_name FROM employees", (err, res) => {
    if (err) throw err;
    employeeList.push(JSON.stringify(res));
    const parsed = JSON.parse(employeeList);
    for (let i = 0; i < parsed.length; i++)
      employeeChoicelist.push(
        (parsed[i].first_name + " ").concat(parsed[i].last_name)
      );
    connection.query("SELECT manager FROM employees", (err, res) => {
      if (err) throw err;
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
            name: "employeeChoice",
            type: "list",
            message: "Which employee do you want to update the manager for?",
            choices: employeeChoicelist,
          },
          {
            name: "manager",
            type: "list",
            message: "Who would be the new manager?",
            choices: manChoiceList,
          },
        ])
        .then((answer) => {
          employeeChoice = answer.employeeChoice;
          const firstName = employeeChoice.substr(
            0,
            employeeChoice.indexOf(" ")
          );
          const lastName = employeeChoice.substr(
            employeeChoice.indexOf(" ") + 1
          );
          const update = async () => {
            try {
              await selectEmpID(answer.manager);
            } catch (err) {
              throw err;
            } finally {
              connection.query(
                "UPDATE employees SET manager = ?, manager_id = ? WHERE (first_name = ? AND last_name = ?)",
                [answer.manager, empId, firstName, lastName],
                (err, res) => {
                  if (err) throw err;
                  console.log(empId);
                  console.log("Manager updated");
                }
              );
            }
          };
          update();
        });
    });
  });
};

// updateEmpManager();

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
  connection.query("INSERT INTO employees SET ?", {
    first_name: "Example",
    last_name: "Example",
    emp_role: "accountant",
    role_id: 10,
    manager: "Andrea Chez",
    manager_id: 46,
  });
  console.log("Employee added");
};

module.exports = {
  viewEmployees,
  viewByManager,
  updateEmpRole,
  deleteEmployee,
  addEmployee,
  updateEmpManager,
};
