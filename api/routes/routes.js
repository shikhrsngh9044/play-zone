const express = require('express');
const router = express.Router();
const accessGuard = require('../middleware/AccessGuard');
const todoController = require('../controllers/todo');

// router.get("/farmers/:page?", accessGuard.checkAuth(['admin']) , farmerController.getAllFarmers);

router.get('/todos', todoController.getTodos)
router.post('/todo', todoController.createTodo)
router.get('/todo/:id', todoController.getSingleTodo)

module.exports = router;