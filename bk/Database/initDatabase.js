const { createTableTasks } = require('./models/Task/task')
const { createTableTaskReadStatus } = require('./models/Task/taskReadStatus')
const { createTableTasksComments } = require('./models/Task/tasksComments')
const { createTableDepartments } = require('./models/OrgStructure/departmens')
const { createTablePositions } = require('./models/OrgStructure/positions')
const { createTableSubdepartments } = require('./models/OrgStructure/subdepartments')
const { createTaskStatus } = require('./models/Task/taskStatus')
const { createTableUsers } = require('./models/User/user')
const { createTableTokens } = require('./models/User/token')
const { createTableWorkshops } = require('./models/venchel/workshop')
const { createVenchelTable } = require('./models/venchel/venchel')
const { createTableVenchelFiles } = require('./models/venchel/venchelFiles')
const { createTableVenchelComments } = require('./models/venchel/venchelCommets')
const { createTablePendingNotifications } = require('./models/Notification/pendingNotification')
const { createUserRoles } = require('./models/User/userRoles')

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
  createUserRoles()
  createTableUsers()
  createTableTokens()
  createTableWorkshops()
  createVenchelTable()
  createTableVenchelFiles()
  createTableVenchelComments()
  createTablePendingNotifications()
})

module.exports ={
  initDatabase,
}

