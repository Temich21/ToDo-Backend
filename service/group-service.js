const GroupToDoModel = require('../models/group-model')
const ToDoModel = require('../models/todo-model')
const todoService = require('./todo-service')
const ApiError = require('../exceptions/api-error')
const mongoose = require('mongoose')
const { ObjectId } = require('mongodb')

class GroupToDoService {
    async createNewGroupToDoList(groupInfo) {
        try {
            const newGroupToDoList = await GroupToDoModel.create({
                title: groupInfo.title,
                createdBy: new mongoose.Types.ObjectId(groupInfo.createdBy),
                createdDate: (new Date()).toString(),
                participants: groupInfo.participants.map(participant => ({
                    ...participant,
                    _id: new mongoose.Types.ObjectId(participant._id),
                })),
                todoList: []
            })

            // Think about better solution
            groupInfo.participants.forEach(async (participant) => {
                await todoService.addGroup(participant._id, { _id: newGroupToDoList._id, title: groupInfo.title })
            })

            return newGroupToDoList._id
        } catch (e) {
            console.log(e)
        }
    }

    async getGroupToDoList(groupId, userId) {
        const groupTodoList = await GroupToDoModel.findOne({ _id: groupId })

        if (!groupTodoList) {
            throw ApiError.ToDoListDoesnotExist()
        }

        const isUserAParticipant = groupTodoList.participants.some(participant => participant._id.toString() === userId)

        if (!isUserAParticipant) {
            throw ApiError.UserIsNotParticipant()
        }

        return groupTodoList.todoList
    }

    async addNewGroupToDo(groupId, newGroupTodo) {
        const groupTodoList = await GroupToDoModel.findOne({ _id: groupId })

        if (!groupTodoList) {
            throw ApiError.ToDoListDoesnotExist()
        }
        const newId = (new ObjectId()).toString()
        const newGroupTodoWithId = {
            ...newGroupTodo,
            _id: newId
        }

        groupTodoList.todoList.push(newGroupTodoWithId)

        await groupTodoList.save()

        const newGroupTodoForUser = { _id: groupTodoList._id, title: groupTodoList.title, todo: { ...newGroupTodoWithId } }

        await todoService.addNewToDo(newGroupTodo.author._id, newGroupTodoForUser, false)
    }

    async editGroupToDo(groupId, editedGroupTodo) {
        const groupTodoList = await GroupToDoModel.findOne({ _id: groupId })

        if (!groupTodoList) {
            throw ApiError.ToDoListDoesnotExist()
        }

        const index = groupTodoList.todoList.findIndex(todo => todo._id.toString() === editedGroupTodo._id)
        if (index > -1) {
            groupTodoList.todoList[index] = editedGroupTodo

            await groupTodoList.save()

            const editedGroupTodoForUser = { _id: groupTodoList._id, title: groupTodoList.title, todo: { ...editedGroupTodo } }

            await todoService.editToDo(editedGroupTodo.author._id, editedGroupTodoForUser, false)
        } else {
            throw ApiError.ToDoCantFindError()
        }
    }

    async deleteGroupToDo(groupId, todoId) {
        const groupTodoList = await GroupToDoModel.findOne({ _id: groupId })

        if (!groupTodoList) {
            throw ApiError.ToDoListDoesnotExist()
        }

        const index = groupTodoList.todoList.findIndex(todo => todo._id.toString() === todoId)
        if (index > -1) {
            await todoService.deleteToDo(groupTodoList.todoList[index].author._id.toString(), todoId, false, groupId)

            groupTodoList.todoList.splice(index, 1)

            await groupTodoList.save()
        } else {
            throw ApiError.ToDoCantFindError()
        }
    }

    async getGroupsInfo(userId) {
        const todoUserObj = await ToDoModel.findOne({ user: userId })
        const groupsIdList = todoUserObj.todoList.groupToDos.map(group => group._id)

        const groupsList = await GroupToDoModel.find({
            '_id': { $in: groupsIdList }
        })

        const groupsInfoList = groupsList.map(group => {
            let completedToDo = 0, uncompletedToDo = 0

            group.todoList.forEach(todo => {
                todo.completed === true ? completedToDo++ : uncompletedToDo++
            })

            return {
                _id: group._id,
                title: group.title,
                participants: group.participants,
                completedToDo: completedToDo,
                uncompletedToDo: uncompletedToDo
            }
        })

        return groupsInfoList
    }

    async leaveGroup(groupId, userId) {
        const groupTodoObj = await GroupToDoModel.findOne({ _id: groupId })
        const participantIndex = groupTodoObj.participants.findIndex(participant => participant._id.toString() === userId)

        if (participantIndex > -1) {
            groupTodoObj.participants.splice(participantIndex, 1)

            groupTodoObj.todoList = groupTodoObj.todoList.filter(todo => todo.author._id.toString() !== userId)

            await todoService.leaveGroup(groupId, userId)

            if (groupTodoObj.participants.length === 0) {
                await GroupToDoModel.deleteOne({ _id: groupId })
                console.log('GroupToDo was deleted because there are no more participants')
                return
            }

            groupTodoObj.save()
        } else {
            console.log('User is not participant already')
        }
    }

    async getUserList(groupId) {
        const groupTodoObj = await GroupToDoModel.findOne({ _id: groupId })

        if (!groupTodoObj) {
            throw ApiError.ToDoListDoesnotExist()
        }

        return groupTodoObj.participants
    }
}

module.exports = new GroupToDoService()