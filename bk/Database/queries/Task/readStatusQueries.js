'use strict'
const { executeDatabaseQueryAsync } = require("../../utils/executeDatabaseQuery/executeDatabaseQuery")

const addReadStatus = async(data) => {
  const {task_id, user_id} = data
  try {
    const command = `INSERT INTO task_read_status (task_id, user_id, read_status) VALUES (?, ?, ?)`
    await executeDatabaseQueryAsync(command, [task_id, user_id, 'unread'])
  } catch (error) {
    throw new Error('Ошибка запроса к базе данных')
  }
}

module.exports = {
  addReadStatus,
}