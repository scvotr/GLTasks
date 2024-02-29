const { createTableTasks } = require('./models/Task/task')
const { createTableTaskReadStatus } = require('./models/Task/taskReadStatus')
const { createTableTasksComments } = require('./models/Task/tasksComments')
const { createTableDepartments } = require('./models/OrgStructure/departments')
const { createTablePositions } = require('./models/OrgStructure/positions')
const { createTableSubdepartments } = require('./models/OrgStructure/subdepartments')
const { createTaskStatus } = require('./models/Task/taskStatus')
const { createTableUsers } = require('./models/User/user')
const { createTableTokens } = require('./models/User/token')

const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('../database.db')

const initDatabase = async() => {}

db.serialize(async () => {
  createTableTasks()
  createTaskStatus()
  createTableTaskReadStatus()
  createTableTasksComments()
  createTableDepartments()
  createTableSubdepartments()
  createTablePositions()
  createTableUsers()
  createTableTokens()
})

module.exports ={
  initDatabase,
}

