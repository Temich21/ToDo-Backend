const Router = require('express').Router
const userController = require('../controllers/user-controller')
const todoController = require('../controllers/todo-controller')
const groupController = require('../controllers/group-controller')
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

router.get('/todo/:userId', authMiddleware, todoController.getToDoList)
router.post('/todo/:userId', authMiddleware, todoController.addNewToDo)
router.put('/todo/:userId', authMiddleware, todoController.editToDo)
router.delete('/todo/:userId/:todoId', authMiddleware, todoController.deleteToDo)

router.get('/todo/all/:userId', authMiddleware, todoController.getAllUserToDos) //Front

router.post('/group/create', authMiddleware, groupController.createNewGroupToDoList)
router.get('/group/:groupId/:userId', authMiddleware, groupController.getGroupToDoList)
router.post('/group/:groupId', authMiddleware, groupController.addNewGroupToDo)
router.put('/group/:groupId', authMiddleware, groupController.editGroupToDo)
router.delete('/group/:groupId/:todoId', authMiddleware, groupController.deleteGroupToDo)
router.patch('/group/:groupId/leave',authMiddleware, groupController.leaveGroup )
router.get('/group/:groupId/users', authMiddleware, groupController.getUserList)

router.get('/groups/:userId', authMiddleware, groupController.getGroupsInfo)
router.get('/groups/users', authMiddleware, userController.getRequiredUsers)

module.exports = router