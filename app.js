const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const util = require("util");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

const writeFileP = util.promisify(fs.writeFile);

const team = [];

// Define validation functions
function validateName(name) {
  const re = /^[a-zA-Z]{2,30}$/;
  if (re.test(name)) {
    return true;
  } else {
    return "Invalid name. Names must be 2 to 30 characters long and can only contain letters.";
  }
}

function validateID(ID) {
  const re = /^\d{1,}$/;
  if (re.test(ID)) {
    return true;
  } else {
    return "Invalid ID. IDs can only contain numbers.";
  }
}

function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (re.test(email)) {
    return true;
  } else {
    return "Invalid email. Emails should be of the form 'local-part@domain' and should comply with RFC 2822 (https://tools.ietf.org/html/rfc2822).";
  }
}

function validateOfficeNumber(officeNumber) {
  const re = /^\d{1,}$/;
  if (re.test(officeNumber)) {
    return true;
  } else {
    return "Invalid office number. Office numbers can only contain numbers.";
  }
}

function validateGitHub(GitHub) {
  const re = /^[a-zA-Z\d]{8,39}$/;
  if (re.test(GitHub)) {
    return true;
  } else {
    return "Invalid GitHub username. GitHub usernames must be 8 to 39 characters long and can only contain letters and numbers.";
  }
}

function validateSchool(school) {
  const re = /^[a-zA-Z\d_- ]{2,}$/;
  if (re.test(school)) {
    return true;
  } else {
    return "Invalid school. Schools must be 2 to 30 characters long and can only contain letters, numbers and select special characters.";
  }
}

// Define function to converts strings to title case
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

  // Render HTML
  const teamHTML = render(team);

  // Write HTML to file
  writeFileP(outputPath, teamHTML, function (err) {
    if (err) {
      throw err;
    }
  });
}

// Call function to create team
createTeam();
