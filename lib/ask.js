// Require dependencies
const mysql = require("mysql");
const inquirer = require("inquirer");
const figlet = require("figlet");

// Create connection
const connection = mysql.createConnection({
  host: "localhost",

  // Define port 3306
  port: 3306,

  // Define user
  user: "root",

  // Add mysql password and database to use
  password: "password",
  database: "employeeTracker_db",
});

// Set the questions and use inquirer to ask
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
    // Add the actions to perform according to the user's answer
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

// Add department function
const addDepartment = (newDep) => {
  // Ask for the new department name
  inquirer
    .prompt([
      {
        name: "dep_name",
        type: "input",
        message: "What is the new department name?",
      },
    ])
    // Insert the new department into the departments table
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

// Add Role function
const addRole = () => {
  // Query to get all the departments so the user can choose one for the new role
  let depList = [];
  let depChoicelist = [];
  connection.query("SELECT dep_name FROM departments", (err, res) => {
    if (err) throw err;
    depList.push(JSON.stringify(res));
    const parsed = JSON.parse(depList);
    for (let i = 0; i < parsed.length; i++)
      depChoicelist.push(parsed[i].dep_name);
      // Get teh user input
    inquirer
      .prompt([
        {
          name: "title",
          type: "input",
          message: "What is this new role's title?",
        },
        {
          name: "salary",
          type: "input",
          message: "What is the salary for this position?",
        },
        {
          name: "department",
          type: "list",
          message: "Choose the department this position belongs to:",
          choices: depChoicelist,
        },
      ])
      .then((answer) => {
        // Get the departement id to include in the new role data
        let depID;
        connection.query(
          "SELECT id FROM departments WHERE dep_name = ?",
          answer.department,
          (err, res) => {
            if (err) throw err;
            depID = parseInt(JSON.parse(JSON.stringify(res))[0].id);
            // Insert new role data into roles table
            connection.query(
              "INSERT INTO roles SET ?",
              {
                title: answer.title,
                salary: answer.salary,
                department: answer.department,
                department_id: depID,
              },
              (err, res) => {
                if (err) throw err;
                console.log("New role added");
                // Prompt for next action
                ask();
              }
            );
          }
        );
      });
  });
};

// Add employee function
const addEmployee = () => {
  // Queries to get the list of roles and managers to choose from for the new employee
  let roleList = [];
  let roleChoicelist = [];
  let manList = [];
  let manListFull = [];
  let manChoiceList = [];
  connection.query("SELECT title FROM roles", (err, res) => {
    if (err) throw err;
    roleList.push(JSON.stringify(res));
    const parsed = JSON.parse(roleList);
    for (let i = 0; i < parsed.length; i++)
      roleChoicelist.push(parsed[i].title);
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
      // Get the user input
      inquirer
        .prompt([
          {
            name: "first_name",
            type: "input",
            message: "What is the new employee's first name?",
          },
          {
            name: "last_name",
            type: "input",
            message: "What is the new employee's last name?",
          },
          {
            name: "role",
            type: "list",
            message: "What is the new employee's role?",
            choices: roleChoicelist,
          },
          {
            name: "manager",
            type: "list",
            message: "Who is the new employee's manager?",
            choices: manChoiceList,
          },
        ])
        .then((answer) => {
          // Query to get the chosen role id to add to the new employee data
          let roleID;
          connection.query(
            "SELECT id FROM roles WHERE title = ?",
            answer.role,
            (err, res) => {
              if (err) throw err;
              roleID = parseInt(JSON.parse(JSON.stringify(res))[0].id);
              // Query to get the chosen manager id to add to the new employee data
              let empId;
              const name = answer.manager.substr(
                0,
                answer.manager.indexOf(" ")
              );
              const surname = answer.manager.substr(
                answer.manager.indexOf(" ") + 1
              );
              connection.query(
                "SELECT id FROM employees WHERE (first_name = ? AND last_name = ?)",
                [name, surname],
                (err, res) => {
                  if (err) throw err;
                  empId = parseInt(JSON.parse(JSON.stringify(res))[0].id);
                  // Insert new employee data into the employees table
                  connection.query("INSERT INTO employees SET ?", {
                    first_name: answer.first_name,
                    last_name: answer.last_name,
                    emp_role: answer.role,
                    role_id: roleID,
                    manager: answer.manager,
                    manager_id: empId,
                  });
                  // Confirm that the new employee has been added
                  console.log("Employee added");
                  // Prompt for next action
                  ask();
                }
              );
            }
          );
        });
    });
  });
};

// Function to view all departments
const viewDepartments = () => {
  connection.query("SELECT * FROM departments", (err, res) => {
    if (err) throw err;
    // Display a table with all departments data
    console.table(res);
    // Prompt for next action
    ask();
  });
};

// Function to view all roles
const viewRoles = () => {
  connection.query("SELECT * FROM roles", (err, res) => {
    if (err) throw err;
    // Display a table with all roles data
    console.table(res);
    // Prompt for next action
   ask();
  });
};

// Function to view all Employees with their salary and department they belong to
const viewEmployees = () => {
  connection.query(
    "SELECT employees.id, employees.first_name, employees.last_name, employees.emp_role, roles.salary, roles.department, employees.manager FROM employees INNER JOIN roles ON employees.emp_role = roles.title",
    (err, res) => {
      if (err) throw err;
      // Display a table with all employees data
      console.table(res);
      // Prompt for next action
      ask();
    }
  );
};

// Function to update the role of an employee
const updateEmpRole = () => {
  // MySQL queries to get display the employees and the roles to choose from for the user
  let roleList = [];
  let roleChoicelist = [];
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
    connection.query("SELECT title FROM roles", (err, res) => {
      if (err) throw err;
      roleList.push(JSON.stringify(res));
      const parsed = JSON.parse(roleList);
      for (let i = 0; i < parsed.length; i++)
        roleChoicelist.push(parsed[i].title);
        // Get the user answers
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
          // Separate the first name from the surname so they can each be added to the correct employees table column
          employeeChoice = answer.employeeChoice;
          const firstName = employeeChoice.substr(
            0,
            employeeChoice.indexOf(" ")
          );
          const lastName = employeeChoice.substr(
            employeeChoice.indexOf(" ") + 1
          );
          // Query to get the new role correct id
          let roleID;
          connection.query(
            "SELECT id FROM roles WHERE title = ?",
            answer.newRole,
            (err, res) => {
              if (err) throw err;
              roleID = parseInt(JSON.parse(JSON.stringify(res))[0].id);
              // Query to update the employee role in the employees table
              connection.query(
                "UPDATE employees SET emp_role = ?, role_id = ? WHERE (first_name = ? AND last_name = ?)",
                [answer.newRole, roleID, firstName, lastName],
                (err, res) => {
                  if (err) throw err;
                  // Confirm that the new role has been added
                  console.log("Role updated");
                  // Prompt user to select another action
                  ask();
                }
              );
            }
          );
        });
    });
  });
};

// Function to update an employee's manager
const updateEmpManager = () => {
  // Query to get all employees so the user can choose who the change is for
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
      // Query to get all the managers the user can choose from
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
      // Ask and get the user answers regarding the manager change
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
          // Separate the employee first and last name so it can be added to the relevant column
          employeeChoice = answer.employeeChoice;
          const firstName = employeeChoice.substr(
            0,
            employeeChoice.indexOf(" ")
          );
          const lastName = employeeChoice.substr(
            employeeChoice.indexOf(" ") + 1
          );
          // Separate the manager first and last name to run a query to get the manager id to add to the employee data
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
            // Query to update the employee manager in the employees table
              connection.query(
                "UPDATE employees SET manager = ?, manager_id = ? WHERE (first_name = ? AND last_name = ?)",
                [answer.manager, empId, firstName, lastName],
                (err, res) => {
                  if (err) throw err;
                  // Confirm that the manager has been updated
                  console.log("Manager updated");
                  // Prompt next action
                  ask();
                }
              );
            }
          );
        });
    });
  });
};

// Display all the employees for a selected manager
const viewByManager = () => {
  // Get the list of managers
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
      // Filter the manager's list to remove duplicates
    manChoiceList = manListFull.filter(
      (item, index) => manListFull.indexOf(item) == index
    );
    // Ask the user to pick a manager
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
        // Query to display all employees for the selected manager
        connection.query(
          "SELECT * FROM employees WHERE ?",
          { manager: answer.manager },
          (err, res) => {
            if (err) throw err;
            console.log(`Showing ${answer.manager} employees`);
            console.table(res);
            // Prompt next action
            ask();
          }
        );
      });
  });
};

// Function to delete a selected department
const deleteDepartment = (depToDelete) => {
  // Get the department list
  let depList = [];
  let depChoicelist = [];
  connection.query("SELECT dep_name FROM departments", (err, res) => {
    if (err) throw err;
    depList.push(JSON.stringify(res));
    const parsed = JSON.parse(depList);
    for (let i = 0; i < parsed.length; i++)
      depChoicelist.push(parsed[i].dep_name);
      // Get the user to select a department form the deaprtments list
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
        // Use an mysql query to delete the department from the departments table
        depToDelete = answer.depToDelete;
        connection.query(
          "DELETE FROM departments WHERE ?",
          { dep_name: depToDelete },
          (err, res) => {
            if (err) throw err;
            // Confirm that the department was deleted
            console.log("Department deleted");
            // Prompt user to select another action
            ask();
          }
        );
      });
  });
};

// Function to select and delete a role 
const deleteRole = (roleToDelete) => {
  // Get the list of roles
  let roleList = [];
  let roleChoicelist = [];
  connection.query("SELECT title FROM roles", (err, res) => {
    if (err) throw err;
    roleList.push(JSON.stringify(res));
    const parsed = JSON.parse(roleList);
    for (let i = 0; i < parsed.length; i++)
      roleChoicelist.push(parsed[i].title);
      // Ask the user to select the role they want to remove
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
        // Use the user answer to run a query that removes the selected role from the roles table
        roleToDelete = answer.roleToDelete;
        connection.query(
          "DELETE FROM roles WHERE ?",
          { title: roleToDelete },
          (err, res) => {
            if (err) throw err;
            // Confirm the role removal
            console.log("Role deleted");
            // Prompt user to select another action
            ask();
          }
        );
      });
  });
};

// Function to choose an employee by name and remove it from the employees table
const deleteEmployee = (empToDelete) => {
  // Get a list of employees to choose from
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
      // Use inquirer to ask the user to select an employee
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
        // Separate first and last name in user answer to run a query to delete the selected employee from the employees table
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

// Function to select a department and view its budget (total salary expenses)
const viewDepartmentBudget = () => {
  // Get the department list
  let depList;
  let dep_name = [];
  connection.query("SELECT dep_name FROM departments", (err, res) => {
    if (err) throw err;
    depList = JSON.parse(JSON.stringify(res));
    for (let i = 0; i < depList.length; i++) dep_name.push(depList[i].dep_name);
    // Ask the user to select a department with inquirer
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
        // Join the employees and roles tables to get the Sum of all salaries for the selected department
        connection.query(
          "SELECT department, SUM(salary) FROM employees INNER JOIN roles ON employees.emp_role = roles.title WHERE department = ?",
          answer.department,
          (err, res) => {
            if (err) throw err;
            // Display a table with the total
            console.table(res);
            // Prompt user to select another action
            ask();
          }
        );
      });
  });
};

// Function to exit the app 
const exit = () => {
  connection.end();
  console.log(figlet.textSync("THE END"));
};

// Export the function that stars the questions for the user 
module.exports = { ask };
