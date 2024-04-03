const groupService = require('../service/group-service')

class GroupController {
    async createNewGroupToDoList(req, res, next) {
        try {
            const data = req.body
            const groupToDoListId = await groupService.getGroupToDoList(data)
            return res.status(201).json({ message: 'Group were created successful', groupId: groupToDoListId })
        } catch (e) {
            next()
        }
    }

    async getGroupToDoList(req, res, next) {
        try {
            const groupId = req.params.groupId
            const groupTodoList = await groupService.getGroupToDoList(groupId)
            return res.json(groupTodoList)
        } catch (e) {
            next()
        }
    }

    async addNewGroupToDo(req, res, next) {
        try {
            const groupId = req.params.groupId
            const newGroupTodo = req.body
            await groupService.addNewGroupToDo(groupId, newGroupTodo)
            return res.status(201).json({message: 'ToDo was added successful'})
        } catch (e) {
            next()
        }
    }

    async editGroupToDo(req, res, next) {
        try {
            const groupId = req.params.groupId
            const editedGroupTodo = req.body
            await groupService.editGroupToDo(groupId, editedGroupTodo)
            return res.status(201).json({message: 'ToDo was edited successful'})
        } catch (e) {
            next()
        }
    }

    async deleteGroupToDo(req, res, next) {
        try {
            const groupId = req.params.groupId
            const todoId = req.params.todoId
            await groupService.deleteGroupToDo(groupId, todoId)
            return res.status(201).json({ message: 'ToDo was deleted successful' })
        } catch (e) {
            next()
        }
    }
}

module.exports = new GroupController()