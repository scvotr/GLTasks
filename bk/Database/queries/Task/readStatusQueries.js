'use strict'
const { executeDatabaseQueryAsync } = require("../../utils/executeDatabaseQuery/executeDatabaseQuery")

const addReadStatusQ = async(data) => {
  const {task_id, user_id, read_status} = data
  try {
    const command = `INSERT INTO task_read_status (task_id, user_id, read_status) VALUES (?, ?, ?)`
    await executeDatabaseQueryAsync(command, [task_id, user_id, read_status])
  } catch (error) {
    throw new Error('Ошибка запроса к базе данных')
  }
}

const updateReadStatusQ = async (data) => {
  const { task_id, user_id, read_status } = data;
  try {
    const command = `UPDATE task_read_status SET read_status = ? WHERE task_id = ? AND user_id = ?`;
    await executeDatabaseQueryAsync(command, [read_status, task_id, user_id]);
  } catch (error) {
    throw new Error('Ошибка запроса к базе данных');
  }
};

module.exports = {
  addReadStatusQ,
  updateReadStatusQ,
}