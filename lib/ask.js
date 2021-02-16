const mysql = require("mysql");
const inquirer = require("inquirer");
const figlet = require("figlet");

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
          addDepartment();
          break;
        case "Add role":
          addRole();
          break;
        case "Add employee":
          addEmployee();
          break;
        case "View departments":
          viewDepartments();
          break;
        case "View roles":
          viewRoles();
          break;
        case "View employees":
          viewEmployees();
          break;
        case "Update employee role":
          updateEmpRole();
          break;
        case "Update employee manager":
          updateEmpManager();
          break;
        case "View employees by manager":
          viewByManager();
          break;
        case "Delete department":
          deleteDepartment();
          break;
        case "Delete role":
          deleteRole();
          break;
        case "Delete employee":
          deleteEmployee();
          break;
        case "View department budget":
          viewDepartmentBudget();
          break;
        case "Exit":
          exit();
          break;
      }
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
          ask();
        }
      );
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
      ask();
    }
  );
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
  ask();
};

const viewDepartments = () => {
  connection.query("SELECT * FROM departments", (err, res) => {
    if (err) throw err;
    console.table(res);
    ask();
  });
};

const viewRoles = () => {
  connection.query("SELECT * FROM roles", (err, res) => {
    if (err) throw err;
    // Display a table with all employees data
    console.table(res);
    ask();
  });
};

const viewEmployees = () => {
  connection.query("SELECT * FROM employees", (err, res) => {
    if (err) throw err;
    // Display a table with all employees data
    console.table(res);
    ask();
  });
};

const updateEmpRole = () => {
  let roleList = [];
  let roleChoicelist = [];
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
              ask();
            }
          );
        });
    });
  });
};

async function selectEmpID(employeeName) {
  let empId;
  const name = employeeName.substr(0, employeeName.indexOf(" "));
  const surname = employeeName.substr(employeeName.indexOf(" ") + 1);
  connection.query(
    "SELECT id FROM employees WHERE (first_name = ? AND last_name = ?)",
    [name, surname],
    (err, res) => {
      if (err) throw err;
      empId = parseInt(JSON.parse(JSON.stringify(res))[0].id);
      console.log(empId);
    }
  );
}

const updateEmpManager = () => {
  let employeeList = [];
  let employeeChoicelist = [];
  connection.query("SELECT first_name,last_name FROM employees", (err, res) => {
    if (err) throw err;
    employeeList.push(JSON.stringify(res));
    const parsed = JSON.parse(employeeList);
    for (let i = 0; i < parsed.length; i++)
      employeeChoicelist.push(
        (parsed[i].first_name + " ").concat(parsed[i].last_name)
      );
    connection.query("SELECT manager FROM employees", (err, res) => {
      let manList = [];
      let manListFull = [];
      let manChoiceList = [];
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
          let empId;
          const name = answer.manager.substr(0, answer.manager.indexOf(" "));
          const surname = answer.manager.substr(
            answer.manager.indexOf(" ") + 1
          );
          connection.query(
            "SELECT id FROM employees WHERE (first_name = ? AND last_name = ?)",
            [name, surname],
            (err, res) => {
              if (err) throw err;
              empId = parseInt(JSON.parse(JSON.stringify(res))[0].id);
              connection.query(
                "UPDATE employees SET manager = ?, manager_id = ? WHERE (first_name = ? AND last_name = ?)",
                [answer.manager, empId, firstName, lastName],
                (err, res) => {
                  if (err) throw err;
                  console.log("Manager updated");
                  ask();
                }
              );
            }
          );
        });
    });
  });
};

const viewByManager = () => {
  let manList = [];
  let manListFull = [];
  let manChoiceList = [];
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
            ask();
          }
        );
      });
  });
};

const deleteDepartment = (depToDelete) => {
  let depList = [];
  let depChoicelist = [];
  connection.query("SELECT dep_name FROM departments", (err, res) => {
    if (err) throw err;
    depList.push(JSON.stringify(res));
    const parsed = JSON.parse(depList);
    for (let i = 0; i < parsed.length; i++)
      depChoicelist.push(parsed[i].dep_name);
    console.log(depChoicelist);
    inquirer
      .prompt([
        {
          name: "depToDelete",
          type: "list",
          message: "Which department do you want to delete?",
          choices: depChoicelist,
        },
      ])
      .then((answer) => {
        depToDelete = answer.depToDelete;
        connection.query(
          "DELETE FROM departments WHERE ?",
          { dep_name: depToDelete },
          (err, res) => {
            if (err) throw err;
            console.log("Department deleted");
            ask();
          }
        );
      });
  });
};

const deleteRole = (roleToDelete) => {
  let roleList = [];
  let roleChoicelist = [];
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
          { title: roleToDelete },
          (err, res) => {
            if (err) throw err;
            console.log("Role deleted");
            ask();
          }
        );
      });
  });
};

const deleteEmployee = (empToDelete) => {
  let employeeList = [];
  let employeeChoicelist = [];
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
            ask();
          }
        );
      });
  });
};

const viewDepartmentBudget = () => {
  let depList;
  let dep_name = [];
  connection.query("SELECT dep_name FROM departments", (err, res) => {
    if (err) throw err;
    depList = JSON.parse(JSON.stringify(res));
    console.log(depList);
    for (let i = 0; i < depList.length; i++) dep_name.push(depList[i].dep_name);
    console.log(dep_name);
    inquirer
      .prompt([
        {
          name: "department",
          type: "list",
          message: "Which department do you want to view the budget for?",
          choices: dep_name,
        },
      ])
      .then((answer) => {
        connection.query(
          "SELECT department, SUM(salary) FROM employees INNER JOIN roles ON employees.emp_role = roles.title WHERE department = ?",
          answer.department,
          (err, res) => {
            if (err) throw err;
            console.table(res);
            ask();
          }
        );
      });
  });
};

const exit = () => {
  connection.end();
  console.log(figlet.textSync("THE END"));
};

module.exports = { ask };
