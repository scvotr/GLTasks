'use strict'

const { executeTableCreation } = require('../../utils/executeTableCreation/executeTableCreation')

const createReqForAvailableTable = async (allowDrop = false) => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS reqForAvailableTable (
      req_number INTEGER PRIMARY KEY AUTOINCREMENT,  -- Уникальный номер запроса
      reqForAvail_id TEXT UNIQUE,  -- Уникальный идентификатор запроса
      culture TEXT NOT NULL,
      tonnage TEXT NOT NULL,
      classType TEXT,
      type TEXT,
      contractor TEXT NOT NULL,
      selectedDepartment INTEGER NOT NULL,
      creator INTEGER NOT NULL,
      creator_subDep INTEGER NOT NULL,
      creator_role TEXT NOT NULL,
      approved BOOLEAN NOT NULL DEFAULT FALSE,
      gost TEXT,  -- Добавлено поле для хранения ГОСТа
      indicators JSON,  -- Добавлено поле для хранения индикаторов в формате JSON
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME,
      approved_at DATETIME,
      FOREIGN KEY (creator) REFERENCES users(id)
    );
  `
  await executeTableCreation('reqForAvailableTable', createTableQuery, allowDrop)
}

const createRequestApprovalsTable = async (allowDrop = false) => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS request_approvals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reqForAvail_id TEXT NOT NULL,
      user_id INTEGER NOT NULL,
      position_id INTEGER NOT NULL,
      status TEXT NOT NULL,
      approved_at DATETIME,
      FOREIGN KEY (reqForAvail_id) REFERENCES reqForAvailableTable(reqForAvail_id),
      FOREIGN KEY (user_id) REFERENCES users(id)
      FOREIGN KEY (position_id) REFERENCES positions(id)
    );
  `
  await executeTableCreation('request_approvals', createTableQuery, allowDrop)
}

const createLabReqReadStatus = async (allowDrop = false) => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS lab_req_readStatus (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      req_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      read_status TEXT NOT NULL,
      readd_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(req_id) REFERENCES request_approvals(reqForAvail_id),
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `
  await executeTableCreation('lab_req_readStatus', createTableQuery, allowDrop)
}

const createTableReqForLabComments = async (allowDrop = false) => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS lab_req_comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      req_id INTEGER,
      user_id INTEGER,
      comment VARCHAR(255),
      created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(req_id) REFERENCES reqForAvailableTable(reqForAvail_id),
      FOREIGN KEY(user_id) REFERENCES users(id)
    )  
  `
  await executeTableCreation('lab_req_comments', createTableQuery, allowDrop)
}

const createTableReqForLabFiles = async (allowDrop = false) => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS lab_req_files (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      req_id INTEGER,
      user_id INTEGER,
      file_name TEXT,
      file_path TEXT,
      uploaded_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(req_id) REFERENCES reqForAvailableTable(reqForAvail_id),
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `
  await executeTableCreation('lab_req_files', createTableQuery, allowDrop)
}

const createAllReqForAvailable = async (allowDrop = true) => {
  try {
    await createReqForAvailableTable(allowDrop)
    await createRequestApprovalsTable(allowDrop)
    await createLabReqReadStatus(allowDrop)
    await createTableReqForLabComments(allowDrop)
    await createTableReqForLabFiles(allowDrop)
  } catch (error) {
    console.log('Error creating tables: ', error)
    throw new Error('Failed to create all tables')
  }
}

module.exports = { createAllReqForAvailable }
