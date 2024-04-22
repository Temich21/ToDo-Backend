const groupService = require('../service/group-service')

class GroupController {
    async createNewGroupToDoList(req, res, next) {
        try {
            const data = req.body
            const groupToDoListId = await groupService.createNewGroupToDoList(data)
            return res.status(201).json({ message: 'Group were created successful', groupId: groupToDoListId })
        } catch (e) {
            next()
        }
    }

    async getGroupToDoList(req, res, next) {
        try {
            const groupId = req.params.groupId
            const userId = req.params.userId
            const groupTodoList = await groupService.getGroupToDoList(groupId, userId)
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
            return res.status(201).json({ message: 'ToDo was added successful' })
        } catch (e) {
            next()
        }
    }

    async editGroupToDo(req, res, next) {
        try {
            const groupId = req.params.groupId
            const editedGroupTodo = req.body
            await groupService.editGroupToDo(groupId, editedGroupTodo)
            return res.status(201).json({ message: 'ToDo was edited successful' })
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

    async getGroupsInfo(req, res, next) {
        try {
            const userId = req.params.userId
            const groupsInfoList = await groupService.getGroupsInfo(userId)
            return res.json(groupsInfoList)
        } catch (e) {
            next()
        }
    }

    async leaveGroup(req, res, next) {
        try {
            const groupId = req.params.groupId
            const { userId } = req.body
            await groupService.leaveGroup(groupId, userId)
            return res.status(200).json({ message: 'Leaving was successful' })
        } catch (e) {
            next()
        }
    }

    async getUserList(req, res, next) {
        try {
            const groupId = req.params.groupId
            const usersList = await groupService.getUserList(groupId)
            return res.json(usersList)
        } catch (e) {
            next()
        }
    }

    async addNewParticipant(req, res, next) {
        try {
            const groupId = req.params.groupId
            const newParticipant = req.body
            await groupService.addNewParticipant(groupId, newParticipant)
            return res.status(201).json({ message: 'The participant was successfully added.' })
        } catch (e) {
            next()
        }
    }
}

module.exports = new GroupController()