import { db } from "../config/index.js";
import * as cTable from "console.table";
import { convertValue } from "../questions/options.js";

//Query statements
//Load table from DB
export const printTableFromDB = async (table) => {
  let sqlLit = `SELECT * FROM deparment`;
  if (table == "role") {
    sqlLit =
      "SELECT week12.role.id, week12.role.title, week12.role.salary, week12.deparment.name FROM week12.role JOIN week12.deparment ON week12.role.deparment_id = week12.deparment.id;";
  } else if (table == "employee") {
    sqlLit =
      "SELECT week12.employee.first_name, week12.employee.last_name, role.title, role.salary,week12.deparment.name, COALESCE(CONCAT(week12.B.first_name,' ', week12.B.last_name),'Manager') AS manager FROM week12.employee JOIN role ON week12.employee.role_id=week12.role.id LEFT JOIN week12.deparment ON week12.role.deparment_id = week12.deparment.id LEFT JOIN week12.employee B ON week12.employee.manager_id = week12.B.id ;";
  }
  const [rows] = await db.promise().query(sqlLit);
  console.log(cTable.getTable(rows));
};

//Add new department to DB
export const addToDepartmentDB = async (department) => {
  db.query(
    `INSERT INTO deparment (name)
    VALUES ("${department}");
  `,
    function (err, results) {
      console.log("Successfully added!");
    }
  );
};

//Add new role to role table in DB
export const addToRoleDB = async (title, salary, department_name) => {
  let department_id = await convertValue(
    "id",
    "deparment",
    "name",
    department_name
  );
  let sqlLit = `INSERT INTO role (title, salary, deparment_id)
    VALUES ("${title}","${salary}",${department_id});
  `;

  db.query(sqlLit, function (err, results) {
    console.log(results);
  });
};

//Add new employee to employee table in DB
export const addToEmployeeDB = async (
  firstName,
  lastName,
  role_name,
  manager_FN
) => {
  let manager_id;
  if (manager_FN !== "null") {
    manager_id = await convertValue("id", "employee", "first_name", manager_FN);
  } else {
    manager_id = manager_FN;
  }
  let role_id = await convertValue("id", "role", "title", role_name);

  db.query(
    `INSERT INTO employee (first_name, last_name, role_id,manager_id)
    VALUES ("${firstName}","${lastName}","${role_id}",${manager_id});
  `,
    function (err, results) {
      console.log(results);
    }
  );
};

//Update employee in the employee table from the DB
export const updateEmployeeDB = async (employeeName, newRole) => {
  let currentEmployeeID = await convertValue(
    "id",
    "employee",
    "first_name",
    employeeName
  );

  let role_id = await convertValue("id", "role", "title", newRole);

  db.query(
    `UPDATE employee
      SET role_id = ${role_id}
      WHERE id = ${currentEmployeeID};
  `,
    function (err, results) {
      console.log(results);
    }
  );
};
