
const inquirer = require("inquirer")
const ct = require('console.table');
const db = require('./config/connection');


function init() {
  inquirer.prompt([{
    type: "list",
    message: "Make a Selection:",
    name: "choice",
    choices: [
      "View Departments?",
      "View Roles?",
      "View Employees",
      "View Employees by Manager",
      "View Employees by Department",
      "View Department Budget",
      "Add Department?",
      "Add Role?",
      "Add Employee?",
      "Update an Employee's Role?",
      "Update an Employee's Manager?",
      "Delete Function",
      "Exit Application"
    ]
  }]).then(function (event) {
    switch (event.choice) {
      case "View Departments?":
        viewDepartments();
        break;

      case "View Roles?":
        viewAllRoles();
        break;

      case "View Employees":
        viewAllEmployees();
        break;

      case "View Department Budget":
        viewDepartmentBudget();
        break;

      case "View Employees by Manager":
        viewEmployeesByManager();
        break;

      case "View Employees by Department":
        viewEmployeesByDepartment();
        break;

      case "Add Department?":
        addDepartment();
        break;

      case "Add Role?":
        addRole();
        break;

      case "Add Employee?":
        addEmployee();
        break;

      case "Update an Employee Role?":
        updateEmployeeRole();
        break;

      case "Update an Employee's Manager?":
        updateEmployeeManager();
        break;

      case "Delete Function":
        deleteFunction();
        break;

      case "Exit Application":
        process.exit();
    }
  })
}
function viewDepartments() {
  db.query("SELECT id AS 'ID', name AS 'Department' FROM department",
    function (err, results) {
      if (err) throw err
      console.table(results)
      init()
    })
};
function viewRoles() {
  db.query("SELECT role.title AS 'Title', role.id AS 'ID', department.name AS 'Department', role.salary AS 'Salary' FROM department INNER JOIN role ON role.department_id=department.id ORDER BY id ASC;",
    function (err, results) {
      if (err) throw err
      console.table(results)
      init()
    })
};
function viewEmployees() {
  db.query("SELECT employee.id AS ID, employee.first_name AS 'First Name', employee.last_name AS 'Last Name', role.title AS 'Title',department.name AS 'Department', role.salary AS 'Salary', CONCAT(manager.first_name, ' ' ,manager.last_name) AS Manager FROM employee INNER JOIN role ON employee.role_id=role.id INNER JOIN department ON role.department_id=department.id LEFT OUTER JOIN employee manager ON employee.manager_id =manager.id;",
    function (err, results) {
      if (err) throw err
      console.table(results)
      init()
    })
};

function EmployeesByDepartment() {
  db.query(`SELECT * FROM department`, (err, data) => {
    if (err) throw err;

    const department = data.map(({
      id,
      name

    }) => ({
      name: name,
      value: id
    }));
    inquirer.prompt([{
      name: "department",
      type: "list",
      message: "Select A Department:",
      choices: department
    }]).then(event => {
      const department = event.department;
      db.query(`SELECT CONCAT(first_name, ' ', last_name) AS Employees, department.name AS Department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id WHERE department_id= ${department};`, function (err, results) {
        if (err) throw err
        console.table(results)

        init()
      })
    })
  })
};

function EmployeesByManager() {
  db.query(`SELECT * FROM employee WHERE manager_id IS NULL`, (err, data) => {
    if (err) throw err;

    const managers = data.map(({
      id,
      first_name,
      last_name

    }) => ({
      name: first_name + ' ' + last_name,
      value: id
    }));
    inquirer.prompt([{
      name: "managers",
      type: "list",
      message: "Select A Manager:",
      choices: managers
    }]).then(event => {
      const managers = event.managers;

      db.query(`SELECT CONCAT(first_name, ' ', last_name) AS Employees FROM employee WHERE manager_id= ${managers};`, function (err, results) {
        if (err) throw err

        if (results === []) {
          console.log("They have no Employees")
        } else {
          console.table(results)
        }
        init()
      })
    })
  })
};


function DepartmentBudget() {
  db.query('SELECT department_id AS ID, department.name AS Department,SUM(salary) AS Budget FROM  role INNER JOIN department ON role.department_id = department.id GROUP BY  role.department_id',
    function (err, results) {
      if (err) throw err
      console.table(results)
      init()
    })
};
function addDepartment() {
  inquirer.prompt([{
    name: "name",
    type: "input",
    message: "Name of department"
  }]).then(function (res) {
    db.query("INSERT INTO department SET ? ", {
        name: res.name
      },
      function (err) {
        if (err) throw err
        console.log(res.name, "added Department");
        init();
      }
    )
  })
};
function addRole() {
  db.query(`SELECT * FROM department`, async (err, data) => {
    if (err) throw err;

    const departments = await data.map(({
      id,
      name
    }) => ({
      name: name,
      value: id

    }));
    inquirer.prompt([{
        name: "name",
        type: "input",
        message: "Name of new role:"
      },
      {
        name: "salary",
        type: "input",
        message: "Salary of the role:"
      },
      {
        name: "department",
        type: "list",
        message: "Department to assign new role:",
        choices: departments
      }
    ]).then(function (res) {
      db.query("INSERT INTO role SET ? ", {
          title: res.name,
          salary: res.salary,
          department_id: res.department,
        },
        function (err) {
          if (err) throw err
          console.log(res.name, "added as a new Role");
          init();
        }
      )
    })
  })
};

function addEmployee() {
  db.query(`SELECT * FROM role`, async (err, data) => {
    if (err) throw err;
    const roles = await data.map(({
      id,
      title
    }) => ({
      name: title,
      value: id
    }));
    db.query(`SELECT * FROM employee WHERE manager_id IS NULL`, async (err, data) => {
      if (err) throw err;
      const managers = await data.map(({
        first_name,
        last_name,
        id
      }) => ({
        name: first_name + " " + last_name,
        value: id
      }));
      inquirer.prompt([{
          name: "firstname",
          type: "input",
          message: "First name "
        },
        {
          name: "lastname",
          type: "input",
          message: "Last name "
        },
        {
          name: "role",
          type: "list",
          message: "What is their role? ",
          choices: roles
        },
        {
          name: "manager",
          type: "list",
          message: "Who is their Manager? ",
          choices: managers
        }
      ]).then(function (res) {
        db.query("INSERT INTO employee SET ?", {
          first_name: res.firstname,
          last_name: res.lastname,
          role_id: res.role,
          manager_id: res.manager
        }, function (err) {
          if (err) throw err
          console.table(res.firstname, "added as a new Employee")
          init()
        })

      })
    })
  })
};

function updateEmployeeRole() {

  db.query(`SELECT * FROM employee`, (err, data) => {
    if (err) throw err;

    const employees = data.map(({
      id,
      first_name,
      last_name
    }) => ({
      name: first_name + " " + last_name,
      value: id
    }));
    inquirer.prompt([{
        type: 'list',
        name: 'name',
        message: "Select an Employee to Update their Role",
        choices: employees
      }])
      .then(event => {
        const employee = event.name;
        const updateArray = [];
        updateArray.push(employee);

        db.query(`SELECT * FROM role`, (err, data) => {
          if (err) throw err;

          const roles = data.map(({
            id,
            title
          }) => ({
            name: title,
            value: id
          }));
          inquirer.prompt([{
              type: 'list',
              name: 'role',
              message: "Select a new Role?",
              choices: roles
            }])
            .then(event => {
              const role = event.role;
              updateArray.push(role);

              let employee = updateArray[0]
              updateArray[0] = role
              updateArray[1] = employee


              db.query(`UPDATE employee SET role_id = ? WHERE id = ?`, updateArray, (err, result) => {
                if (err) throw err;
                console.log("Employee Updated, View all Employees to see update");

                initPrompt();
              });
            });
        });
      });
  });
};
function updateEmployeeManager(){
  db.query(`SELECT * FROM employee`, (err, data) => {
    if (err) throw err;

    const employees = data.map(({
      id,
      first_name,
      last_name
    }) => ({
      name: first_name + " " + last_name,
      value: id
    }));
    inquirer.prompt([
      {
        type: 'list',
        name: 'employee',
        message: "Select an Employee to change their Manager",
        choices: employees
      },
      {
        type: 'list',
        name: 'manager',
        message: "Select a new Manager",
        choices: employees
      }]).then(event =>{
       if(event.manager===event.employee){
        db.query(`UPDATE employee SET manager_id = NULL WHERE id = ${event.employee}`, (err, result) => {
          if (err) throw err;
          console.log("New Manager Updated");
          init();
        })} else {
          db.query(`UPDATE employee SET manager_id = ${event.manager} WHERE id = ${event.employee}`, (err, result) => {
            if (err) throw err;
            console.log("New Manager Updated");
            init();
        })};
      })
})};

function deleteFunction() {
  inquirer.prompt([{
    type: "list",
    message: "Make a Selection:",
    name: "choice",
    choices: [
      "Delete Employee",
      "Delete Role",
      "Delete Department"
    ]
  }]).then(function (event) {
    switch (event.choice) {
      case "Delete Department":
        deleteDepartment();
        break;
      case "Delete Role":
        deleteRole();
        break;
      case "Delete Employee":
        deleteEmployee();
        break;

    }
  })
};


function deleteEmployee() {
  db.query(`SELECT * FROM employee`, (err, data) => {
    if (err) throw err;

    const employees = data.map(({
      id,
      first_name,
      last_name
    }) => ({
      name: first_name + " " + last_name,
      value: id
    }));
    inquirer.prompt([{
        type: 'list',
        name: 'name',
        message: "Select an Employee to remove from the database",
        choices: employees
      }])
      .then(event => {
        db.query(`DELETE FROM employee WHERE employee.id = ${event.name} `, (err, result) => {
          if (err) throw err;
          console.log("Employee has been removed from the database.");

          init();
        });
      });
  });
};

function deleteRole() {
  db.query(`SELECT * FROM role`, (err, data) => {
    if (err) throw err;

    const roles = data.map(({
      id,
      title
    }) => ({
      name: title,
      value: id
    }));
    inquirer.prompt([{
        type: 'list',
        name: 'name',
        message: "Select a Role to remove",
        choices: roles
      }])
      .then(event => {
        db.query(`DELETE FROM role WHERE role.id = ${event.name} `, (err, result) => {
          if (err) throw err;
          console.log("Role has been removed from the database.");

          init();
        });
      });
  });
};

function deleteDepartment() {
  db.query(`SELECT * FROM department`, (err, data) => {
    if (err) throw err;

    const departments = data.map(({
      id,
      name
    }) => ({
      name: name,
      value: id
    }));
    inquirer.prompt([{
        type: 'list',
        name: 'name',
        message: "Select a Department to remove",
        choices: departments
      }])
      .then(event => {
        db.query(`DELETE FROM department WHERE department.id = ${event.name} `, (err, result) => {
          if (err) throw err;
          console.log("Department has been removed from the database.");

          init();
        });
      });
  });
};

init();