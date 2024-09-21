const { executeDatabaseQueryAsync } = require('../../utils/executeDatabaseQuery/executeDatabaseQuery')

// Read all
const getAllPowersRangeQ = async () => {
  try {
    const command = `SELECT * FROM powerRange`
    const rows = await executeDatabaseQueryAsync(command, [])
    return rows
  } catch (error) {
    throw new Error('Ошибка запроса к базе данных')
  }
}

module.exports = {
  getAllPowersRangeQ,
}
