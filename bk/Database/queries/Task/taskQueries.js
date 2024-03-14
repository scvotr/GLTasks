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

const getAllTasksBySubDep = async (subDep_id) => {
  const command = `
    SELECT 
      t.task_id,
      t.task_descript,
      t.task_priority,
      t.task_status,
      t.deadline,
      t.appoint_user_id,
      t.created_on,
      t.approved_on,          -- Дата согласования задачи
      t.reject_on,            -- Дата отклонения задачи
      t.confirmation_on,      -- Дата запрос на подтверждение задачи
      t.closed_on,            -- Дата закрытия задачи
      t.setResponseSubDep_on, -- Дата назначения отдела
      t.setResponseUser_on,   -- Дата назначения пользователя
      appoint_user.name AS appoint_user_name,
      t.appoint_department_id, 
      appoint_departments.name AS appoint_department_name,
      t.appoint_subdepartment_id,
      appoint_subdepartments.name AS appoint_subdepartment_name,
      t.responsible_user_id,
      responsible_user.name AS responsible_user_name,
      t.responsible_department_id, 
      responsible_departments.name AS responsible_department_name,
      t.responsible_subdepartment_id,
      responsible_subdepartments.name AS responsible_subdepartment_name,
      t.responsible_position_id,
      responsible_position.name AS responsible_position_name,
      GROUP_CONCAT(f.file_name, '|') AS file_names,
      trs.read_status AS read_status
    FROM tasks t
      LEFT JOIN users AS appoint_user ON t.appoint_user_id = appoint_user.id
      LEFT JOIN departments AS appoint_departments ON t.appoint_department_id = appoint_departments.id
      LEFT JOIN subdepartments AS appoint_subdepartments ON t.appoint_subdepartment_id = appoint_subdepartments.id
      LEFT JOIN users AS responsible_user ON t.responsible_user_id = responsible_user.id
      LEFT JOIN departments AS responsible_departments ON t.responsible_department_id = responsible_departments.id
      LEFT JOIN subdepartments AS responsible_subdepartments ON t.responsible_subdepartment_id = responsible_subdepartments.id
      LEFT JOIN positions AS responsible_position ON t.responsible_position_id = responsible_position.id
      LEFT JOIN task_files f ON t.task_id = f.task_id
      LEFT JOIN (
        SELECT task_id, GROUP_CONCAT(read_status, '|') AS read_status
        FROM task_read_status
        GROUP BY task_id
      ) trs ON t.task_id = trs.task_id
    WHERE ? IN (t.appoint_subdepartment_id, t.responsible_subdepartment_id)
    GROUP BY t.task_id `;
  try {
    const taskFiles = await queryAsyncWraperParam(command, [subDep_id]);
    return await getThumbnailFiles(taskFiles);
  } catch (error) {
    console.error("getAllUserTasksFiles ERROR: ", error);
  }
}

module.exports = {
  createTask,
  getTaskById,
  getTasksForUser,
  updateTaskDescription,
  updateTaskStatus,
  deleteTask,
  getAllTasksBySubDep,
};