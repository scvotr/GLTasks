const { executeDatabaseQueryAsync, queryAsyncWraperParam } = require("../../utils/executeDatabaseQuery/executeDatabaseQuery")

// Добавление уведомления
const addPendingNotification = async (user_id, task_id, delivered_status, message) => {
  console.log(addPendingNotification)
  try {
    const command = `INSERT INTO pending_notifications (user_id, task_id, delivered_status ,message) VALUES (?, ?, ?, ?)`;
    await queryAsyncWraperParam(command, [user_id, task_id, delivered_status ? 'delivered' : 'not delivered', message], 'run'); // 'run' для добавления

    console.log('Notification added to pending_notifications table');
  } catch (error) {
    console.error('Error adding notification to pending_notifications:', error);
  }
};
// Обновление уведомления
const updatePendingNotification = async (userId, message) => {
  try {
    const command = `UPDATE pending_notifications SET message = ? WHERE user_id = ?`;
    await queryAsyncWraperParam(command, [message, userId], 'run'); // 'run' для обновления, обратите внимание на измененный порядок параметров
    console.log('Notification updated in pending_notifications table');
  } catch (error) {
    console.error('Error updating notification in pending_notifications:', error);
  }
};
// Получение уведомлений пользователя
const getPendingNotification = async (userId) => {
  try {
    const command = `SELECT * FROM pending_notifications WHERE user_id = ?`;
    return await queryAsyncWraperParam(command, [userId], 'all'); // 'all' для получения всех записей
  } catch (error) {
    console.error('Error getting notification from pending_notifications:', error);
  }
};
// Удаление уведомления
const deletePendingNotification = async (userId) => {
  try {
    const command = `DELETE FROM pending_notifications WHERE user_id = ?`;
    return await queryAsyncWraperParam(command, [userId], 'run'); // 'run' для удаления
  } catch (error) {
    console.error('Error deleting notification from pending_notifications:', error);
  }
};

module.exports = {
  addPendingNotification,
  updatePendingNotification,
  getPendingNotification,
  deletePendingNotification,
}