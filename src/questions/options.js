import { db } from "../config/index.js";

export const options = [
  {
    name: "mainOptions",
    message: "OPTIONS:",
    type: "list",
    choices: [
      "View all departments",
      "View all roles",
      "View all employees",
      "Add a department",
      "Add a role",
      "Add an employee",
      "Update Employee role:",
      "QUIT",
    ],
  },
];

const getFromTableInDB = async (key, table) => {
  var sqlLit = `SELECT ${key} FROM week12.${table};
  `;
  const dataFromDB = await db.promise().query(sqlLit);
  let arrayOfResults = dataFromDB[0].map((index) => index[key]);
  return arrayOfResults;
};

export const convertValue = async (toVar, table, fromVar, value) => {
  let sqlLitCV = `SELECT ${toVar} FROM week12.${table} WHERE ${fromVar} = '${value}';
  `;
  const newValue = await db.promise().query(sqlLitCV);
  let arrayOfResults = newValue[0].map((index) => index[toVar]);
  // Returns the first value from the conversion
  return arrayOfResults[0];
};

async function arrayOfManagers() {
  const managersFromDB = await getFromTableInDB("first_name", "employee");
  managersFromDB.push("null");
  return managersFromDB;
}

//Questionnaire maker functions
export const createAddDepartmentQuestionnaire = async () => {
  const questArr = await [
    {
      name: "departmentName",
      message: "What is the name of the new department?",
      type: "input",
    },
  ];

  return questArr;
};
export const createNewRoleQuestionnaire = async () => {
  const questArr = await [
    {
      name: "Name",
      message: "Please enter the name of the new role!:",
      type: "input",
    },
    {
      name: "salary",
      message: "Please enter the salary for the role:",
      type: "input",
    },
    {
      name: "department",
      message: `"Please select the department:`,
      type: "list",
      choices: await getFromTableInDB("name", "deparment"),
    },
  ];

  return questArr;
};

export const createNewEmployeeQuestionnaire = async () => {
  const questArr = await [
    {
      name: "firstName",
      message: "Please enter the name of the new Employee!:",
      type: "input",
    },
    {
      name: "lastName",
      message: "Please enter the last name of the new Employee!:",
      type: "input",
    },
    {
      name: "roleTitle",
      message: `"Please select the role:`,
      type: "list",
      choices: await getFromTableInDB("title", "role"),
    },
    {
      name: "manager",
      message: `"Please select his/her manager:`,
      type: "list",
      default: "null",
      choices: await arrayOfManagers(),
    },
  ];
  return questArr;
};

export const createUpdateEmployeeQuestionnaire = async () => {
  const questArr = await [
    {
      name: "employee",
      message: "Select employee:",
      type: "list",
      choices: await getFromTableInDB("first_name", "employee"),
    },
    {
      name: "currentRole",
      message: "Choose the new role:",
      type: "list",
      choices: await getFromTableInDB("title", "role"),
    },
  ];
  return questArr;
};
