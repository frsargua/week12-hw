import express from "express";
import { enquirerFunction } from "./src/questionnaire/enquirer.js";

const app = express();
const PORT = process.env.PORT || 3008;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Run functions upon start
enquirerFunction();

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

var server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
