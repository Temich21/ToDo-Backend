const { model } = require("mongoose")

module.exports = class ToDoDto {
    id
    title
    description
    deadline

    constructor(model) {
        this.id = model.id
        this.title = model.title
        this.description = model.description
        this.deadline = model.deadline
    }
}