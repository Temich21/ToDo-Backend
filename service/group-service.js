const GroupToDoModel = require('../models/group-model')
const todoService = require('./todo-service')
const ApiError = require('../exceptions/api-error')
const { ObjectId } = require('mongodb')

class GroupToDoService {
    async createNewGroupToDoList(data) {
        const newGroupToDoList = await GroupToDoModel.create(
            {
                title: data.title,
                createdBy: data.userId,
                createdDate: (new Date()).toString(),
                participents: [{ _id: data.userId, email: "rahmat97@mail.ru", name: "Artem Rakhmatullin" }],
                todoList: [
                    {
                        title: "Buy eggs",
                        author: { _id: data.userId, email: "rahmat97@mail.ru", name: "Artem Rakhmatullin" },
                        description: "I have to go to the supermarker and buy eggs.",
                        deadline: "2021-09-13",
                        priority: 2,
                        completed: false
                    },
                    {
                        title: "Buy milk",
                        author: { _id: data.userId, email: "rahmat97@mail.ru", name: "Artem Rakhmatullin" },
                        description: "I have to go to the supermarker and buy milk.",
                        deadline: "2021-09-13",
                        priority: 3,
                        completed: false
                    },
                    {
                        title: "Clean house",
                        author: { _id: data.userId, email: "rahmat97@mail.ru", name: "Artem Rakhmatullin" },
                        description: "We are waiting guests and we need to clean house.",
                        deadline: "2021-09-15",
                        priority: 1,
                        completed: false
                    },
                    {
                        title: "Clean house 2",
                        author: { _id: 'sacxz', email: "v1@mail.ru", name: "Bla bla" },
                        description: "We are waiting guests and we need to clean house. 2",
                        deadline: "2021-09-13",
                        priority: 1,
                        completed: false
                    },
                ],
            }
        )

        return newGroupToDoList._id
    }

    async getGroupToDoList(groupId) {
        const groupTodoList = await GroupToDoModel.findById(groupId)

        if (!groupTodoList) {
            throw ApiError.ToDoListDoesnotExist()
        }

        return groupTodoList.todoList
    }

    async addNewGroupToDo(groupId, newGroupTodo) {
        const groupTodoList = await GroupToDoModel.findById(groupId)

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
        const groupTodoList = await GroupToDoModel.findById(groupId)

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
        const groupTodoList = await GroupToDoModel.findById(groupId)

        if (!groupTodoList) {
            throw ApiError.ToDoListDoesnotExist()
        }

        const index = groupTodoList.todoList.findIndex(todo => todo._id.toString() === todoId)
        if (index > -1) {
            console.log(groupTodoList.todoList[index].author._id.toString());
            await todoService.deleteToDo(groupTodoList.todoList[index].author._id.toString(), todoId, false, groupId)
            
            groupTodoList.todoList.splice(index, 1)

            await groupTodoList.save()
        } else {
            throw ApiError.ToDoCantFindError()
        }
    }
}

module.exports = new GroupToDoService()