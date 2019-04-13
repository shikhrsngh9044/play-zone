const express = require('express');
const router = express.Router();
const accessGuard = require('../middleware/AccessGuard');
const todoController = require('../controllers/todo');
const AuthController = require('../controllers/authController/AuthController')

// router.get("/farmers/:page?", accessGuard.checkAuth(['admin']) , farmerController.getAllFarmers);

// router.get('/todos', todoController.getTodos)
// router.post('/todo', todoController.createTodo)
// router.get('/todo/:id', todoController.getSingleTodo)

router.post('/user/register', AuthController.registerUser);
router.post('/user/login', AuthController.login);
router.post('/user/send-otp-request', AuthController.userOTP);
router.post('/user/reset-password', AuthController.userPasswordReset);
router.patch('/user/update/:userId', AuthController.update);
router.patch('/user/avatar/:userId', AuthController.avatar);
router.patch('/user/verify', AuthController.verifyUser);

module.exports = router;