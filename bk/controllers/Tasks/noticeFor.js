'use strict'
const { updateReadStatusQ } = require("../../Database/queries/Task/readStatusQueries");
const {
  socketManager
} = require("../../utils/socket/socketManager");
const { sendEmailToUser, sendEmailToLead, sendEmailToGeneral } = require("./mailFor");

// const noticeToAppointUserT = async (text, data) => {
//   const io = socketManager.getIO()
//   io.to('user_' + data.appoint_user_id)
//     .emit('taskApproved', { message: text, taskData: data.task_id });
//     try {
//       await updateReadStatusQ({ task_id: data.task_id, user_id: data.appoint_user_id, read_status: 'unread' });
//       await sendEmailToUser(data.appoint_user_id, text, data)
//     } catch (error) {
//       throw new Error('Ошибка запроса к базе данных', error)
//     }
// }

const noticeToAppointUserT = async (text, data) => {
  const io = socketManager.getIO();
  
  if (io.sockets.sockets.has('user_' + data.appoint_user_id)) {
    io.to('user_' + data.appoint_user_id)
      .emit('taskApproved', { message: text, taskData: data.task_id });
  } else {
    console.warn(`Пользователь ${data.appoint_user_id} не подключен`);
  }

  try {
    await updateReadStatusQ({ task_id: data.task_id, user_id: data.appoint_user_id, read_status: 'unread' });
    await sendEmailToUser(data.appoint_user_id, text, data);
  } catch (error) {
    console.error('Ошибка при обновлении статуса или отправке email', error);
  }
}

const noticeToAppointLeadT = async (text, data) => {
  const io = socketManager.getIO()
  io.to('leadSubDep_' + data.appoint_subdepartment_id)
    .emit('taskApproved', { message: text, taskData: data.task_id });
    try {
      await updateReadStatusQ({ task_id: data.task_id, user_id: data.appoint_subdepartment_id, read_status: 'unread' });
      // !----------------
      await updateReadStatusQ({ task_id: data.task_id, user_id: data.responsible_subdepartment_id, read_status: 'readed' });
      await sendEmailToLead(data.appoint_subdepartment_id, text, data)
    } catch (error) {
      throw new Error('Ошибка запроса к базе данных', error)
    }
}

const noticeToGeneralT = async (text, data) => {
  const io = socketManager.getIO()
  io.to('generalDep_' + data.appoint_department_id)
    .emit('taskApproved', { message: text, taskData: data.task_id });
    try {
      await updateReadStatusQ({ task_id: data.task_id, user_id: data.appoint_department_id, read_status: 'unread' });
      await sendEmailToGeneral(data.appoint_department_id, text, data)
    } catch (error) {
      // throw new Error('Ошибка запроса к базе данных', error)
    }
}

const noticeAppoinToGeneralT = async (text, data) => {
  const io = socketManager.getIO()
  io.to('generalDep_' + data.appoint_department_id)
    .emit('taskApproved', { message: text, taskData: data.task_id });
    try {
      await updateReadStatusQ({ task_id: data.task_id, user_id: data.appoint_department_id, read_status: 'unread' });
      await sendEmailToGeneral(data.appoint_department_id, text, data)
    } catch (error) {
      throw new Error('Ошибка запроса к базе данных', error)
    }
}

const noticeResponceToGeneralT = async (text, data) => {
  const io = socketManager.getIO()
  io.to('generalDep_' + data.responsible_department_id)
    .emit('taskApproved', { message: text, taskData: data.task_id });
    try {
      await updateReadStatusQ({ task_id: data.task_id, user_id: data.responsible_department_id, read_status: 'unread' });
      await sendEmailToGeneral(data.responsible_department_id, text, data)
    } catch (error) {
      throw new Error('Ошибка запроса к базе данных', error)
    }
}

const noticeToResponceUserT = async (text, data) => {
  const io = socketManager.getIO()
  io.to('user_' + data.responsible_user_id)
    .emit('taskApproved', { message: text, taskData: data.task_id });
    try {
      await updateReadStatusQ({ task_id: data.task_id, user_id: data.responsible_user_id, read_status: 'unread' });
      await sendEmailToUser(data.responsible_user_id, text, data)
    } catch (error) {
      throw new Error('Ошибка запроса к базе данных', error)
    }
}

const noticeToResponceLeadT = async (text, data) => {
  const io = socketManager.getIO()
  io.to('leadSubDep_' + data.responsible_subdepartment_id)
    .emit('taskApproved', { message: text, taskData: data.task_id });
    try {
      await updateReadStatusQ({ task_id: data.task_id, user_id: data.responsible_subdepartment_id, read_status: 'unread' });
      // !----------------
      await updateReadStatusQ({ task_id: data.task_id, user_id: data.appoint_subdepartment_id, read_status: 'readed' });
      await sendEmailToLead(data.responsible_subdepartment_id, text, data)
    } catch (error) {
      throw new Error('Ошибка запроса к базе данных', error)
    }
}

module.exports ={
  noticeToAppointUserT,
  noticeToAppointLeadT,
  noticeToResponceUserT,
  noticeToResponceLeadT,
  noticeAppoinToGeneralT,
  noticeResponceToGeneralT,
  noticeToGeneralT,
}