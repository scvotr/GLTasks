'use strict'

const {
  addPendingNotification
} = require("../../Database/queries/Notification/pendingNotificationQueries");
const {
  addReadStatusQ,
  updateReadStatusQ
} = require("../../Database/queries/Task/readStatusQueries");
const {
  createTask,
  getAllTasksBySubDepQ,
  updateTaskStatusQ,
  getAllUserTasksQ,
  removeTaskQ,
  updateTaskSetResponsibleUserQ
} = require("../../Database/queries/Task/taskQueries");
const {
  removeFolder
} = require("../../utils/files/removeFolder");
const {
  saveAndConvert
} = require("../../utils/files/saveAndConvert");
const {
  socketManager
} = require("../../utils/socket/socketManager");
const { sendEmailToLead, sendEmailToUser } = require("./mailFor");
const {
  noticeToAppointUserT,
  noticeToResponceLeadT,
  noticeToAppointLeadT,
  noticeToResponceUserT
} = require("./noticeFor");

const sendResponseWithData = (res, data) => {
  res.setHeader('Content-Type', 'application/json');
  res.write(JSON.stringify(data));
  res.end();
};

const handleError = (res, error) => {
  console.log('handleError', error);
  res.statusCode = 500;
  res.end(JSON.stringify({
    error: error
  }));
};

class TasksControler {
  async addNewTask(req, res) {
    try {
      const authDecodeUserData = req.user
      const user_id = authDecodeUserData.id
      const postPayload = authDecodeUserData.payLoad
      const fields = postPayload.fields
      console.log('addNewTask', fields)
      const files = postPayload.files
      const taskFolderName = fields.task_id
      const fileNames = [];
      for (const [key, file] of Object.entries(files)) {
        try {
          const fileName = await saveAndConvert(file, 'tasks', taskFolderName)
          fileNames.push(fileName.fileName);
        } catch (error) {
          console.error('Error saving file:', error);
        }
      }
      const data = {
        fields,
        fileNames,
        user_id
      }

      try {
        await createTask(data)
      } catch (error) {
        handleError(res, `addNewTask: ${error}`)
      }

      const io = socketManager.getIO()

      const inOneDep = data.fields.appoint_department_id === data.fields.responsible_department_id;
      const inDifDep = data.fields.appoint_department_id !== data.fields.responsible_department_id;
      const inOneSubDep = data.fields.appoint_subdepartment_id === data.fields.responsible_subdepartment_id;
      const inDifSubDep = data.fields.appoint_subdepartment_id !== data.fields.responsible_subdepartment_id;

      const noticeToResponsibleUser = (user_id) => {
        io.in('user_' + fields.responsible_user_id).allSockets()
          .then(client => {
            if (client.size === 0) {
              addPendingNotification(fields.responsible_user_id, fields.task_id, false, 'Задача от руководителя')
              console.log('offline', client, fields.responsible_user_id)
            } else {
              addPendingNotification(fields.responsible_user_id, fields.task_id, true, 'Задача от руководителя')
              io.to('user_' + fields.responsible_user_id)
                .emit('taskApproved', {
                  message: 'Задача от руководителя',
                  taskData: fields.task_id
                })
              console.log('online', client, fields.responsible_user_id);
            }
          })
          .catch(error => {
            console.error(error); // Обработка ошибки
          });
      };

      const noticeToAppointUser = (user_id) => {
        io.in('user_' + fields.appoint_user_id).allSockets()
          .then(client => {
            if (client.size === 0) {
              addPendingNotification(fields.appoint_user_id, fields.task_id, false, 'Задача согласованна начальником')
              console.log('offline', client, fields.appoint_user_id)
            } else {
              addPendingNotification(fields.appoint_user_id, fields.task_id, true, 'Задача согласованна начальником')
              io.to('user_' + fields.appoint_user_id)
                .emit('taskApproved', {
                  message: 'Задача согласованна начальником',
                  taskData: fields.task_id
                })
              console.log('online', client, fields.appoint_user_id);
            }
          })
          .catch(error => {
            console.error(error); // Обработка ошибки
          });
      };

      const noticeToResponceLead = (user_id) => {
        io.in('leadSubDep_' + fields.responsible_subdepartment_id).allSockets()
          .then(client => {
            if (client.size === 0) {
              addPendingNotification(fields.responsible_subdepartment_id, fields.task_id, false, 'Новая задача для отдела')
              console.log('offline', client, fields.responsible_subdepartment_id)
            } else {
              addPendingNotification(fields.responsible_subdepartment_id, fields.task_id, true, 'Новая задача для отдела')
              io.to('leadSubDep_' + fields.responsible_subdepartment_id)
                .emit('taskApproved', {
                  message: 'Новая задача для отдела',
                  taskData: fields.task_id
                })
              console.log('online', client, fields.responsible_subdepartment_id);
            }
          })
          .catch(error => {
            console.error(error); // Обработка ошибки
          });
      };

      const noticeToLeadNewTask = (user_id) => {
        io.in('leadSubDep_' + fields.appoint_subdepartment_id).allSockets()
          .then(client => {
            if (client.size === 0) {
              addPendingNotification(fields.appoint_subdepartment_id, fields.task_id, false, 'Новая задача на согласование')
              console.log('offline', client, fields.appoint_subdepartment_id)
            } else {
              addPendingNotification(fields.appoint_subdepartment_id, fields.task_id, true, 'Новая задача на согласование')
              io.to('leadSubDep_' + fields.appoint_subdepartment_id)
                .emit('taskCreated', {
                  message: 'Новая задача на согласование',
                  taskData: fields.task_id
                })
              console.log('online', client, fields.appoint_subdepartment_id);
            }
          })
          .catch(error => {
            console.error(error); // Обработка ошибки
          });
      };

      if (data.fields.approved_on === 'true') {
        console.log('Задача от начальника');
        if (inOneDep && inOneSubDep) {
          console.log('Задача внутри одного отдела в одном департаменте addNewTask')
          try {
            noticeToResponsibleUser()
            await addReadStatusQ({
              task_id: fields.task_id,
              user_id: fields.appoint_subdepartment_id,
              read_status: 'unread'
            })
            await sendEmailToUser(fields)
          } catch (error) {
            throw new Error('Ошибка запроса к базе данных')
          }
        } else if (inOneDep && inDifSubDep) {
          console.log('Задача между отделами в одном департаменте addNewTask');
          try {
            noticeToResponceLead()
            await addReadStatusQ({
              task_id: fields.task_id,
              user_id: fields.responsible_subdepartment_id,
              read_status: 'unread'
            })
            await addReadStatusQ({
              task_id: fields.task_id,
              user_id: fields.appoint_subdepartment_id,
              read_status: 'readed'
            })
            await sendEmailToLead(fields.responsible_subdepartment_id, 'Новая задача', fields)
          } catch (error) {
            throw new Error('Ошибка запроса к базе данных')
          }
        } else if (inDifDep && inOneSubDep) {
          console.log('Задача внутри подразделения, но между разными отделами addNewTask');
        } else if (inDifDep && inDifSubDep) {
          console.log('Задача между разными подразделениями разных отделов addNewTask');
          try {
            noticeToResponceLead()
            await addReadStatusQ({
              task_id: fields.task_id,
              user_id: fields.responsible_subdepartment_id,
              read_status: 'unread'
            })
            await addReadStatusQ({
              task_id: fields.task_id,
              user_id: fields.appoint_subdepartment_id,
              read_status: 'readed'
            })
            await sendEmailToLead(fields.responsible_subdepartment_id, 'Новая задача', fields)
          } catch (error) {
            throw new Error('Ошибка запроса к базе данных')
          }
        }
      } else if (data.fields.setResponseUser_on === 'true') {
        if (inOneDep && inOneSubDep) {
          try {
            noticeToResponsibleUser()
            await addReadStatusQ({
              task_id: fields.task_id,
              user_id: fields.responsible_user_id,
              read_status: 'unread'
            })
            await sendEmailToUser(fields.responsible_user_id, 'Назначена новая задача', fields)
          } catch (error) {
            throw new Error('Ошибка запроса к базе данных')
          }
        }
      } else { //!-------------------------------------------------------------------------------------------
        console.log('Задача от сотрудника addNewTask');
        try {
          noticeToLeadNewTask()
          await addReadStatusQ({
            task_id: fields.task_id,
            user_id: fields.appoint_subdepartment_id,
            read_status: 'unread'
          })
          await addReadStatusQ({
            task_id: fields.task_id,
            user_id: data.user_id,
            read_status: 'readed'
          })
          await sendEmailToLead(fields.appoint_subdepartment_id, 'Новая задача на согласование', fields)
        } catch (error) {
          throw new Error('Ошибка запроса к базе данных')
        }
      }
      res.setHeader('Content-Type', 'application/json')
      res.statusCode = 200;
      res.end(JSON.stringify({
        message: 'Status accepted'
      }));
    } catch (error) {
      handleError(res, `addNewTask: ${error}`)
    }
  }
  // !-----------------------------------------------------------------------------------------------------------------------
  async updateTaskStatus(req, res) {
    try {
      const io = socketManager.getIO()
      const authDecodeUserData = req.user
      const data = JSON.parse(authDecodeUserData.payLoad)
      await updateTaskStatusQ(data)

      const inOneDep = data.appoint_department_id === data.responsible_department_id
      const inDifDep = data.appoint_department_id !== data.responsible_department_id
      const inOneSubDep = data.appoint_subdepartment_id === data.responsible_subdepartment_id
      const inDifSubDep = data.appoint_subdepartment_id !== data.responsible_subdepartment_id

      const noticeToAppointUser = (user_id) => {
        io.in('user_' + data.appoint_user_id).allSockets()
          .then(client => {
            if (client.size === 0) {
              addPendingNotification(data.appoint_user_id, data.task_id, false, 'Задача согласованна начальником updateTaskStatus')
              console.log('offline', client, data.appoint_user_id)
            } else {
              addPendingNotification(data.appoint_user_id, data.task_id, true, 'Задача согласованна начальником updateTaskStatus')
              io.to('user_' + data.appoint_user_id)
                .emit('taskApproved', {
                  message: 'Задача согласованна начальником',
                  taskData: data.task_id
                })
              console.log('online', client, data.appoint_user_id);
            }
          })
          .catch(error => {
            console.error(error); // Обработка ошибки
          })
      }
      const noticeToResponceLead = (lead_id) => {
        io.in('leadSubDep_' + data.responsible_subdepartment_id).allSockets()
          .then(client => {
            if (client.size === 0) {
              addPendingNotification(data.responsible_subdepartment_id, data.task_id, false, 'Новая задача для отдела updateTaskStatus')
              console.log('offline', client, data.responsible_subdepartment_id)
            } else {
              addPendingNotification(data.responsible_subdepartment_id, data.task_id, true, 'Новая задача для отдела updateTaskStatus')
              io.to('leadSubDep_' + data.responsible_subdepartment_id)
                .emit('taskApproved', {
                  message: 'Новая задача для отдела',
                  taskData: data.task_id
                })
              console.log('online', client, data.responsible_subdepartment_id);
            }
          })
          .catch(error => {
            console.error(error); // Обработка ошибки
          })
      }

      if (data.approved_on) {
        if (inOneDep && inOneSubDep) {
          console.log('Задача внутри одного отдела в одном департаменте updateTaskStatus')
          try {
            noticeToAppointUser()
            updateReadStatusQ({
              task_id: data.task_id,
              user_id: data.appoint_user_id,
              read_status: 'unread'
            })
            await sendEmailToUser(data.appoint_user_id, 'Задача согласованна')
          } catch (error) {
            throw new Error('Ошибка запроса к базе данных')
          }
        } else if (inOneDep && inDifSubDep) {
          console.log('Задача между отделами в одном департаменте updateTaskStatus');
          try {
            noticeToAppointUser()
            await updateReadStatusQ({
              task_id: data.task_id,
              user_id: data.appoint_user_id,
              read_status: 'unread'
            })
            await sendEmailToUser(data.appoint_user_id, 'Задача согласованна')
            noticeToResponceLead()
            await addReadStatusQ({
              task_id: data.task_id,
              user_id: data.responsible_subdepartment_id,
              read_status: 'unread'
            })
            await sendEmailToLead(data.responsible_subdepartment_id, 'Задача согласованна')
          } catch (error) {
            throw new Error('Ошибка запроса к базе данных')
          }
        } else if (inDifDep && inOneSubDep) {
          console.log('Задача внутри подразделения, но между разными отделами updateTaskStatus');

        } else if (inDifDep && inDifSubDep) {
          console.log('Задача между разными подразделениями разных отделов updateTaskStatus');
          try {
            noticeToAppointUser()
            await updateReadStatusQ({
              task_id: data.task_id,
              user_id: data.appoint_user_id,
              read_status: 'unread'
            })
            await sendEmailToUser(data.appoint_user_id, 'Задача согласованна')
            noticeToResponceLead()
            await addReadStatusQ({
              task_id: data.task_id,
              user_id: data.responsible_subdepartment_id,
              read_status: 'unread'
            })
            await sendEmailToLead(data.responsible_subdepartment_id, 'Задача согласованна')
          } catch (error) {
            throw new Error('Ошибка запроса к базе данных')
          }
        }
      }
      sendResponseWithData(res, data)
    } catch (error) {
      handleError(res, 'updateTaskStatus')
    }
  }
  async updateTaskSetResponsibleUser(req, res) {
    try {
      const io = socketManager.getIO()

      const authDecodeUserData = req.user
      const data = JSON.parse(authDecodeUserData.payLoad)
      await updateTaskSetResponsibleUserQ(data)

      const inOneDep = data.appoint_department_id === data.responsible_department_id;
      const inDifDep = data.appoint_department_id !== data.responsible_department_id;
      const inOneSubDep = data.appoint_subdepartment_id === data.responsible_subdepartment_id;
      const inDifSubDep = data.appoint_subdepartment_id !== data.responsible_subdepartment_id;

      const noticeToAppointUser = async () => {
        io.to('user_' + data.appoint_user_id)
          .emit('taskApproved', {
            message: 'Назначен исполнитель',
            taskData: data.task_id
          });
        try {
          await updateReadStatusQ({
            task_id: data.task_id,
            user_id: data.appoint_user_id,
            read_status: 'unread'
          });
          await sendEmailToUser(data.appoint_user_id, 'Назначен исполнитель')
        } catch (error) {
          throw new Error('Ошибка запроса к базе данных')
        }
      };

      const noticeToAppointLead = async () => {
        io.to('leadSubDep_' + data.appoint_subdepartment_id)
          .emit('taskApproved', {
            message: 'Назначен исполнитель',
            taskData: data.task_id
          });
        try {
          await updateReadStatusQ({
            task_id: data.task_id,
            user_id: data.appoint_subdepartment_id,
            read_status: 'unread'
          });
          await sendEmailToLead(data.appoint_subdepartment_id, 'Назначен исполнитель')
        } catch (error) {
          throw new Error('Ошибка запроса к базе данных')
        }
      };

      const noticeToResponceUser = async () => {
        io.to('user_' + data.responsible_user_id)
          .emit('taskApproved', {
            message: 'Назначена новая задача',
            taskData: data.task_id
          });
        try {
          await updateReadStatusQ({
            task_id: data.task_id,
            user_id: data.responsible_user_id,
            read_status: 'unread'
          })
          await sendEmailToUser(data.responsible_user_id, 'Назначена новая задача')
        } catch (error) {
          throw new Error('Ошибка запроса к базе данных')
        }
      };

      const noticeToResponceLead = async () => {
        io.to('leadSubDep_' + data.responsible_subdepartment_id)
          .emit('taskApproved', {
            message: 'Назначен исполнитель',
            taskData: data.task_id
          });
        try {
          await updateReadStatusQ({
            task_id: data.task_id,
            user_id: data.responsible_subdepartment_id,
            read_status: 'unread'
          })
          await sendEmailToLead(data.responsible_subdepartment_id, 'Назначен исполнитель')
        } catch (error) {
          throw new Error('Ошибка запроса к базе данных')
        }
      };
      //!------------------------------------------------------------------------------------------------------------
      if (data.setResponseUser_on) {
        if (inOneDep && inOneSubDep) {
          console.log('Задача внутри одного отдела в одном департаменте setResponseUser_on');
          await noticeToAppointUser();
          await noticeToResponceUser();

          // await noticeToAppointUserT(`Задача на проверку от пользователя ${data.user_name}`, data);
          // await noticeToAppointLeadT(`Задача на проверку от пользователя ${data.user_name}`, data);

          await addReadStatusQ({
            task_id: data.task_id,
            user_id: data.responsible_user_id,
            read_status: 'unread'
          });
        } else if (inOneDep && inDifSubDep) {
          console.log('Задача между отделами в одном департаменте setResponseUser_on');
          try {
            await noticeToAppointUser();
            await noticeToAppointLead();
            await noticeToResponceUser();
            await addReadStatusQ({
              task_id: data.task_id,
              user_id: data.responsible_user_id,
              read_status: 'unread'
            });
          } catch (error) {
            throw new Error('Ошибка запроса к базе данных')
          }
        } else if (inDifDep && inOneSubDep) {
          console.log('Задача внутри подразделения, но между разными отделами setResponseUser_on');
        } else if (inDifDep && inDifSubDep) {
          console.log('Задача между разными подразделениями разных отделов setResponseUser_on');
          try {
            await noticeToAppointUser();
            await noticeToAppointLead();
            await addReadStatusQ({
              task_id: data.task_id,
              user_id: data.responsible_user_id ? data.responsible_user_id : 0,
              read_status: 'unread'
            });
            await noticeToResponceUser();
          } catch (error) {
            throw new Error('Ошибка запроса к базе данных')
          }
        }
      }
      if (data.confirmation_on) {
        if (inOneDep && inOneSubDep) {
          console.log('Задача внутри одного отдела в одном департаменте confirmation_on');
          try {
            if (data.user_role === 'user') {
              console.log('На проверку внутри отдела от пользователя')
              try {
                await noticeToAppointUserT(`Задача на проверку от пользователя ${data.user_name}`, data);
                await noticeToAppointLeadT(`Задача на проверку от пользователя ${data.user_name}`, data);
              } catch (error) {
                throw new Error('Ошибка запроса к базе данных')
              }
            } else if (data.user_role === 'chife') {
              console.log('На проверку внутри отдела от Начальника')
              try {
                await noticeToAppointUserT('Задача на проверку от Руководителя!!!!!!!!', data);
                await noticeToResponceUserT('Задача на проверку от Руководителя!!!!!!!!!!', data);
              } catch (error) {
                throw new Error('Ошибка запроса к базе данных')
              }
            }
          } catch (error) {
            throw new Error('Ошибка запроса к базе данных', error);
          }
        } else if (inOneDep && inDifSubDep) {
          console.log('Задача между отделами в одном департаменте confirmation_on');
          try {
            await noticeToAppointUserT('Задача на проверку', data);
            await noticeToAppointLeadT('Задача на проверку', data);
            await noticeToResponceLeadT('Задача на проверку', data);
          } catch (error) {
            throw new Error('Ошибка запроса к базе данных', error);
          }
        } else if (inDifDep && inOneSubDep) {
          console.log('Задача внутри подразделения, но между разными отделами confirmation_on');
        } else if (inDifDep && inDifSubDep) {
          console.log('Задача между разными подразделениями разных отделов confirmation_on');
          try {
            await noticeToAppointUserT('Задача на проверку', data);
            await noticeToAppointLeadT('Задача на проверку', data);
          } catch (error) {
            throw new Error('Ошибка запроса к базе данных', error);
          }
        }
      }
      if (data.closed_on) {
        if (inOneDep && inOneSubDep) {
          console.log('Задача внутри одного отдела в одном департаменте closed_on');
          try {
            if (data.user_role === 'user') {
              console.log('закрыта внутри отдела Пользователем')
              await noticeToResponceUserT(`Задача закрыта ${data.user_name}`, data);
              await noticeToAppointLeadT(`Задача закрыта ${data.user_name}`, data);
            } else if (data.user_role === 'chife') {
              console.log('закрытаа внутри отдела Руководителем')
              await noticeToAppointUserT(`Задача закрыта Руководителем`, data);
              await noticeToResponceUserT(`Задача закрыта Руководителем`, data);
            }
          } catch (error) {
            throw new Error('Ошибка запроса к базе данных', error)
          }
        } else if (inOneDep && inDifSubDep) {
          console.log('Задача между отделами в одном департаменте closed_on');
          try {
            await noticeToAppointLeadT('Задача закрыта', data);
            await noticeToResponceUserT('Задача закрыта', data);
            await noticeToResponceLeadT('Задача закрыта', data);
          } catch (error) {
            throw new Error('Ошибка запроса к базе данных', error)
          }
        } else if (inDifDep && inOneSubDep) {
          console.log('Задача внутри подразделения, но между разными отделами closed_on');
        } else if (inDifDep && inDifSubDep) {
          console.log('Задача между разными подразделениями разных отделов closed_on');
          if (data.user_role === 'user') {
            console.log('закрытаа внутри отдела Полльзователем')
            try {
              await noticeToAppointLeadT('Задача закрыта', data);
              await noticeToResponceLeadT('Задача закрыта', data);
              await noticeToResponceUserT('Задача закрыта', data);
            } catch (error) {
              throw new Error('Ошибка запроса к базе данных', error)
            }
          } else if (data.user_role === 'chife') {
            console.log('закрытаа внутри отдела Руководителем')
            try {
              await noticeToAppointUserT(`Задача закрыта Руководителем`, data);
              await noticeToResponceUserT(`Задача закрыта Руководителем`, data);
            } catch (error) {
              throw new Error('Ошибка запроса к базе данных', error)
            }
          }
        }
      }
      if (data.reject_on) {
        if (inOneDep && inOneSubDep) {
          console.log('Задача внутри одного отдела в одном департаменте reject_on', data);
          try {
            if (data.user_role === 'user') {
              console.log('На отклонена внутри отдела Пользователем')
              await noticeToResponceUserT(`Задача отклонена ${data.user_name}`, data);
              await noticeToAppointLeadT(`Задача отклонена ${data.user_name}`, data);
            } else if (data.user_role === 'chife') {
              console.log('На отклонена внутри отдела Начальником')
              await noticeToAppointUserT(`Задача отклонена Руководителем`, data);
              await noticeToResponceUserT(`Задача отклонена Руководителем`, data);
            }
          } catch (error) {
            throw new Error('Ошибка запроса к базе данных', error)
          }
        } else if (inOneDep && inDifSubDep) {
          console.log('Задача между отделами в одном департаменте reject_on');
          try {
            await noticeToAppointLeadT('Задача отклонена', data)
            await noticeToResponceUserT('Задача отклонена', data)
            await noticeToResponceLeadT('Задача отклонена', data)
          } catch (error) {
            throw new Error('Ошибка запроса к базе данных', error)
          }
        } else if (inDifDep && inOneSubDep) {
          console.log('Задача внутри подразделения, но между разными отделами reject_on');
        } else if (inDifDep && inDifSubDep) {
          console.log('Задача между разными подразделениями разных отделов reject_on');
          try {
            await noticeToAppointLeadT('Задача отклонена', data);
            await noticeToResponceUserT('Задача отклонена', data);
            await noticeToResponceLeadT('Задача отклонена', data);
          } catch (error) {
            throw new Error('Ошибка запроса к базе данных', error)
          }
        }
      }

      sendResponseWithData(res, 'updateTaskSetResponsibleUser')
    } catch (error) {
      handleError(res, 'updateTaskSetResponsibleUser')
    }
  }

// !-----------------------------------------------------------------------------------------------------------------------
// !-----------------------------------------------------------------------------------------------------------------------
  async updateTaskStatusNew(req, res) {
    try {
      const io = socketManager.getIO()
      const authDecodeUserData = req.user
      const data = JSON.parse(authDecodeUserData.payLoad)
      // await updateTaskStatusQ(data)
  
      const inOneDep = data.appoint_department_id === data.responsible_department_id
      const inDifDep = data.appoint_department_id !== data.responsible_department_id
      const inOneSubDep = data.appoint_subdepartment_id === data.responsible_subdepartment_id
      const inDifSubDep = data.appoint_subdepartment_id !== data.responsible_subdepartment_id
  
      // console.log('updateTaskStatusNew', data)
      await sendEmailToUser(data.appoint_user_id, 'согл', data)

      sendResponseWithData(res, data)
    } catch (error) {
      handleError(res, 'updateTaskStatusNew')
    }
  }  
// !-----------------------------------------------------------------------------------------------------------------------
// !-----------------------------------------------------------------------------------------------------------------------


//?-------------------------------------------------------------------------- 
//?-------------------------------------------------------------------------- 
  async getAllTasksBySubDep(req, res) {
    try {
      const authDecodeUserData = req.user
      const subDep_id = authDecodeUserData.subdepartment_id
      const data = await getAllTasksBySubDepQ(subDep_id)
      sendResponseWithData(res, data)
    } catch (error) {
      handleError(res, 'getAllTasksBySubDep')
    }
  }
  async updateReadStatus(req, res) {
    try {
      const authDecodeUserData = req.user
      const postPayload = JSON.parse(authDecodeUserData.payLoad)
      await updateReadStatusQ(postPayload)
      res.setHeader('Content-Type', 'application/json')
      res.statusCode = 200;
      res.end(JSON.stringify({
        message: 'Status accepted'
      }));
    } catch (error) {
      handleError(res, 'updateReadStatus')
    }
  }
  async getAllUserTasks(req, res) {
    try {
      const authDecodeUserData = req.user
      const user_id = authDecodeUserData.id
      const data = await getAllUserTasksQ(user_id)
      sendResponseWithData(res, data)
    } catch (error) {
      handleError(res, 'getAllUserTasks')
    }
  }
  async removeTask(req, res) {
    try {
      const authDecodeUserData = req.user
      const postPayload = JSON.parse(authDecodeUserData.payLoad)
      const taskFolderName = postPayload.task_id
      await removeTaskQ(postPayload, taskFolderName)
      // await removeFolder(taskFolderName, 'tasks')
      sendResponseWithData(res, {
        ok: 'ok'
      })
    } catch (error) {
      handleError(res, 'removeTask')
    }
  }
}

module.exports = new TasksControler()


// task_id: '12ac8682-e241-45c2-9c53-949efbb06e60',
// task_status: 'approved',
// task_descript: 'aasas',
// task_comment: '',
// deadline: '2024-03-08',
// task_priority: 'false',
// appoint_user_id: '2',
// appoint_department_id: '2',
// appoint_subdepartment_id: '2',
// appoint_position_id: '2',
// responsible_user_id: '',
// responsible_department_id: '3',
// responsible_subdepartment_id: '5',
// responsible_position_id: '',
// filesToRemove: '',
// task_files: '',