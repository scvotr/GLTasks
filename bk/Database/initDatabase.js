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
const { createTableTasksFiles } = require('./models/Task/tasksFiles')
const { createTableSchedules, addCreatedOnField, addReportColumnToSchedules, addSchedulePriorityRateColumnToSchedules } = require('./models/Schedules/schedules')
const { createTableSchedulesComments } = require('./models/Schedules/schedulesComments')
const { testPGQuery, testPGQuery2 } = require('./queries/pg_test/test_pg_query')
const { createTableUsersPG } = require('./models/User/createTableUsersPG')

const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('../database.db')

const initDatabase = async() => {}

db.serialize(async () => {
  createTableTasks()
  createTaskStatus()
  createTableTaskReadStatus()
  createTableTasksFiles()
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
  createTableSchedules()
  createTableSchedulesComments()
  // addCreatedOnField()
  // addReportColumnToSchedules()
  addSchedulePriorityRateColumnToSchedules()
  // await testPGQuery()
  // await testPGQuery2()
  // createTableUsersPG()
})

module.exports ={
  initDatabase,
}

