const { executeInsertIfEmpty } = require('../../../utils/executeInsertIfEmpty/executeInsertIfEmpty');
const { executeTableCreation } = require('../../../utils/executeTableCreation/executeTableCreation');

const createMotorTechUnitsTable = async (allowDrop = false) => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS motor_tech_units (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    )
  `;
  await executeTableCreation('motor_tech_units', createTableQuery, allowDrop);
};

const insertMotorTechNum = async () => {
  const insertQuery = `
    INSERT INTO motor_tech_units (name) VALUES
    ('M1000'),
    ('M1100'),
    ('M2000'),
    ('M2100')
  `;

  await executeInsertIfEmpty('motor_tech_units', insertQuery);
};

const createAllMotorTechUnitsTable = async (allowDrop = false) => {
  try {
    await createMotorTechUnitsTable(allowDrop);
    // await insertMotorTechNum();
  } catch (error) {
    throw new Error('Failed to create all tech_num tables');
  }
};

module.exports = { createAllMotorTechUnitsTable };
