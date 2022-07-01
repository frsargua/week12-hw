import express from "express";
import * as mysql from "mysql2";
import inquirer from "inquirer";
// Importing questions
import { options } from "./questions/options.js";

const app = express();
const PORT = process.env.PORT || 3002;

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
  },
  console.log(`Connected to the movies_db database.`)
);

//Quey statements
//Load table from DB
const loadtableFromDb = (table) => {
  db.query(`SELECT * FROM ${table}`, function (err, results) {
    console.log(results);
  });
};

//Add new department to DB
const addToDeparmentDB = (department) => {
  db.query(
    `INSERT INTO deparment (name)
  VALUES ("${department}");
`,
    function (err, results) {
      console.log(results);
    }
  );
};

//Add new role to role table in DB
const addtoRoleDB = (title, salary, deparment) => {
  db.query(
    `INSERT INTO role (title, salary, deparment_id)
  VALUES ("${title}","${salary}","${deparment}");
`,
    function (err, results) {
      console.log(results);
    }
  );
};

const enquirerFunction = async () => {
  await inquirer.prompt(options).then((answer) => console.log(answer));
};

// enquirerFunction();

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
