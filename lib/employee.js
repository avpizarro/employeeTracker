const mysql = require("mysql");
const table = require("console.table");

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

const deleteEmployee = () => {
  connection.query(
    "DELETE FROM employees WHERE ?",
    { first_name: "AAA" },
    (err, res) => {
      if (err) throw err;
      console.log("Employee deleted");
      viewEmployees();
      connection.end();
    }
  );
};


// const addEmployee = () => {
//     connection.query(
//       "SELECT id FROM roles WHERE title = 'accountant' ",
//       (err, res) => {
//         if (err) throw err;
//         roleID = JSON.parse(res);
//         console.log(roleID[0]);
//       }
//     );
//     connection.query(
//       "SELECT id FROM employees WHERE first_name = 'Andrea' AND last_name = 'Chez' ",
//       (err, res) => {
//         if (err) throw err;
//         managerID = res;
//         console.log(managerID);
//       }
//     );
//     connection.query("INSERT INTO employees SET ?", {
//       first_name: "AAA",
//       last_name: "AAA",
//       emp_role: "accountant",
//       role_id: 000,
//       manager: "Andrea Chez",
//       manager_id: 000,
//     });
//     connection.end();
//   };
  


module.exports = {
    viewEmployees,
    deleteEmployee, 
};