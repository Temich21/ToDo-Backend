const { model } = require("mongoose")

module.exports = class ToDoDto {
    id
    title
    description
    deadline
    priority

    constructor(model) {
        this.id = model.id
        this.title = model.title
        this.description = model.description
        this.deadline = model.deadline
        this.priority = model.priority
    }
}