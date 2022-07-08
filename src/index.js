import express from "express";
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

//Importing functions for enquirer
import {
  printTableFromDB,
  addToDepartmentDB,
  addToRoleDB,
  addToEmployeeDB,
  updateEmployeeDB,
} from "./utils/helpers.js";

const app = express();
const PORT = process.env.PORT || 3008;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Enquirer function to start the app
const enquirerFunction = async () => {
  let verifier = true;
  while (verifier) {
    await inquirer.prompt(options).then(async (answer) => {
      switch (answer.mainOptions.toLowerCase()) {
        case "view all departments":
          await printTableFromDB("deparment");
          break;
        case "view all roles":
          await printTableFromDB("role");
          break;
        case "view all employees":
          await printTableFromDB("employee");
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
