// Tasks
const tasks = []
exports.add = (task) => tasks.push(task)

// Start
exports.setup = function() {
    return Promise.all(tasks.map((promise) => {
        return promise()
    }))
}