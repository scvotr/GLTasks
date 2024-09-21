const { executeDatabaseQueryAsync } = require('../../utils/executeDatabaseQuery/executeDatabaseQuery');

// Read
const getMachineTypeQ = async id => {
  try {
    const command = `SELECT * FROM machineTypes WHERE id = ?`;
    const rows = await executeDatabaseQueryAsync(command, [id]);
    return rows[0];
  } catch (error) {
    throw new Error('Ошибка запроса к базе данных');
  }
};

// Update
const updateMachineTypeQ = async (id, data) => {
  const { mech_name } = data;
  try {
    const command = `UPDATE machineTypes SET type = ? WHERE id = ?`;
    await executeDatabaseQueryAsync(command, [mech_name, id]);
  } catch (error) {
    throw new Error('Ошибка запроса к базе данных');
  }
};

// Delete
const deleteMachineTypeQ = async id => {
  try {
    const command = `DELETE FROM machineTypes WHERE id = ?`;
    await executeDatabaseQueryAsync(command, [id]);
  } catch (error) {
    throw new Error('Ошибка запроса к базе данных');
  }
};

module.exports = {
  getMachineTypeQ,
  updateMachineTypeQ,
  deleteMachineTypeQ,
};
