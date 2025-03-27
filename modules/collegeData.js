const fs = require("fs");

class Data{
    constructor(students, courses){
        this.students = students;
        this.courses = courses;
    }
}

let dataCollection = null;

module.exports.initialize = function () {
    return new Promise( (resolve, reject) => {
        fs.readFile('./data/courses.json','utf8', (err, courseData) => {
            if (err) {
                reject("unable to load courses"); return;
            }

            fs.readFile('./data/students.json','utf8', (err, studentData) => {
                if (err) {
                    reject("unable to load students"); return;
                }

                dataCollection = new Data(JSON.parse(studentData), JSON.parse(courseData));
                resolve();
            });
        });
    });
}

module.exports.getAllStudents = function(){
    return new Promise((resolve,reject)=>{
        if (dataCollection.students.length == 0) {
            reject("query returned 0 results"); return;
        }

        resolve(dataCollection.students);
    })
}

module.exports.getTAs = function () {
    return new Promise(function (resolve, reject) {
        var filteredStudents = [];

        for (let i = 0; i < dataCollection.students.length; i++) {
            if (dataCollection.students[i].TA == true) {
                filteredStudents.push(dataCollection.students[i]);
            }
        }

        if (filteredStudents.length == 0) {
            reject("query returned 0 results"); return;
        }

        resolve(filteredStudents);
    });
};

module.exports.getCourses = function(){
   return new Promise((resolve,reject)=>{
    if (dataCollection.courses.length == 0) {
        reject("query returned 0 results"); return;
    }

    resolve(dataCollection.courses);
   });
};

module.exports.getStudentByNum = function (num) {
    return new Promise(function (resolve, reject) {
        var foundStudent = null;

        for (let i = 0; i < dataCollection.students.length; i++) {
            if (dataCollection.students[i].studentNum == num) {
                foundStudent = dataCollection.students[i];
            }
        }

        if (!foundStudent) {
            reject("query returned 0 results"); return;
        }

        resolve(foundStudent);
    });
};

module.exports.getStudentsByCourse = function (course) {
    return new Promise(function (resolve, reject) {
        var filteredStudents = [];

        for (let i = 0; i < dataCollection.students.length; i++) {
            if (dataCollection.students[i].course == course) {
                filteredStudents.push(dataCollection.students[i]);
            }
        }

        if (filteredStudents.length == 0) {
            reject("query returned 0 results"); return;
        }

        resolve(filteredStudents);
    });
};


let students = [];

function initialize() {
    return new Promise((resolve, reject) => {
        fs.readFile('./students.json', 'utf8', (err, data) => {
            if (err) {
                reject("Unable to read students.json");
            } else {
                students = JSON.parse(data);
                resolve();
            }
        });
    });
}

function getStudentsByCourse(course) {
    return new Promise((resolve, reject) => {
        let filteredStudents = students.filter(student => student.course == course);
        
        if (filteredStudents.length > 0) {
            resolve(filteredStudents);
        } else {
            reject("no results returned");
        }
    });
}

function getStudentByNum(num) {
    return new Promise((resolve, reject) => {
        let student = students.find(student => student.studentNum == num);
        
        if (student) {
            resolve(student);
        } else {
            reject("no results returned");
        }
    });
}


function getCourseById(id) {
    return new Promise((resolve, reject) => {
        const course = dataCollection.courses.find(course => course.courseId == id);
        
        if (course) {
            resolve(course);
        } else {
            reject("query returned 0 results");
        }
    });
}

function updateStudent(studentData) {
    return new Promise((resolve, reject) => {
        // Set TA to false if undefined, true otherwise
        studentData.TA = (studentData.TA) ? true : false;
        
        // Convert course to number
        studentData.course = parseInt(studentData.course);
        
        // Convert studentNum to number
        studentData.studentNum = parseInt(studentData.studentNum);
        
        // Find the student in the array
        const studentIndex = dataCollection.students.findIndex(student => student.studentNum === studentData.studentNum);
        
        if (studentIndex !== -1) {
            // Update the student
            dataCollection.students[studentIndex] = studentData;
            resolve();
        } else {
            reject("Student not found");
        }
    });
}

// Add the function to module.exports
module.exports = {
    initialize,
    getAllStudents,
    getStudentsByCourse,
    getStudentByNum,
    getCourses,
    addStudent,
    getCourseById,
    updateStudent
};







