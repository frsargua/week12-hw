import { db } from "../config/index.js";
import * as cTable from "console.table";

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

export const convertValue = async (toVar, table, fromVar, value) => {
  let sqlLitCV = `SELECT ${toVar} FROM week12.${table} WHERE ${fromVar} = '${value}';
  `;
  const newValue = await db.promise().query(sqlLitCV);
  let arrayOfResults = newValue[0].map((index) => index[toVar]);
  // Returns the first value from the conversion
  return arrayOfResults[0];
};

export async function arrayOfManagers() {
  const managersFromDB = await getFromTableInDB("first_name", "employee");
  managersFromDB.push("null");
  return managersFromDB;
}

export const getFromTableInDB = async (key, table) => {
  var sqlLit = `SELECT ${key} FROM week12.${table};
  `;
  const dataFromDB = await db.promise().query(sqlLit);
  let arrayOfResults = dataFromDB[0].map((index) => index[key]);
  return arrayOfResults;
};
