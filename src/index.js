import express from "express";
import * as mysql from "mysql2";
import inquirer from "inquirer";

// Importing questions
import {
  options,
  createAddDepartmentQuestionnaire,
  createNewRoleQuestionnaire,
  createNewEmployeeQuestionnaire,
  createUpdateEmployeeQuestionnaire,
  convertValue,
} from "./questions/options.js";

const app = express();
const PORT = process.env.PORT || 3007;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  // MySQL username,
  user: "root",
  password: "47B66FQvaM!",
  database: "week12",
});

//Query statements
//Load table from DB
const loadTableFromDb = async (table) => {
  db.query(`SELECT * FROM ${table}`, function (err, results) {
    console.table(results);
  });
};

//Add new department to DB
const addToDepartmentDB = async (department) => {
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
const addToRoleDB = async (title, salary, department_name) => {
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
const addToEmployeeDB = async (firstName, lastName, role_name, manager_FN) => {
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
const updateEmployeeDB = async (employeeName, newRole) => {
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

// Enquirer function to start the app
const enquirerFunction = async () => {
  let verifier = true;
  while (verifier) {
    await inquirer.prompt(options).then(async (answer) => {
      switch (answer.mainOptions.toLowerCase()) {
        case "view all departments":
          loadTableFromDb("deparment");
          break;
        case "view all roles":
          loadTableFromDb("role");
          break;
        case "view all employees":
          loadTableFromDb("employee");
          break;
        case "add a department":
          const addDepartmentQuestionnaire =
            await createAddDepartmentQuestionnaire();
          await inquirer
            .prompt(addDepartmentQuestionnaire)
            .then(async (answer) => {
              addToDepartmentDB(answer.departmentName);
            });
          break;
        case "add a role":
          const newRoleQuestionnaire = await createNewRoleQuestionnaire();
          await inquirer.prompt(newRoleQuestionnaire).then(async (answer) => {
            const newRole = Object.values(answer);
            addToRoleDB(newRole[0], newRole[1], newRole[2]);
          });

          break;
        case "add an employee":
          const newEmployeeQuestionnaire =
            await createNewEmployeeQuestionnaire();
          await inquirer
            .prompt(newEmployeeQuestionnaire)
            .then(async (answer) => {
              const newEmployee = Object.values(answer);
              console.log(newEmployee);
              addToEmployeeDB(
                newEmployee[0],
                newEmployee[1],
                newEmployee[2],
                newEmployee[3]
              );
            });
          break;
        case "update employee role:":
          const UpdateEmployeeQuestionnaire =
            await createUpdateEmployeeQuestionnaire();
          await inquirer
            .prompt(UpdateEmployeeQuestionnaire)
            .then(async (answer) => {
              const updatedEmployee = Object.values(answer);
              updateEmployeeDB(updatedEmployee[0], updatedEmployee[1]);
            });
          break;
        case "quit":
          verifier = false;
          break;
      }
    });
  }
  server.close((err) => {
    console.log("Questionnaire closed");
    process.exit(err ? 1 : 0);
  });
};

// Run functions upon start
enquirerFunction();

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

var server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
