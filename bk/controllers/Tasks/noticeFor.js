'use strict'
const { updateReadStatusQ } = require("../../Database/queries/Task/readStatusQueries");
const {
  socketManager
} = require("../../utils/socket/socketManager");

const noticeToAppointUserT = async (text, data) => {
  const io = socketManager.getIO()
  io.to('user_' + data.appoint_user_id)
    .emit('taskApproved', { message: text, taskData: data.task_id });
    try {
      await updateReadStatusQ({ task_id: data.task_id, user_id: data.appoint_user_id, read_status: 'unread' });
    } catch (error) {
      throw new Error('Ошибка запроса к базе данных', error)
    }
};

const noticeToAppointLeadT = async (text, data) => {
  const io = socketManager.getIO()
  io.to('leadSubDep_' + data.appoint_subdepartment_id)
    .emit('taskApproved', { message: text, taskData: data.task_id });
    try {
      await updateReadStatusQ({ task_id: data.task_id, user_id: data.appoint_subdepartment_id, read_status: 'unread' });
    } catch (error) {
      throw new Error('Ошибка запроса к базе данных', error)
    }
};

const noticeToResponceUserT = async (text, data) => {
  const io = socketManager.getIO()
  io.to('user_' + data.responsible_user_id)
    .emit('taskApproved', { message: text, taskData: data.task_id });
    try {
      await updateReadStatusQ({ task_id: data.task_id, user_id: data.responsible_user_id, read_status: 'unread' });
    } catch (error) {
      throw new Error('Ошибка запроса к базе данных', error)
    }
};

const noticeToResponceLeadT = async (text, data) => {
  const io = socketManager.getIO()
  io.to('leadSubDep_' + data.responsible_subdepartment_id)
    .emit('taskApproved', { message: text, taskData: data.task_id });
    try {
      await updateReadStatusQ({ task_id: data.task_id, user_id: data.responsible_subdepartment_id, read_status: 'unread' });
    } catch (error) {
      throw new Error('Ошибка запроса к базе данных', error)
    }
};

module.exports ={
  noticeToAppointUserT,
  noticeToAppointLeadT,
  noticeToResponceUserT,
  noticeToResponceLeadT,
}