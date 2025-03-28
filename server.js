/*********************************************************************************
* WEB700 – Assignment 03
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name:Maya Clarke Student ID: 107776247 Date: feb 19 2025
*
********************************************************************************/

const express = require("express");
const path = require("path");
const collegeData = require("./modules/collegeData");

const app = express();
const HTTP_PORT = process.env.PORT || 8080;


app.set('view engine', 'ejs');

// Add middleware for parsing form data
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));

// middleware for active route tracking
app.use(function(req, res, next) {
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
    next();
});

// Add custom EJS helpers
app.use((req, res, next) => {
    // Helper for navigation links
    res.locals.navLink = function(url, options) {
        return '<li' + 
            ((url == app.locals.activeRoute) ? ' class="nav-item active" ' : ' class="nav-item" ') + 
            '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
    };
    
    // Helper for equality 
    res.locals.equal = function(lvalue, rvalue, options) {
        if (arguments.length < 3)
            throw new Error("EJS Helper equal needs 2 parameters");
        if (lvalue != rvalue) {
            return options.inverse(this);
        } else {
            return options.fn(this);
        }
    };
    
    next();
});

// Routes
app.get("/", (req, res) => {
    res.render("home");
});

app.get("/about", (req, res) => {
    res.render("about");
});

app.get("/htmlDemo", (req, res) => {
    res.render("htmlDemo");
});

app.get("/students", (req, res) => {
    if (req.query.course) {
        collegeData.getStudentsByCourse(req.query.course)
            .then((data) => {
                res.render("students", { students: data });
            })
            .catch((err) => {
                res.render("students", { message: "no results" });
            });
    } else {
        collegeData.getAllStudents()
            .then((data) => {
                res.render("students", { students: data });
            })
            .catch((err) => {
                res.render("students", { message: "no results" });
            });
    }
});

app.get("/courses", (req, res) => {
    collegeData.getCourses()
        .then((data) => {
            res.render("courses", { courses: data });
        })
        .catch((err) => {
            res.render("courses", { message: "no results" });
        });
});

app.get("/student/:num", (req, res) => {
    collegeData.getStudentByNum(req.params.num)
        .then((data) => {
            res.render("student", { student: data });
        })
        .catch((err) => {
            res.render("student", { message: "no results" });
        });
});

app.get("/students/add", (req, res) => {
    res.render("addStudent");
});

app.post("/students/add", (req, res) => {
    collegeData.addStudent(req.body)
        .then(() => {
            res.redirect("/students");
        })
        .catch((err) => {
            res.status(500).send("Unable to add student: " + err);
        });
});

app.post("/student/update", (req, res) => {
    collegeData.updateStudent(req.body)
        .then(() => {
            res.redirect("/students");
        })
        .catch((err) => {
            res.status(500).send("Unable to update student: " + err);
        });
});

// Initialize the data and start the server
collegeData.initialize()
    .then(() => {
        app.listen(HTTP_PORT, () => {
            console.log("Server listening on port: " + HTTP_PORT);
        });
    })
    .catch((err) => {
        console.error("Error initializing data:", err);
    });
