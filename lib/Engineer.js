const Employee = require("./Employee");

class Engineer extends Employee {
  constructor(name, ID, email, GitHub) {
    super(name, ID, email, GitHub);
    this.GitHub = GitHub;
  }

  getGitHub() {
    return this.GitHub;
  }

  getRole() {
    return "Engineer";
  }
}

module.exports = Engineer;
