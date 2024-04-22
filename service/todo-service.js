const ToDoModel = require('../models/todo-model')
const ApiError = require('../exceptions/api-error')
const { group } = require('console')

class ToDoService {
    async createNewToDoList(userId) {
        const existingList = await ToDoModel.findOne({ user: userId })

        if (existingList) {
            console.log(`ToDo list for ${userId} is already exist`)
            return
        }

        const newToDoObj = await ToDoModel.create(
            {
                user: userId,
                todoList: {
                    personalToDos: [],
                }
            }
        )
        return newToDoObj
    }

    async getToDoList(userId, isPersonal) {
        const todoObj = await ToDoModel.findOne({ user: userId })

        if (!todoObj) {
            throw ApiError.ToDoListDoesnotExist()
        }

        if (isPersonal) {
            return todoObj.todoList.personalToDos
        }

        return todoObj.todoList.groupToDos
    }

    async addNewToDo(userId, newToDo, isPersonal) {
        const todoObj = await ToDoModel.findOne({ user: userId })

        if (!todoObj) {
            throw ApiError.ToDoListDoesnotExist()
        }

        if (isPersonal) {
            todoObj.todoList.personalToDos.push(newToDo)
            await todoObj.save()
        } else {
            const groupIndex = todoObj.todoList.groupToDos.findIndex(groupTodoList => groupTodoList._id.toString() === newToDo._id.toString())

            if (groupIndex > -1) {
                todoObj.todoList.groupToDos[groupIndex].todos.push(newToDo.todo)
                await todoObj.save()
            } else {
                const newGroupTodoList = { _id: newToDo._id, title: newToDo.title, todos: [newToDo.todo] }
                todoObj.todoList.groupToDos.push(newGroupTodoList)
                await todoObj.save()
            }
        }
    }

    async editToDo(userId, editedToDo, isPersonal) {
        const todoObj = await ToDoModel.findOne({ user: userId })

        if (!todoObj) {
            throw ApiError.ToDoListDoesnotExist()
        }

        if (isPersonal) {
            const index = todoObj.todoList.personalToDos.findIndex(todo => todo._id.toString() === editedToDo._id)

            if (index > -1) {
                todoObj.todoList.personalToDos[index] = editedToDo
                await todoObj.save()
            } else {
                throw ApiError.ToDoCantFindError()
            }
        } else {
            const groupIndex = todoObj.todoList.groupToDos.findIndex(groupTodoList => groupTodoList._id.toString() === editedToDo._id.toString())

            if (groupIndex > -1) {
                const todoIndex = todoObj.todoList.groupToDos[groupIndex].todos.findIndex(todo => todo._id.toString() === editedToDo.todo._id)

                if (todoIndex > -1) {
                    todoObj.todoList.groupToDos[groupIndex].todos[todoIndex] = editedToDo.todo
                    await todoObj.save()
                } else {
                    throw ApiError.ToDoCantFindError()
                }

            } else {
                throw ApiError.ToDoCantFindError()
            }
        }
    }

    async deleteToDo(userId, todoId, isPersonal, groupId) {
        const todoObj = await ToDoModel.findOne({ user: userId })

        if (!todoObj) {
            throw ApiError.ToDoListDoesnotExist()
        }

        if (isPersonal) {
            const index = todoObj.todoList.personalToDos.findIndex(todo => todo._id.toString() === todoId)
            if (index > -1) {
                todoObj.todoList.personalToDos.splice(index, 1)
                await todoObj.save()
            } else {
                throw ApiError.ToDoCantFindError()
            }
        } else {
            const groupIndex = todoObj.todoList.groupToDos.findIndex(groupTodoList => groupTodoList._id.toString() === groupId)

            if (groupIndex > -1) {
                const todoIndex = todoObj.todoList.groupToDos[groupIndex].todos.findIndex(todo => todo._id.toString() === todoId)

                if (todoIndex > -1) {
                    todoObj.todoList.groupToDos[groupIndex].todos.splice(todoIndex, 1)
                    await todoObj.save()
                } else {
                    throw ApiError.ToDoCantFindError()
                }

            } else {
                throw ApiError.ToDoCantFindError()
            }
        }
    }

    async getAllUserToDos(userId) {
        const todoList = await ToDoModel.findOne({ user: userId }).lean()

        if (!todoList) {
            throw ApiError.ToDoListDoesnotExist()
        }

        const allUserToDos = [...todoList.todoList.personalToDos]

        todoList.todoList.groupToDos.forEach(group => {
            if (!group.length) {
                group.todos.forEach((todo) => {
                    allUserToDos.push({ groupTitle: group.title, ...todo })
                })
            }
        })

        return allUserToDos
    }

    async addGroup(userId, groupInfo) {
        const todoObj = await ToDoModel.findOne({ user: userId })

        if (!todoObj) {
            throw ApiError.ToDoListDoesnotExist()
        }

        const newGroupTodoList = { _id: groupInfo._id, title: groupInfo.title, todos: [] }
        todoObj.todoList.groupToDos.push(newGroupTodoList)
        await todoObj.save()
    }

    async leaveGroup(groupId, userId) {
        const todoObj = await ToDoModel.findOne({ user: userId })

        if (!todoObj) {
            throw ApiError.ToDoListDoesnotExist()
        }

        const groupIndex = todoObj.todoList.groupToDos.findIndex(groupToDo => groupToDo._id.toString() === groupId)

        if (groupIndex > -1) {
            todoObj.todoList.groupToDos.splice(groupIndex, 1)

            await todoObj.save()
        } else {
            console.log('Group do not exist already')
        }

    }
}

module.exports = new ToDoService()