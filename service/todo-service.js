const ToDoModel = require('../models/todo-model')

class ToDoService {
    async createNewToDoList(userId) {
        const existingList = await ToDoModel.findOne({ user: userId })

         if (existingList) {
            console.log(`ToDo list for ${userId} is already exist`)
            return null
        }

        const newToDoList = await ToDoModel.create({ user: userId, todoList: [{id: '12345', title: 'Buy eggs'}, {id: '23456', title: 'Buy milk'}, {id: '423462', title: 'Clean house'}] })
        return newToDoList
    }

    async getToDoList(userId) {
        const todoList = await ToDoModel.findOne({ user: userId })
        return todoList.todoList
    }

    async addNewToDo(userId, newToDo) {
        const todoList = await ToDoModel.findOne({ user: userId })
        todoList.todoList.push(newToDo)
        todoList.save()
    }
}

module.exports = new ToDoService()