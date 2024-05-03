const { executeDatabaseQueryAsync } = require("../../utils/executeDatabaseQuery/executeDatabaseQuery");


const addNewCommentQ = async(data) => {
  const { task_id, user_id, comment } = data;
  try {
    const command = `INSERT INTO task_comments (task_id, user_id, comment) VALUES (?, ?, ?)`;
    await executeDatabaseQueryAsync(command, [task_id, user_id, comment]);
  } catch (error) {
    throw new Error('Ошибка запроса к базе данных');
  }
}

const getAllCommentsQ = async (task_id) => {
  try {
    const command = `
      SELECT
        tc.comment,
        tc.created_on,
        u.last_name
      FROM task_comments tc
      LEFT JOIN users u ON tc.user_id = u.id
      WHERE task_id = ?
      ORDER BY tc.created_on DESC
    `;
    const comments = await executeDatabaseQueryAsync(command, [task_id]);
    return comments;
  } catch (error) {
    throw new Error('Ошибка запроса к базе данных');
  }
};

module.exports = {
  addNewCommentQ,
  getAllCommentsQ,
}
