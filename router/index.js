const Router = require('express').Router
const userController = require('../controllers/user-controller')
const todoController = require('../controllers/todo-controller')
const router = new Router()
const { body } = require('express-validator')
const authMiddleware = require('../middlewares/auth-middleware')

router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({ min: 3, max: 32 }),
    userController.registration
)
router.post('/login', userController.login)
router.get('/logout', userController.logout)
router.get('/activate/:link', userController.activate)
router.get('/refresh', userController.refresh)
router.get('/users', authMiddleware, userController.getUsers)

router.get('/todo/:id', authMiddleware, todoController.getToDoList)
router.post('/todo/:id', authMiddleware, todoController.addNewToDo)

module.exports = router