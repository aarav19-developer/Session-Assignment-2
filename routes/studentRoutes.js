const express = require("express");
const router = express.Router();
const students = require("../data/students");

const isValidStudent = (body) => {
  const { name, age, course } = body;
  return (
    typeof name === "string" && name.trim() !== "" &&
    typeof age === "number" && age > 0 &&
    typeof course === "string" && course.trim() !== ""
  );
};

// GET all students
router.get("/", (req, res) => {
  res.status(200).json(students);
});

// GET one student
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "ID must be a number" });

  const student = students.find((s) => s.id === id);
  if (!student) return res.status(404).json({ error: "Student not found" });

  res.status(200).json(student);
});

// POST add student
router.post("/", (req, res) => {
  if (!isValidStudent(req.body)) {
    return res.status(400).json({
      error: "name (string), age (number) and course (string) are required"
    });
  }

  const newStudent = {
    id: students.length ? students[students.length - 1].id + 1 : 1,
    name: req.body.name,
    age: req.body.age,
    course: req.body.course
  };
  students.push(newStudent);
  res.status(201).json(newStudent);
});

// PUT update student
router.put("/:id", (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "ID must be a number" });

  const student = students.find((s) => s.id === id);
  if (!student) return res.status(404).json({ error: "Student not found" });

  if (!isValidStudent(req.body)) {
    return res.status(400).json({
      error: "name (string), age (number) and course (string) are required"
    });
  }

  student.name = req.body.name;
  student.age = req.body.age;
  student.course = req.body.course;
  res.status(200).json(student);
});

// DELETE student
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "ID must be a number" });

  const index = students.findIndex((s) => s.id === id);
  if (index === -1) return res.status(404).json({ error: "Student not found" });

  const deleted = students.splice(index, 1);
  res.status(200).json({ message: "Student deleted", student: deleted[0] });
});

module.exports = router;