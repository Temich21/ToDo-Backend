const todoService = require('../service/todo-service')

class ToDoController {
    async getToDoList(req, res, next) {
        try {
            const userId = req.params.id
            const todoList = await todoService.getToDoList(userId)
            return res.json(todoList)
        } catch (e) {
            next()
        }
    }

    async addNewToDo(req, res, next) {
        try {
            const userId = req.params.id
            const newToDo = req.body
            await todoService.addNewToDo(userId, newToDo)
            return res.status(201)
        } catch (e) {
            next()
        }
    }
}

module.exports = new ToDoController()