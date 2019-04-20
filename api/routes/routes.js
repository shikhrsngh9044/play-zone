const express = require('express');
const router = express.Router();
const accessGuard = require('../middleware/AccessGuard');
const todoController = require('../controllers/todo');
const AuthController = require('../controllers/Auth/AuthController');
const MatchController = require('../controllers/MatchController');
const OrgProController = require('../controllers/OrganiserController');

// router.get("/farmers/:page?", accessGuard.checkAuth(['admin']) , farmerController.getAllFarmers);

// router.get('/todos', todoController.getTodos)
// router.post('/todo', todoController.createTodo)
// router.get('/todo/:id', todoController.getSingleTodo)

// user routes.........................................................................................

router.post('/user/register', AuthController.registerUser);
router.post('/user/login', AuthController.login);
router.post('/user/send-otp-request', AuthController.userOTP);
router.post('/user/reset-password', AuthController.userPasswordReset);
router.patch('/user/update/:userId', AuthController.update);
router.patch('/user/avatar/:userId', AuthController.avatar);
router.patch('/user/verify', AuthController.verifyUser);


// match routes.........................................................................................

router.get('/match/get-all-match' , MatchController.getAllMatch); //public
router.get('/match/org/get-all-match' , MatchController.orgGetAllMatch); //private
router.get('/match/get-single-match/:matchId' , MatchController.getSingleMatch); //public
router.get('/match/org/get-single-match/:matchId', accessGuard.checkAuth(['user']) , MatchController.orgGetSingleMatch); //private
router.post('/match/register' ,accessGuard.checkAuth(['user']) , MatchController.createMatch);
router.patch('/match/add-participants' ,accessGuard.checkAuth(['user']) , MatchController.addParticipants);
router.patch('/match/remove-participants' ,accessGuard.checkAuth(['user']) , MatchController.removeParticipants);
router.patch('/match/participant-request' ,accessGuard.checkAuth(['user']) , MatchController.requestForMatch);
router.patch('/match/participant-accept' ,accessGuard.checkAuth(['user']) , MatchController.orgAcceptParticipant);

// org profile route.....................................................................................

router.post('/org-pro/register',accessGuard.checkAuth(['user']) , OrgProController.createOrgPro)

module.exports = router;