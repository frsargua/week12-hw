import { db } from "../config/index.js";
import { convertValue } from "./helpers.js";

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
