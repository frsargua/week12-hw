import express from "express";
import * as mysql from "mysql2";
import inquirer from "inquirer";
// Importing questions
import {
  options,
  newRoleQuestionaire,
  newEmployeeQuestionaire,
  updateEmployeeQuestionaire,
  convertValue,
} from "./questions/options.js";
import { async } from "rxjs";

let arrayFromKey;

const app = express();
const PORT = process.env.PORT || 3003;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    // MySQL username,
    user: "root",
    password: "47B66FQvaM!",
    database: "week12",
  }
  // console.log(`Connected to the movies_db database.`)
);

//Query statements
//Load table from DB
const loadtableFromDb = (table) => {
  db.query(`SELECT * FROM ${table}`, function (err, results) {
    console.table(results);
  });
};

//Add new department to DB
const addToDeparmentDB = (department) => {
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
const addtoRoleDB = async (title, salary, department_name) => {
  let department_id = await convertValue(
    "id",
    "deparment",
    "name",
    department_name
  );
  // console.log("YOur current value is: " + typeof department_id);
  let sqlLit = `INSERT INTO role (title, salary, deparment_id)
  VALUES ("${title}","${salary}",${department_id});
`;
  console.log(sqlLit);
  db.query(sqlLit, function (err, results) {
    console.log(results);
  });
};

//Add new employee to employee table in DB
const addtoEmployeeDB = async (firstName, lastName, role_name, manager_FN) => {
  let manager_id = await convertValue(
    "id",
    "employee",
    "first_name",
    manager_FN
  );
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
const updateEmployeeDB = async (employeeName, newRole) => {
  let currentEmployeeID = await convertValue(
    "id",
    "employee",
    "first_name",
    employeeName
  );
  console.log(currentEmployeeID);

  let role_id = await convertValue("id", "role", "title", newRole);
  console.log(role_id);

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

//Provide table
const getFromTableInDB = async (key, table) => {
  var sqlLit = `SELECT ${key} FROM week12.${table};
  `;
  const results = await db.promise().query(sqlLit);
  let arrayOfResults = results[0].map((index) => index[key]);
  return arrayOfResults;
};

//Creates question for inner inquirer
const createQuestion = async (key, table) => {
  const arrayOfChoices = await getFromTableInDB(key, table);

  const arrayObjects = [
    {
      name: "name",
      message: `"Please select the ${table}:`,
      type: "list",
      choices: arrayOfChoices,
    },
  ];
  console.log(arrayObjects);
  return arrayObjects;
};
// Enquirer function to start the app
const enquirerFunction = async () => {
  let verifier = true;
  while (verifier) {
    await inquirer.prompt(options).then(async (answer) => {
      switch (answer.mainOptions.toLowerCase()) {
        case "view all departments":
          console.log("hi");
          loadtableFromDb("deparment");
          console.log("hi");
          break;
        case "view all roles":
          console.log("hi");
          loadtableFromDb("role");
          console.log("hi");
          break;
        case "view all employees":
          loadtableFromDb("employee");
          break;
        case "add a department":
          await inquirer
            .prompt([
              {
                name: "deparmentName",
                message: "What is the name of the new department?",
                type: "input",
              },
            ])
            .then(async (answer) => {
              addToDeparmentDB(answer.deparmentName);
            });
          break;
        case "add a role":
          await inquirer.prompt(newRoleQuestionaire).then(async (answer) => {
            const newRole = Object.values(answer);
            addtoRoleDB(newRole[0], newRole[1], newRole[2]);
          });

          break;
        case "add an employee":
          await inquirer
            .prompt(newEmployeeQuestionaire)
            .then(async (answer) => {
              const newEmployee = Object.values(answer);
              console.log(newEmployee);
              addtoEmployeeDB(
                newEmployee[0],
                newEmployee[1],
                newEmployee[2],
                newEmployee[3]
              );
            });
          break;
        case "update employee role:":
          await inquirer
            .prompt(updateEmployeeQuestionaire)
            .then(async (answer) => {
              const updatedEmployee = Object.values(answer);
              console.log(updatedEmployee);
              updateEmployeeDB(updatedEmployee[0], updatedEmployee[1]);
            });
        case "quit":
          verifier = false;
          break;
      }
    });
  }
  return;
};

enquirerFunction();

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
