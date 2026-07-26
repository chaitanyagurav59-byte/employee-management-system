const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// ==========================
// Middleware
// ==========================
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// ==========================
// JSON File
// ==========================
const DATA_FILE = path.join(__dirname, "employees.json");

// ==========================
// Read Employees
// ==========================
function getEmployees() {
    if (!fs.existsSync(DATA_FILE)) {
        return [];
    }

    const data = fs.readFileSync(DATA_FILE, "utf8");

    if (!data.trim()) {
        return [];
    }

    return JSON.parse(data);
}

// ==========================
// Save Employees
// ==========================
function saveEmployees(employees) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(employees, null, 2));
}

// ==========================
// Dashboard
// ==========================
app.get("/", (req, res) => {

    const employees = getEmployees();

    res.render("index", {
        employees
    });

});

// ==========================
// Add Employee Page
// ==========================
app.get("/add", (req, res) => {

    res.render("add");

});

// ==========================
// Save Employee
// ==========================
app.post("/add", (req, res) => {

    const employees = getEmployees();

    const employee = {

        id: "EMP" + Date.now(),

        name: req.body.name,

        email: req.body.email,

        phone: req.body.phone,

        department: req.body.department,

        position: req.body.position,

        salary: req.body.salary,

        joiningDate: req.body.joiningDate,

        status: req.body.status

    };

    employees.push(employee);

    saveEmployees(employees);

    res.redirect("/");

});

// ==========================
// Edit Page
// ==========================
app.get("/edit/:id", (req, res) => {

    const employees = getEmployees();

    const employee = employees.find(

        emp => emp.id === req.params.id

    );

    res.render("edit", {

        employee

    });

});

// ==========================
// Update Employee
// ==========================
app.put("/edit/:id", (req, res) => {

    let employees = getEmployees();

    employees = employees.map(emp => {

        if (emp.id === req.params.id) {

            return {

                id: emp.id,

                name: req.body.name,

                email: req.body.email,

                phone: req.body.phone,

                department: req.body.department,

                position: req.body.position,

                salary: req.body.salary,

                joiningDate: req.body.joiningDate,

                status: req.body.status

            };

        }

        return emp;

    });

    saveEmployees(employees);

    res.redirect("/");

});

// ==========================
// Delete Employee
// ==========================
app.delete("/delete/:id", (req, res) => {

    let employees = getEmployees();

    employees = employees.filter(

        emp => emp.id !== req.params.id

    );

    saveEmployees(employees);

    res.redirect("/");

});

// ==========================
// Search Employee
// ==========================
app.get("/search", (req, res) => {

    const search = req.query.keyword.toLowerCase();

    const employees = getEmployees();

    const filteredEmployees = employees.filter(emp =>

        emp.name.toLowerCase().includes(search) ||

        emp.department.toLowerCase().includes(search) ||

        emp.position.toLowerCase().includes(search)

    );

    res.render("index", {

        employees: filteredEmployees

    });

});


// ==========================
// Admin Profile
// ==========================
app.get("/admin", (req, res) => {
    res.render("admin");
});




// ==========================
// Start Server
// ==========================
app.listen(PORT, () => {

    console.log(`🚀 Employee Management System running at http://localhost:${PORT}`);

});
