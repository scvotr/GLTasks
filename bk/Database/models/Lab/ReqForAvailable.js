'use strict'

const { appendField } = require('../../utils/appendField/appendField')
const { executeTableCreation } = require('../../utils/executeTableCreation/executeTableCreation')

const createReqForAvailableTable = async (allowDrop = false) => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS reqForAvailableTable (
      req_number INTEGER PRIMARY KEY AUTOINCREMENT,  -- Уникальный номер запроса
      reqForAvail_id TEXT UNIQUE,  -- Уникальный идентификатор запроса
      culture TEXT NOT NULL,
      tonnage TEXT NOT NULL,
      --
      total_tonnage TEXT, -- всего отгружено
      commentsThenClosed TEXT, -- комментарий к отчету
      aspiration_dust TEXT, -- аспирационные потери
      natural_loss TEXT, --естественная убыль
      destination_point TEXT, -- цель\получатель
      sub_sorting TEXT, -- подсортировка
      --
      classType TEXT,
      type TEXT,
      contractor TEXT NOT NULL,
      selectedDepartment INTEGER NOT NULL,
      creator INTEGER NOT NULL,
      creator_subDep INTEGER NOT NULL,
      creator_role TEXT NOT NULL,
      approved BOOLEAN NOT NULL DEFAULT FALSE,
      req_status TEXT, -- СОДЕРЖИТ ТЕКУЩИЙ СТАТУС запроса
      gost TEXT,  -- Добавлено поле для хранения ГОСТа
      yearOfHarvest TEXT,  -- Добавлено поле для хранения ГОСТа
      commentsThenCreate TEXT,
      indicators JSON,  -- Добавлено поле для хранения индикаторов в формате JSON
      actual_indicators JSON, -- Фактически отгружено
      status_history JSON,  
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME,
      approved_at DATETIME,
      -- 
      is_auto BOOLEAN NOT NULL DEFAULT FALSE, -- Отгружено авто
      is_railway BOOLEAN NOT NULL DEFAULT FALSE, -- Отгружено ЖД
      shipped TEXT -- Отгружено
      --
      in_progress_at DATETIME, -- Время отправки в работу
      canceled_at DATETIME, -- Время аннулирования
      on_confirm_at DATETIME, -- Время закрытия запроса
      closed_at DATETIME, -- Время закрытия запроса
      --
      FOREIGN KEY (creator) REFERENCES users(id)
    )
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
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (position_id) REFERENCES positions(id)
    );
  `
  await executeTableCreation('request_approvals', createTableQuery, allowDrop)
}

const createLabReqReadStatus = async (allowDrop = false) => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS lab_req_readStatus (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      req_id TEXT NOT NULL,
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
      req_id TEXT NOT NULL,
      user_id INTEGER NOT NULL,
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
      req_id TEXT NOT NULL,
      user_id INTEGER,
      file_name TEXT,
      file_path TEXT,
      uploaded_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(req_id) REFERENCES reqForAvailableTable(reqForAvail_id),
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `
  //  FROM tasks t
  //   --GROUP_CONCAT(f.file_name, '|') AS file_names,
  //   --GROUP_CONCAT(DISTINCT f.file_name) AS file_names,
  //   REPLACE(GROUP_CONCAT(DISTINCT f.file_name), ',', '|') AS file_names,

  //   LEFT JOIN task_files f ON t.task_id = f.task_id

  await executeTableCreation('lab_req_files', createTableQuery, allowDrop)
}
const createTableReqForLabStatusHistory = async (allowDrop = false) => {
  const createTableQuery = `
  CREATE TABLE IF NOT EXISTS lab_request_status_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    reqForAvail_id TEXT NOT NULL,
    status TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER NOT NULL,
    comment TEXT,
    FOREIGN KEY (reqForAvail_id) REFERENCES reqForAvailableTable(reqForAvail_id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
  `
  await executeTableCreation('lab_request_status_history', createTableQuery, allowDrop)
}

const createAllReqForAvailable = async (allowDrop = false) => {
  try {
    // -----new fields-----------------
    await appendField('reqForAvailableTable', 'yearOfHarvest', 'TEXT')
    await appendField('reqForAvailableTable', 'req_status', 'TEXT')

    await appendField('reqForAvailableTable', 'actual_indicators', 'JSON')
    await appendField('reqForAvailableTable', 'status_history', 'JSON')

    await appendField('reqForAvailableTable', 'in_progress_at', 'DATETIME')
    await appendField('reqForAvailableTable', 'canceled_at', 'DATETIME')
    await appendField('reqForAvailableTable', 'on_confirm_at', 'DATETIME')
    await appendField('reqForAvailableTable', 'closed_at', 'DATETIME')

    await appendField('reqForAvailableTable', 'total_tonnage', 'TEXT')
    await appendField('reqForAvailableTable', 'commentsThenClosed', 'TEXT')
    await appendField('reqForAvailableTable', 'aspiration_dust', 'TEXT')
    await appendField('reqForAvailableTable', 'natural_loss', 'TEXT')
    await appendField('reqForAvailableTable', 'destination_point', 'TEXT')
    await appendField('reqForAvailableTable', 'sub_sorting', 'TEXT')
    await appendField('reqForAvailableTable', 'is_auto', 'BOOLEAN')
    await appendField('reqForAvailableTable', 'is_railway', 'BOOLEAN')
    await appendField('reqForAvailableTable', 'shipped', 'TEXT')

    // -----new fields-----------------
    await createReqForAvailableTable(allowDrop)
    await createRequestApprovalsTable(allowDrop)
    await createLabReqReadStatus(allowDrop)
    await createTableReqForLabComments(allowDrop)
    await createTableReqForLabFiles(allowDrop)
    await createTableReqForLabStatusHistory(allowDrop)
  } catch (error) {
    console.log('Error creating tables: ', error)
    throw new Error('Failed to create all tables')
  }
}

module.exports = { createAllReqForAvailable }
