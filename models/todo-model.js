const { Schema, model } = require('mongoose')

const ToDoSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    todoList: {type: Array, default: []}
})

module.exports = model('ToDo', ToDoSchema)