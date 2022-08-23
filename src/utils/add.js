import { db } from "../config/index.js";
import { convertValue } from "./helpers.js";

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
