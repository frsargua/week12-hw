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

const enquirerFunction = async () => {
  await inquirer.prompt(options).then((answer) => console.log(answer));
};

enquirerFunction();

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
