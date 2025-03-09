/*********************************************************************************
* WEB700 – Assignment 03
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name:Maya Clarke Student ID: 107776247 Date: feb 19 2025
*
********************************************************************************/












var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();
// setup a 'route' to listen on the default url path
app.get("/", (req, res) => {
res.send("Hello World!");
});
// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT, ()=>{console.log("server listening on port: " + HTTP_PORT)});


const express = require("express");
const path = require("path");
const collegeData = require("./modules/collegeData")


collegeData.initialize()
    .then(() => {
        console.log("Data initialization successful.");
    })
    .catch(err => {
        console.log("Data initialization failed: " + err);
    });

// GET /students 
app.get("/students", (req, res) => {
    let course = req.query.course;

    if (course) {
        collegeData.getStudentsByCourse(course)
            .then(students => res.json(students))
            .catch(() => res.json({ message: "no results" }));
    } else {
        collegeData.getAllStudents()
            .then(students => res.json(students))
            .catch(() => res.json({ message: "no results" }));
    }
});
// GET /tas 
app.get("/tas", (req, res) => {
    collegeData.getTAs()
        .then(tas => res.json(tas))
        .catch(() => res.json({ message: "no results" }));
});

// GET /courses 
app.get("/courses", (req, res) => {
    collegeData.getCourses()
        .then(courses => res.json(courses))
        .catch(() => res.json({ message: "no results" }));
});

// GET /student/:num 
app.get("/student/:num", (req, res) => {
    let studentNum = req.params.num;
    collegeData.getStudentByNum(studentNum)
        .then(student => res.json(student))
        .catch(() => res.json({ message: "no results" }));
});

// GET / 
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views/home.html"));
});

// GET /about 
app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "views/about.html"));
});

// GET /htmlDemo 
app.get("/htmlDemo", (req, res) => {
    res.sendFile(path.join(__dirname, "views/htmlDemo.html"));
});

// no matching route
app.use((req, res) => {
    res.status(404).send("Page Not Found");
});

