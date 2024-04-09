module.exports = class ApiError extends Error {
    status
    errors

    constructor(status, message, errors) {
        super(message)
        this.status = status
        this.errors = errors
    }

    static UnauthorizedError() {
        return new ApiError(401, 'You are not authorized!')
    }   

    static BadRequest(message, errors=[]) {
        return new ApiError(400, message, errors)
    }

    static ToDoListDoesnotExist() {
        return new ApiError(404, 'ToDo List does not exist')
    }

    static ToDoCantFindError() {
        return new ApiError(400, 'Canot find needed todo')
    }

    static UserIsNotParticipant() {
        return new ApiError(403, 'You are not in participant list!')
    }
}