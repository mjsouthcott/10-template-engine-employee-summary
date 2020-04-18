const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```

const team = [];

// Define validation functions
function containsNumber(string) {
  return /\d/.test(string);
}

function containsLetter(string) {
  return /[a-z]/i.test(string);
}

function containsSpecialChar(string) {
  return /\W/.test(string);
}

// TODO
function containsAtSign(string) {
  return /@/.test(string);
}

// TODO
function containsPeriod(string) {
  return /\./.test(string);
}

function validateName(name) {
  if (name.length < 2 || !containsLetter(name) || containsNumber(name)) {
    return "Invalid entry.";
  } else {
    return true;
  }
}

function validateID(ID) {
  if (ID === "" || containsLetter(ID) || containsSpecialChar(ID)) {
    return "Invalid entry.";
  } else {
    return true;
  }
}

function validateEmail(email) {
  if (
    email.length < 6 ||
    !containsLetter(email) ||
    !containsAtSign(email) ||
    !containsPeriod(email)
  ) {
    return "Invalid entry";
  } else {
    return true;
  }
}

function validateOfficeNumber(officeNumber) {
  return validateID(officeNumber);
}

function validateGitHub(GitHub) {
  if (
    GitHub.length < 6 ||
    GitHub.length > 39 ||
    !containsLetter(GitHub) ||
    containsSpecialChar(GitHub)
  ) {
    return "Invalid entry.";
  } else {
    return true;
  }
}

function validateSchool(school) {
  if (school.length < 2 || !containsLetter(school)) {
    return "Invalid entry.";
  } else {
    return true;
  }
}

function toTitleCase(string) {
  const wordArr = [];
  for (const word of string.toLowerCase().split(" ")) {
    wordArr.push(word.charAt(0).toUpperCase() + word.slice(1));
  }
  return wordArr.join(" ");
}

// Start of CLI program
async function createTeam() {
  // Greet user
  console.log(
    "Welcome to TeamCreator. Please follow the prompts to create a team. Start by entering the manager's info."
  );

  // Ask for manager's info
  const { managerName } = await inquirer.prompt({
    message: "Enter the manager's name:",
    name: "managerName",
    validate: validateName,
  });
  const { managerID } = await inquirer.prompt({
    message: "Enter the manager's ID:",
    name: "managerID",
    validate: validateID,
  });
  const { managerEmail } = await inquirer.prompt({
    message: "Enter the manager's email:",
    name: "managerEmail",
    validate: validateEmail,
  });
  const { managerOfficeNumber } = await inquirer.prompt({
    message: "Enter the manager's office number:",
    name: "managerOfficeNumber",
    validate: validateOfficeNumber,
  });

  // Create manager object and push to team array
  manager = new Manager(
    toTitleCase(managerName),
    managerID,
    managerEmail.toLowerCase(),
    managerOfficeNumber
  );
  team.push(manager);

  while (true) {
    // Ask user to add another employee
    const { addEmployee } = await inquirer.prompt({
      type: "confirm",
      message: "Add another employee?",
      name: "addEmployee",
    });
    if (addEmployee === false) break;

    // Ask for employee's type
    const { employeeType } = await inquirer.prompt({
      type: "list",
      message: "Select the employee's type:",
      name: "employeeType",
      choices: ["Engineer", "Intern"],
    });

    // Ask for employee's info
    const { employeeName } = await inquirer.prompt({
      message: `Enter the ${employeeType.toLowerCase()}'s name:`,
      name: "employeeName",
      validate: validateName,
    });
    const { employeeID } = await inquirer.prompt({
      message: `Enter the ${employeeType.toLowerCase()}'s ID:`,
      name: "employeeID",
      validate: validateID,
    });
    const { employeeEmail } = await inquirer.prompt({
      message: `Enter the ${employeeType.toLowerCase()}'s email:`,
      name: "employeeEmail",
      validate: validateEmail,
    });
    if (employeeType === "Engineer") {
      const { engineerGitHub } = await inquirer.prompt({
        message: "Enter the engineer's GitHub:",
        name: "engineerGitHub",
        validate: validateGitHub,
      });

      // Create engineer object and push to team array
      engineer = new Engineer(
        toTitleCase(employeeName),
        employeeID,
        employeeEmail.toLowerCase(),
        engineerGitHub.toLowerCase()
      );
      team.push(engineer);
    } else {
      const { internSchool } = await inquirer.prompt({
        message: "Enter the intern's school:",
        name: "internSchool",
        validate: validateSchool,
      });

      // Create intern object and push to team array
      intern = new Intern(
        toTitleCase(employeeName),
        employeeID,
        employeeEmail.toLowerCase(),
        toTitleCase(internSchool)
      );
      team.push(intern);
    }
  }

  // Test
  console.log(team);
}

createTeam();
