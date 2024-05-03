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

router.get('/todo/get/:userId', authMiddleware, todoController.getToDoList)
router.post('/todo/add/:userId', authMiddleware, todoController.addNewToDo)
router.put('/todo/edit/:userId', authMiddleware, todoController.editToDo)
router.delete('/todo/delete/:userId/:todoId', authMiddleware, todoController.deleteToDo)

router.get('/todo/all/:userId', authMiddleware, todoController.getAllUserToDos)

router.post('/group/create', authMiddleware, groupController.createNewGroupToDoList)
router.get('/group/get/:groupId/:userId', authMiddleware, groupController.getGroupToDoList)
router.post('/group/add/:groupId', authMiddleware, groupController.addNewGroupToDo)
router.put('/group/edit/:groupId', authMiddleware, groupController.editGroupToDo)
router.delete('/group/delete/:groupId/:todoId', authMiddleware, groupController.deleteGroupToDo)
router.post('/group/:groupId/new-participant', authMiddleware, groupController.addNewParticipant)
router.patch('/group/:groupId/leave',authMiddleware, groupController.leaveGroup )
router.get('/group/:groupId/users', authMiddleware, groupController.getUserList)

router.get('/groups/:userId', authMiddleware, groupController.getGroupsInfo)
router.get('/groups/users/list', authMiddleware, userController.getRequiredUsers)

module.exports = router