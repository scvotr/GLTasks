'use strict'
const {
  executeDatabaseQueryAsync
} = require("../../utils/executeDatabaseQuery/executeDatabaseQuery")

const createTask = async (data) => {
  let taskID;

  const command = `
  INSERT INTO tasks (task_id, task_descript, task_priority, appoint_user_id, appoint_department_id, appoint_subdepartment_id, responsible_position_id, responsible_department_id, responsible_subdepartment_id, task_status, deadline)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
`;

  try {
    await executeDatabaseQueryAsync(
      command,
      [
        data.fields.task_id,
        data.fields.task_descript,
        data.fields.task_priority,

        data.fields.appoint_user_id,
        data.fields.appoint_department_id,
        data.fields.appoint_subdepartment_id,

        // data.fields.responsible_user_id,
        data.fields.responsible_position_id,
        data.fields.responsible_department_id,
        data.fields.responsible_subdepartment_id,

        data.fields.task_status,
        data.fields.deadline,
      ], "run");
    taskID = data.fields.task_id;
  } catch (error) {
    console.error("createTask ERROR: ", error);
    throw new Error('Ошибка запроса к базе данных')
    return;
  }

  // Добавляем комментарий к задаче (опционально)
  if (data.fields.task_comment) {
    const command2 = `INSERT INTO task_comments (task_id, user_id ,comment) VALUES (?, ?, ?);`;
    try {
      await executeDatabaseQueryAsync(
        command2,
        [taskID, data.fields.appoint_user_id, data.fields.task_comment], "run");
    } catch (error) {
      console.error("Error adding task comment: ", error);
      throw new Error('Ошибка запроса к базе данных')
    }
  }

  // Добавляем файлы к задаче (опционально)
  for (let i = 0; i < data.fileNames.length; i++) {
    const file_name = data.fileNames[i];
    if (!file_name) {
      //.file_name || !file.file_path
      continue;
    }

    const command3 = `INSERT INTO task_files (task_id, file_name, file_path) VALUES (?, ?, ?);`;
    try {
      await executeDatabaseQueryAsync(command3, [taskID, file_name], "run");
      // console.log(`File ${file_name} added successfully to the task`);
    } catch (error) {
      console.error(`Error adding file ${file_name} to the task: `, error);
      throw new Error('Ошибка запроса к базе данных')
    }
  }
}

// Read (Чтение)
const getTaskById = async (taskId) => {
  // Реализация получения задачи по ее ID
}

const getTasksForUser = async (userId) => {
  // Реализация получения задач для конкретного пользователя
}

// Update (Обновление)
const updateTaskDescription = async (taskId, newDescription) => {
  // Реализация обновления описания задачи
}

const updateTaskStatus = async (taskId, newStatus) => {
  // Реализация обновления статуса задачи
}

// Delete (Удаление)
const deleteTask = async (taskId) => {
  // Реализация удаления задачи по ее ID
}

module.exports = {
  createTask,
  getTaskById,
  getTasksForUser,
  updateTaskDescription,
  updateTaskStatus,
  deleteTask
};