const { executeDatabaseQueryAsync } = require("../../utils/executeDatabaseQuery/executeDatabaseQuery")

const createTableTasks = async () => {
  try {
    await executeDatabaseQueryAsync(
      // command
      `CREATE TABLE IF NOT EXISTS tasks (
           id INTEGER PRIMARY KEY AUTOINCREMENT,
           task_id INTEGER NOT NULL,
           task_descript TEXT,
           task_priority TEXT,
           task_status TEXT NOT NULL,
           deadline DATETIME,
           appoint_user_id INTEGER NOT NULL,
           appoint_department_id INTEGER NOT NULL,
           appoint_subdepartment_id  INTEGER NOT NULL,
           appoint_position_id INTEGER NULL,
           responsible_user_id INTEGER NULL,
           responsible_department_id INTEGER NOT NULL,
           responsible_subdepartment_id INTEGER NOT NULL,
           responsible_position_id INTEGER NULL,
           created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
           approved_on DATETIME,                              -- Дата согласования задачи
           reject_on DATETIME,                                -- Дата отклонения задачи
           confirmation_on DATETIME,                          -- Дата запрос на подтверждение задачи
           closed_on DATETIME,                                -- Дата закрытия задачи
           setResponseSubDep_on DATETIME,                     -- Дата назначения отдела
           setResponseUser_on DATETIME,                       -- Дата назначения пользователя
           FOREIGN KEY(appoint_user_id) REFERENCES users(id)
           FOREIGN KEY(appoint_department_id) REFERENCES departments(id),
           FOREIGN KEY(appoint_subdepartment_id) REFERENCES subdepartments(id)
           FOREIGN KEY(appoint_position_id) REFERENCES position(id)
           FOREIGN KEY(responsible_user_id) REFERENCES users(id)
           FOREIGN KEY(responsible_department_id) REFERENCES departments(id),
           FOREIGN KEY(responsible_subdepartment_id) REFERENCES subdepartments(id)
           FOREIGN KEY(responsible_position_id) REFERENCES position(id)
       )`, [])
  } catch (error) {
    console.log('DB ERROR - createTableTasks: ', error)
  }
}

module.exports = {
  createTableTasks
}

// class Task {
//   async createTaskTable() {
//     try {
//       await executeDatabaseQueryAsync(
//         `CREATE TABLE IF NOT EXISTS tasks (
//             id INTEGER PRIMARY KEY AUTOINCREMENT,
//             task_id INTEGER NOT NULL,
//           )`, "run"
//       )
//     } catch (error) {
//       console.log('DB ERROR createTaskTable: ', error)
//     }
//   }
// }

// module.exports = Task