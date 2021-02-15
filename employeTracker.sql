DROP DATABASE IF EXISTS employeeTracker_db;

CREATE DATABASE employeeTracker_db;

USE employeeTracker_db;

CREATE TABLE employees (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NULL,
  last_name VARCHAR(30) NULL,
  emp_role VARCHAR(30) NULL,
  role_id INT NOT NULL,
  manager_id INT NULL,
  PRIMARY KEY (id),
);

CREATE TABLE roles(
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary INT NOT NULL,
  department VARCHAR(30) NOT NULL,
  department_id INT NOT NULL,
  PRIMARY KEY (id),
);

CREATE TABLE departments (
  id INT NOT NULL AUTO_INCREMENT,
  dep_name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);
  

ALTER TABLE employees
ADD FOREIGN KEY (role_id) REFERENCES roles(id);

ALTER TABLE roles
ADD FOREIGN KEY (department_id) REFERENCES departments(id);

INSERT INTO departments (dep_name)
VALUES ("marketing and sales"),
("production"),
("design"),
("logistics"),
("finance");

INSERT INTO roles (title, salary, department, department_id)
VALUES ("general manager", 200000, "finance", (SELECT id FROM departments WHERE dep_name="finance")),
("creative director", 150000, "design", (SELECT id FROM departments WHERE dep_name="design")),
("designer", 80000, "design", (SELECT id FROM departments WHERE dep_name="design")),
("design assistant", 50000, "design", (SELECT id FROM departments WHERE dep_name="design")),
("garment technician", 70000, "design", (SELECT id FROM departments WHERE dep_name="design")),
("warehouse manager", 100000, "logistics", (SELECT id FROM departments WHERE dep_name="logistics")),
("warehouse assistant", 45000, "logistics", (SELECT id FROM departments WHERE dep_name="logistics")),
("production manager", 120000, "production", (SELECT id FROM departments WHERE dep_name="production")),
("production coordinator", 80000, "production", (SELECT id FROM departments WHERE dep_name="production")),
("accountant", 120000, "finance", (SELECT id FROM departments WHERE dep_name="finance")),
("marketing director", 120000, "marketing", (SELECT id FROM departments WHERE dep_name="marketing and sales")),
("customer service officer", 45000, "marketing and sales", (SELECT id FROM departments WHERE dep_name="marketing and sales")),
("retail assistant", 55000, "marteting and sales", (SELECT id FROM departments WHERE dep_name="marketing and sales"));

  

INSERT INTO employees (first_name, last_name, emp_role, role_id, manager, manager_id)
VALUES("Andrea", "Chez", "general manager", (SELECT id FROM roles WHERE title="general manager"
),  NULL, NULL),
("Donna", "Strickland", "creative director", (SELECT id FROM roles WHERE title="creative director"
), "Andrea Chez", (SELECT id FROM employees WHERE first_name="Andrea" AND last_name="Chez")),
("Maria", "Goeppert Mayer", "designer", (SELECT id FROM roles WHERE title="designer"), "Donna Strickland", (SELECT id FROM employees WHERE first_name="Donna" AND last_name="Strickland")),
("Marie", "Curie", "designer assistant", (SELECT id FROM roles WHERE title="design assistant"), "Maria Goeppert Mayer", (SELECT id FROM employees WHERE first_name="Maria" AND last_name="Goeppert Mayer")),
("Emmanuelle", "Charpentier", "garment technician", (SELECT id FROM roles WHERE title="garment technician"), "Maria Goeppert Mayer", (SELECT id FROM employees WHERE first_name="Maria" AND last_name="Goeppert Mayer")),
("Jennifer", "Doudna", "warehouse manager", (SELECT id FROM roles WHERE title="warehouse manager"), "Andrea Chez", (SELECT id FROM employees WHERE first_name="Andrea" AND last_name="Chez")),
("Frances", "Arnold", "warehouse assistant", (SELECT id FROM roles WHERE title="warehouse assistant"), "Jennifer Arnold", (SELECT id FROM employees WHERE first_name="Jennifer" AND last_name="Arnold")),
("Ada", "Yonath", "production manager", (SELECT id FROM roles WHERE title="production manager"), "Andrea Chez", (SELECT id FROM employees WHERE first_name="Andrea" AND last_name="Chez")),
("Dorothy", "Crowfoot Hodgkin", "production coordinator", (SELECT id FROM roles WHERE title="production coordinator"), "Ada Yonath", (SELECT id FROM employees WHERE first_name="Ada" AND last_name="Yonath")),
("Irene", "Joliot-Curie", "accountant", (SELECT id FROM roles WHERE title="accountant"), "Andrea Chez", (SELECT id FROM employees WHERE first_name="Andrea" AND last_name="Chez")),
("Tu", "Youyou", "marketing director", (SELECT id FROM roles WHERE title="marketing director"), "Andrea Chez", (SELECT id FROM employees WHERE first_name="Andrea" AND last_name="Chez")),
("May-Britt", "Moser", "customer service officer", (SELECT id FROM roles WHERE title=c"ustomer service officer"), "Tu Youyou", (SELECT id FROM employees WHERE first_name="Tu" AND last_name="Youyou")),
("Elizabeth", "Blackburn", "retail assistant", (SELECT id FROM roles WHERE title="retail assistant", "Tu Youyou", (SELECT id FROM employees WHERE first_name="Tu" AND last_name="Youyou")),
("Carol", "Greider", "customer service officer", (SELECT id FROM roles WHERE title="customer service officer"), "Tu Youyou", (SELECT id FROM employees WHERE first_name="Tu" AND last_name="Youyou")),
("Francoise", "Barre-Sinoussi", "retail assistant", (SELECT id FROM roles WHERE title="retail assistant"), "Tu Youyou", (SELECT id FROM employees WHERE first_name="Tu" AND last_name="Youyou"));


