const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const pool = require("./db");

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
// Dashboard
// ==========================

app.get("/", async (req, res) => {

    try {

        const result = await pool.query(
            "SELECT * FROM employees ORDER BY name"
        );

        res.render("index", {

            employees: result.rows

        });

    } catch (err) {

        console.error(err);

        res.send("Database Error");

    }

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

app.post("/add", async (req, res) => {

    try {

        const {
            name,
            email,
            phone,
            department,
            position,
            salary,
            joiningDate,
            status
        } = req.body;

        const id = "EMP" + Date.now();

        await pool.query(

            `INSERT INTO employees
            (id,name,email,phone,department,position,salary,joining_date,status)
            VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)`,

            [
                id,
                name,
                email,
                phone,
                department,
                position,
                salary,
                joiningDate,
                status
            ]

        );

        res.redirect("/");

    } catch (err) {

        console.error(err);

        res.send("Error Adding Employee");

    }

});

// ==========================
// Search Employee
// ==========================

app.get("/search", async (req, res) => {

    try {

        const keyword = "%" + req.query.keyword + "%";

        const result = await pool.query(

            `SELECT *
             FROM employees
             WHERE name ILIKE $1
                OR department ILIKE $1
                OR position ILIKE $1
             ORDER BY name`,

            [keyword]

        );

        res.render("index", {

            employees: result.rows

        });

    } catch (err) {

        console.error(err);

        res.send("Search Error");

    }

});

// ==========================
// Admin
// ==========================

app.get("/admin", (req, res) => {

    res.render("admin");

});

// ==========================
// Edit Employee Page
// ==========================

app.get("/edit/:id", async (req, res) => {

    try {

        const result = await pool.query(

            "SELECT * FROM employees WHERE id = $1",

            [req.params.id]

        );

        if (result.rows.length === 0) {

            return res.send("Employee Not Found");

        }

        res.render("edit", {

            employee: result.rows[0]

        });

    } catch (err) {

        console.error(err);

        res.send("Database Error");

    }

});

// ==========================
// Update Employee
// ==========================

app.put("/edit/:id", async (req, res) => {

    try {

        const {
            name,
            email,
            phone,
            department,
            position,
            salary,
            joiningDate,
            status
        } = req.body;

        await pool.query(

            `UPDATE employees
             SET name=$1,
                 email=$2,
                 phone=$3,
                 department=$4,
                 position=$5,
                 salary=$6,
                 joining_date=$7,
                 status=$8
             WHERE id=$9`,

            [
                name,
                email,
                phone,
                department,
                position,
                salary,
                joiningDate,
                status,
                req.params.id
            ]

        );

        res.redirect("/");

    } catch (err) {

        console.error(err);

        res.send("Update Error");

    }

});

// ==========================
// Delete Employee
// ==========================

app.delete("/delete/:id", async (req, res) => {

    try {

        await pool.query(

            "DELETE FROM employees WHERE id=$1",

            [req.params.id]

        );

        res.redirect("/");

    } catch (err) {

        console.error(err);

        res.send("Delete Error");

    }

});

// ==========================
// Start Server
// ==========================

app.listen(PORT, () => {

    console.log(`🚀 Employee Management System running on http://localhost:${PORT}`);

});
