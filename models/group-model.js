const { Schema, model } = require('mongoose')
// как сделать так чтобьы делались без айди
const UserForToDoSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, ref: 'User' },
    email: { type: String, unique: true, required: true },
    name: { type: String, required: true }
})

const ToDoItemSchema = new Schema({
    author: {type: Object, required: true},
    title: { type: String, required: true },
    description: { type: String, required: false },
    deadline: { type: String, required: true },
    priority: { type: Number, required: true },
    completed: { type: Boolean, required: true }
})

const GroupToDoSchema = new Schema({
    title: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    createdDate: { type: String, required: true },
    participents: [UserForToDoSchema],
    todoList: [ToDoItemSchema]
})

module.exports = model('Group', GroupToDoSchema)