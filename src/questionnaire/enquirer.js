import inquirer from "inquirer";

import {
  // db,
  options,
  createAddDepartmentQuestionnaire,
  createNewRoleQuestionnaire,
  createNewEmployeeQuestionnaire,
  createUpdateEmployeeQuestionnaire,
} from "./questions.js";

//Importing functions for enquirer
import { printTableFromDB } from "../utils/helpers.js";
import { updateEmployeeDB } from "../utils/update.js";
import {
  addToDepartmentDB,
  addToRoleDB,
  addToEmployeeDB,
} from "../utils/add.js";

// Enquirer function to start the app
export const enquirerFunction = async (server) => {
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
              // if (newEmployee[3] == "none") {
              //   newEmployee[3] = newEmployee[1];
              // }
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
