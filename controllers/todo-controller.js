const todoService = require('../service/todo-service')

class ToDoController {
    async getToDoList(req, res, next) {
        try {
            const userId = req.params.userId
            const todoList = await todoService.getToDoList(userId, true)
            return res.json(todoList)
        } catch (e) {
            next()
        }
    }

    async addNewToDo(req, res, next) {
        try {
            const userId = req.params.userId
            const newToDo = req.body
            await todoService.addNewToDo(userId, newToDo, true)
            return res.status(201).json({ message: 'ToDo was added successfully' })
        } catch (e) {
            next()
        }
    }

    async editToDo(req, res, next) {
        try {
            const userId = req.params.userId
            const editedToDo = req.body
            await todoService.editToDo(userId, editedToDo, true)
            return res.status(201).json({ message: 'ToDo was edited successfully' })
        } catch (e) {
            next()
        }
    }

    async deleteToDo(req, res, next) {
        try {
            const userId = req.params.userId
            const todoId = req.params.todoId
            await todoService.deleteToDo(userId, todoId, true)
            return res.status(201).json({ message: 'ToDo was deleted successful' })
        } catch (e) {
            next()
        }
    }

    async getAllUserToDos(req, res, next) {
        try {
            const userId = req.params.id
            const todoList = await todoService.getAllUserToDos(userId)
            return res.json(todoList)
        } catch (e) {
            next()
        }
    }

}

module.exports = new ToDoController()