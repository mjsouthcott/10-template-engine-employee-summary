const Employee = require("./Employee");

class Engineer extends Employee {
  constructor(id, name, email, GitHub) {
    super(id, name, email, GitHub);
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
