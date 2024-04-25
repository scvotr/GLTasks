'use strict'

const {
  addPendingNotification
} = require("../../Database/queries/Notification/pendingNotificationQueries");
const {
  addNewCommentQ,
  getAllCommentsQ
} = require("../../Database/queries/Task/commentQueries");
const {
  getPreviewFileContent,
  getFullFileContent
} = require("../../Database/queries/Task/fileQueries");
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
  updateTaskByEventrQ,
  getAllTasksByDepQ
} = require("../../Database/queries/Task/taskQueries");
const {
  getLeadIdQ
} = require("../../Database/queries/User/userQuery");
const {
  removeFolder
} = require("../../utils/files/removeFolder");
const {
  saveAndConvert
} = require("../../utils/files/saveAndConvert");
const {
  socketManager
} = require("../../utils/socket/socketManager");
const {
  sendEmailToLead,
  sendEmailToUser,
  sendEmailToGeneral
} = require("./mailFor");
const {
  noticeToAppointUserT,
  noticeToResponceLeadT,
  noticeToAppointLeadT,
  noticeToResponceUserT,
  noticeToGeneralT,
  noticeAppoinToGeneralT,
  noticeResponceToGeneralT
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

      if (data.fields.setResponseUser_on === 'true') {
        try {
          console.log('Задача от начальника в свой отдел add_new_task')
          await addReadStatusQ({
            task_id: data.fields.task_id,
            user_id: data.fields.responsible_user_id,
            read_status: 'unread'
          })
          await noticeToResponceUserT('Задача от руководителя', data.fields)
          await addReadStatusQ({
            task_id: data.fields.task_id,
            user_id: data.fields.responsible_department_id,
            read_status: 'unread'
          })
          await noticeResponceToGeneralT('Задача от руководителя', data.fields)
          await updateReadStatusQ({
            task_id: data.fields.task_id,
            user_id: data.fields.appoint_subdepartment_id,
            read_status: 'readed'
          })
        } catch (error) {
          throw new Error('Ошибка запроса к базе данных', error)
        }
      } else if (data.fields.approved_on === 'true') {
        console.log('Задача от начальника add_new_task')
        if (inOneDep && inDifSubDep) {
          try {
            console.log('Задача от начальника в другой отдел своего департмента add_new_task')
            await addReadStatusQ({
              task_id: data.fields.task_id,
              user_id: data.fields.responsible_subdepartment_id,
              read_status: 'unread'
            })
            await noticeToResponceLeadT('Новая задача', data.fields)
            await addReadStatusQ({
              task_id: data.fields.task_id,
              user_id: data.fields.responsible_department_id,
              read_status: 'unread'
            })
            await noticeResponceToGeneralT('Новая задача', data.fields)
            await updateReadStatusQ({
              task_id: data.fields.task_id,
              user_id: data.fields.appoint_subdepartment_id,
              read_status: 'readed'
            })
          } catch (error) {
            throw new Error('Ошибка запроса к базе данных', error)
          }
        } else if (inDifDep && inDifSubDep) {
          try {
            console.log('Задача от начальника в другой департамент add_new_task')
            await addReadStatusQ({
              task_id: data.fields.task_id,
              user_id: data.fields.responsible_subdepartment_id,
              read_status: 'unread'
            })
            await noticeToResponceLeadT('Новая задача', data.fields)
            await addReadStatusQ({
              task_id: data.fields.task_id,
              user_id: data.fields.responsible_department_id,
              read_status: 'unread'
            })
            await noticeResponceToGeneralT('Новая задача', data.fields)
            await addReadStatusQ({
              task_id: data.fields.task_id,
              user_id: data.fields.appoint_department_id,
              read_status: 'unread'
            })
            await noticeAppoinToGeneralT('Новая задача', data.fields)
            await updateReadStatusQ({
              task_id: data.fields.task_id,
              user_id: data.fields.appoint_subdepartment_id,
              read_status: 'readed'
            })
          } catch (error) {
            throw new Error('Ошибка запроса к базе данных', error)
          }
        }
      } else {
        try {
          console.log('Задача от сотрудника addNewTask')
          await addReadStatusQ({
            task_id: data.fields.task_id,
            user_id: data.fields.appoint_user_id,
            read_status: 'readed'
          })
          await noticeToAppointLeadT('Новая задача', data.fields)
          await addReadStatusQ({
            task_id: data.fields.task_id,
            user_id: data.fields.appoint_subdepartment_id,
            read_status: 'unread'
          })
        } catch (error) {
          throw new Error('Ошибка запроса к базе данных', error)
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
  // !-----------------------------------------------------------------------------------------------------------------------
  async updateTaskStatusNew(req, res) {
    try {
      const io = socketManager.getIO()
      const authDecodeUserData = req.user
      const data = JSON.parse(authDecodeUserData.payLoad)
      console.log('updateTaskStatusNew', data)
      const inOneDep = data.appoint_department_id === data.responsible_department_id
      const inDifDep = data.appoint_department_id !== data.responsible_department_id
      const inOneSubDep = data.appoint_subdepartment_id === data.responsible_subdepartment_id
      const inDifSubDep = data.appoint_subdepartment_id !== data.responsible_subdepartment_id

      // console.log(data.approved_on === 'true')
      // console.log(data.setResponseUser_on === 'true')
      // console.log('inOneDep', inOneDep)
      // console.log('inDifDep', inDifDep)
      // console.log('inOneSubDep', inOneSubDep)
      // console.log('inDifSubDep', inDifSubDep)

      if (data.approved_on) {
        if (inOneDep && inOneSubDep) {
          console.log('Задача внутри одного отдела в одном департаменте approved_on');
          try {

          } catch (error) {
            throw new Error('Ошибка запроса к базе данных', error)
          }
        } else if (inOneDep && inDifSubDep) {
          console.log('Задача между отделами в одном департаменте approved_on')
          try {
            await updateTaskStatusQ(data)
            await noticeToAppointUserT('Задача согласованна Руководителем', data)
            await addReadStatusQ({
              task_id: data.task_id,
              user_id: data.responsible_subdepartment_id,
              read_status: 'unread'
            })
            await noticeToResponceLeadT('Новая задача', data)
            await addReadStatusQ({
              task_id: data.task_id,
              user_id: data.appoint_department_id,
              read_status: 'unread'
            })
            await addReadStatusQ({
              task_id: data.task_id,
              user_id: data.responsible_department_id,
              read_status: 'unread'
            })
            await noticeResponceToGeneralT('Новая задача', data)
            await updateReadStatusQ({
              task_id: data.task_id,
              user_id: data.appoint_subdepartment_id,
              read_status: 'readed'
            })
          } catch (error) {
            throw new Error('Ошибка запроса к базе данных', error)
          }
        } else if (inDifDep && inDifSubDep) {
          console.log('Задача между департаментов approved_on')
          try {
            await updateTaskStatusQ(data)
            await noticeToAppointUserT('Задача согласованна Руководителем', data)
            await addReadStatusQ({
              task_id: data.task_id,
              user_id: data.responsible_subdepartment_id,
              read_status: 'unread'
            })
            await noticeToResponceLeadT('Новая задача', data)
            await addReadStatusQ({
              task_id: data.task_id,
              user_id: data.responsible_department_id,
              read_status: 'unread'
            })
            await noticeResponceToGeneralT('Новая задача', data)
            await addReadStatusQ({
              task_id: data.task_id,
              user_id: data.appoint_department_id,
              read_status: 'unread'
            })
            await noticeAppoinToGeneralT('Новая задача', data)
            await updateReadStatusQ({
              task_id: data.task_id,
              user_id: data.appoint_subdepartment_id,
              read_status: 'readed'
            })
          } catch (error) {
            throw new Error('Ошибка запроса к базе данных', error)
          }
        }
      }
      if (data.setResponseUser_on) {
        if (inOneDep && inOneSubDep) {
          console.log('Задача внутри одного отдела в одном департаменте setResponseUser_on');
          try {
            await updateTaskByEventrQ(data)
            await addReadStatusQ({
              task_id: data.task_id,
              user_id: data.responsible_user_id ? data.responsible_user_id : 0,
              read_status: 'unread'
            })
            await noticeToAppointUserT('Назанчен отвественный', data)
            await noticeToResponceUserT('Новая задача', data)
            await addReadStatusQ({
              task_id: data.task_id,
              user_id: data.appoint_department_id,
              read_status: 'unread'
            })
            await noticeAppoinToGeneralT('Новая задача', data)
            await updateReadStatusQ({
              task_id: data.task_id,
              user_id: data.appoint_subdepartment_id,
              read_status: 'readed'
            })
          } catch (error) {
            throw new Error('Ошибка запроса к базе данных', error)
          }
        } else if (inOneDep && inDifSubDep) {
          console.log('Задача между отделами в одном департаменте setResponseUser_on')
          try {
            await updateTaskByEventrQ(data)
            const lead_id = await getLeadIdQ(data.appoint_subdepartment_id)
            const leadIsCreator = lead_id[0].id === data.appoint_user_id ? true : false
            await noticeToAppointUserT('Назанчен отвественный', data)
            leadIsCreator ? null : await noticeToAppointLeadT('Назанчен отвественный', data)
            // ! WTF!!!
            await updateReadStatusQ({
              task_id: data.task_id,
              user_id: data.appoint_subdepartment_id,
              read_status: 'unread'
            })
            await addReadStatusQ({
              task_id: data.task_id,
              user_id: data.responsible_user_id ? data.responsible_user_id : 0,
              read_status: 'unread'
            })
            await noticeToResponceUserT('Новая задача', data)
            await noticeAppoinToGeneralT('Назначен отвественный', data)
          } catch (error) {
            throw new Error('Ошибка запроса к базе данных', error)
          }
        } else if (inDifDep && inDifSubDep) {
          console.log('Задача между департаментов setResponseUser_on')
          try {
            const lead_id = await getLeadIdQ(data.appoint_subdepartment_id)
            const leadIsCreator = lead_id[0].id === data.appoint_user_id ? true : false
            await updateTaskByEventrQ(data)
            await noticeToAppointUserT('Назанчен отвественный', data)
            leadIsCreator ? null : await noticeToAppointLeadT('Назанчен отвественный', data)
            // ! WTF!!!
            await updateReadStatusQ({
              task_id: data.task_id,
              user_id: data.appoint_subdepartment_id,
              read_status: 'unread'
            })
            await addReadStatusQ({
              task_id: data.task_id,
              user_id: data.responsible_user_id ? data.responsible_user_id : 0,
              read_status: 'unread'
            })
            await noticeToResponceUserT('Новая задача', data)
            await noticeAppoinToGeneralT('Назанчен отвественный', data) //?
            await noticeResponceToGeneralT('Назанчен отвественный', data) //?
            await updateReadStatusQ({
              task_id: data.task_id,
              user_id: data.responsible_subdepartment_id,
              read_status: 'readed'
            })
          } catch (error) {
            throw new Error('Ошибка запроса к базе данных', error)
          }
        }
      }

      if (data.confirmation_on) {
        if (inOneDep && inOneSubDep) {
          console.log('Задача внутри одного отдела в одном департаменте confirmation_on');
          try {
            await updateTaskByEventrQ(data)
            const lead_id = await getLeadIdQ(data.appoint_subdepartment_id)
            const leadIsCreator = lead_id[0].id === data.appoint_user_id ? true : false
            if (data.user_role === 'user' && leadIsCreator) {
              await noticeToAppointLeadT('Задача отправленна на проверку', data)
            } else if (data.user_role === 'user' && !leadIsCreator) {
              await noticeToAppointLeadT('Задача отправленна на проверку', data)
              await noticeToAppointUserT('Задача отправленна на проверку', data)
              await noticeAppoinToGeneralT('Задача отправленна на проверку', data)
            } else if (data.user_role === 'chife' && data.appoint_user_id === data.current_user) {
              await noticeToResponceUserT('Задача на проверку', data)
              await noticeAppoinToGeneralT('Задача отправленна на проверку', data)
            } else if (data.user_role === 'chife' && data.appoint_user_id !== data.current_user) {
              await noticeToAppointUserT('Задача на проверку', data)
              await noticeToResponceUserT('Задача на проверку', data)
              await noticeAppoinToGeneralT('Задача отправленна на проверку', data)
            }
          } catch (error) {
            throw new Error('Ошибка запроса к базе данных', error)
          }
        } else if (inOneDep && inDifSubDep) {
          console.log('Задача между отделами в одном департаменте confirmation_on')
          try {
            await updateTaskByEventrQ(data)
            const lead_id = await getLeadIdQ(data.appoint_subdepartment_id)
            const leadIsCreator = lead_id[0].id === data.appoint_user_id ? true : false
            await noticeToAppointUserT('Задача на проверку', data)
            leadIsCreator ? null : await noticeToAppointLeadT('Задача на проверку', data)
            // ! WTF!!!
            await updateReadStatusQ({
              task_id: data.task_id,
              user_id: data.appoint_subdepartment_id,
              read_status: 'unread'
            })
            data.current_user === data.responsible_user_id ? await noticeToResponceLeadT('Задача отправленна на проверку', data) : await noticeToResponceUserT('Задача отправленна на проверку', data)
            await noticeAppoinToGeneralT('Задача на проверку', data)
          } catch (error) {
            throw new Error('Ошибка запроса к базе данных', error)
          }
        } else if (inDifDep && inDifSubDep) {
          console.log('Задача между департаментов confirmation_on')
          try {
            await updateTaskByEventrQ(data)
            const lead_id = await getLeadIdQ(data.appoint_subdepartment_id)
            const leadIsCreator = lead_id[0].id === data.appoint_user_id ? true : false
            await noticeToAppointUserT('Задача на проверку', data)
            leadIsCreator ? null : await noticeToAppointLeadT('Задача на проверку', data)
            await noticeAppoinToGeneralT('Задача на проверку', data) //?
            await noticeResponceToGeneralT('Задача на проверку', data) //?
            await updateReadStatusQ({
              task_id: data.task_id,
              user_id: data.responsible_subdepartment_id,
              read_status: 'readed'
            })
            // ! WTF!!!
            await updateReadStatusQ({
              task_id: data.task_id,
              user_id: data.appoint_subdepartment_id,
              read_status: 'unread'
            })
            data.current_user === data.responsible_user_id ? await noticeToResponceLeadT('Задача отправленна на проверку', data) : await noticeToResponceUserT('Задача отправленна на проверку', data)
          } catch (error) {
            throw new Error('Ошибка запроса к базе данных', error)
          }
        }
      }

      if (data.closed_on) {
        if (inOneDep && inOneSubDep) {
          console.log('Задача внутри одного отдела в одном департаменте closed_on');
          try {
            await updateTaskByEventrQ(data)
            const lead_id = await getLeadIdQ(data.appoint_subdepartment_id)
            const leadIsCreator = lead_id[0].id === data.appoint_user_id ? true : false
            if (data.user_role === 'user' && leadIsCreator) {
              await noticeToAppointLeadT('Задача закрыта', data)
              await noticeAppoinToGeneralT('Задача закрыта', data)
            } else if (data.user_role === 'user' && !leadIsCreator) {
              await noticeToAppointLeadT('Задача закрыта', data)
              await noticeToResponceUserT('Задача закрыта', data)
              await noticeAppoinToGeneralT('Задача закрыта', data)
            } else if (data.user_role === 'chife' && data.appoint_user_id === data.current_user) {
              await noticeToResponceUserT('Задача закрыта', data)
              await noticeAppoinToGeneralT('Задача закрыта', data)
            } else if (data.user_role === 'chife' && data.appoint_user_id !== data.current_user) {
              await noticeToAppointUserT('Задача закрыта Руководителем', data)
              await noticeToResponceUserT('Задача закрыта Руководителем', data)
              await noticeAppoinToGeneralT('Задача закрыта', data)
            }
          } catch (error) {
            throw new Error('Ошибка запроса к базе данных', error)
          }
        } else if (inOneDep && inDifSubDep) {
          console.log('Задача между отделами в одном департаменте closed_on')
          try {
            await updateTaskByEventrQ(data)
            await noticeToResponceUserT('Задача закрыта', data)
            await noticeToResponceLeadT('Задача закрыта', data)
            await noticeAppoinToGeneralT('Задача закрыта', data)
            if (data.user_role === 'user') {
              await noticeToAppointLeadT('Задача закрыта', data)
            } else if (data.user_role === 'chife' && data.appoint_user_id === data.current_user) {
              null
            } else if (data.user_role === 'chife' && data.appoint_user_id !== data.current_user) {
              await noticeToAppointUserT('Задача закрыта Руководителем', data)
            }
          } catch (error) {
            throw new Error('Ошибка запроса к базе данных', error)
          }
        } else if (inDifDep && inDifSubDep) {
          console.log('Задача между департаментов closed_on')
          try {
            await updateTaskByEventrQ(data)
            await noticeToResponceUserT('Задача закрыта', data)
            await noticeToResponceLeadT('Задача закрыта', data)
            await noticeAppoinToGeneralT('Задача закрыта', data) //?
            await noticeResponceToGeneralT('Задача закрыта', data) //?
            if (data.user_role === 'user') {
              await noticeToAppointLeadT('Задача закрыта', data)
            } else if (data.user_role === 'chife' && data.appoint_user_id === data.current_user) {
              null
            } else if (data.user_role === 'chife' && data.appoint_user_id !== data.current_user) {
              await noticeToAppointUserT('Задача закрыта Руководителем', data)
              await updateReadStatusQ({
                task_id: data.task_id,
                user_id: data.appoint_subdepartment_id,
                read_status: 'readed'
              })
            }
          } catch (error) {
            throw new Error('Ошибка запроса к базе данных', error)
          }
        }
      }

      sendResponseWithData(res, data)
    } catch (error) {
      handleError(res, 'updateTaskStatusNew')
    }
  }
  // !-----------------------------------------------------------------------------------------------------------------------
  // !-----------------------------------------------------------------------------------------------------------------------


  //?-------------------------------------------------------------------------- 
  //?-------------------------------------------------------------------------- 
  async getAllTasksByDep(req, res) {
    try {
      const authDecodeUserData = req.user
      const dep_id = authDecodeUserData.department_id
      const data = await getAllTasksByDepQ(dep_id)
      sendResponseWithData(res, data)
    } catch (error) {
      handleError(res, 'getAllTasksByDep')
    }
  }
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
  async getPreviewFileContent(req, res) {
    try {
      const authDecodeUserData = req.user
      const postPayload = JSON.parse(authDecodeUserData.payLoad)
      const data = await getPreviewFileContent(postPayload)
      sendResponseWithData(res, data)
    } catch (error) {
      handleError(res, 'getPreviewFileContent')
    }
  }
  async getFullFileContent(req, res) {
    try {
      const authDecodeUserData = req.user
      const postPayload = JSON.parse(authDecodeUserData.payLoad)
      const data = await getFullFileContent(postPayload)
      sendResponseWithData(res, data)
    } catch (error) {
      handleError(res, 'getFullFileContent')
    }
  }
  async addTaskComment(req, res) {
    try {
      const authDecodeUserData = req.user
      const postPayload = JSON.parse(authDecodeUserData.payLoad)
      await addNewCommentQ(postPayload)
      sendResponseWithData(res, 'addTaskCommet')
    } catch (error) {
      handleError(res, 'addTaskCommet')
    }
  }
  async getAllTaskComments(req, res) {
    try {
      const authDecodeUserData = req.user
      const postPayload = JSON.parse(authDecodeUserData.payLoad)
      const data = await getAllCommentsQ(postPayload)
      sendResponseWithData(res, data)
    } catch (error) {
      handleError(res, 'getAllTaskCommets')
    }
  }
}

module.exports = new TasksControler()