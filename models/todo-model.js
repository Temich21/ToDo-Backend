const { Schema, model } = require('mongoose')

// Schema for personal ToDos
const ToDoPesonalItemSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: false },
    deadline: { type: String, required: true },
    priority: { type: Number, required: true },
    completed: { type: Boolean, required: true }
})

// Schema for Group ToDos
const ToDoGroupItemSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, ref: 'Group' },
    title: { type: String, required: true },
    todos: [ToDoPesonalItemSchema]
})

const ToDoListSchema = new Schema({
    personalToDos: [ToDoPesonalItemSchema],
    groupToDos: [ToDoGroupItemSchema]
})

const ToDoSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    todoList: ToDoListSchema
})

module.exports = model('ToDo', ToDoSchema)