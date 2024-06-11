'use strict'

const { addPendingNotification } = require('../../Database/queries/Notification/pendingNotificationQueries')
const { addNewCommentQ, getAllCommentsQ } = require('../../Database/queries/Task/commentQueries')
const { getPreviewFileContent, getFullFileContent } = require('../../Database/queries/Task/fileQueries')
const { addReadStatusQ, updateReadStatusQ } = require('../../Database/queries/Task/readStatusQueries')
const {
  createTask,
  getAllTasksBySubDepQ,
  updateTaskStatusQ,
  getAllUserTasksQ,
  removeTaskQ,
  updateTaskByEventrQ,
  getAllTasksByDepQ,
  deleteTaskFileQ,
  updateTaskDataQ,
} = require('../../Database/queries/Task/taskQueries')
const { getLeadIdQ } = require('../../Database/queries/User/userQuery')
const { deleteFile } = require('../../utils/files/deleteFile')
const { removeFolder } = require('../../utils/files/removeFolder')
const { saveAndConvert } = require('../../utils/files/saveAndConvert')
const { socketManager } = require('../../utils/socket/socketManager')
const { sendEmailToLead, sendEmailToUser, sendEmailToGeneral } = require('./mailFor')
const {
  noticeToAppointUserT,
  noticeToResponceLeadT,
  noticeToAppointLeadT,
  noticeToResponceUserT,
  noticeToGeneralT,
  noticeAppoinToGeneralT,
  noticeResponceToGeneralT,
} = require('./noticeFor')

const sendResponseWithData = (res, data) => {
  res.setHeader('Content-Type', 'application/json')
  res.write(JSON.stringify(data))
  res.end()
}

const handleError = (res, error) => {
  console.log('handleError', error)
  res.statusCode = 500
  res.end(
    JSON.stringify({
      error: error,
    })
  )
}

class TasksControler {
  async addNewTask(req, res) {
    try {
      const authDecodeUserData = req.user
      const user_id = authDecodeUserData.id
      const postPayload = authDecodeUserData.payLoad
      const fields = postPayload.fields
      const files = postPayload.files
      const taskFolderName = fields.task_id
      const fileNames = []
      for (const [key, file] of Object.entries(files)) {
        try {
          const fileName = await saveAndConvert(file, 'tasks', taskFolderName)
          fileNames.push(fileName.fileName)
        } catch (error) {
          console.error('Error saving file:', error)
        }
      }
      const data = {
        fields,
        fileNames,
        user_id,
      }

      try {
        await createTask(data)
      } catch (error) {
        handleError(res, `addNewTask: ${error}`)
      }

      const io = socketManager.getIO()

      const inOneDep = data.fields.appoint_department_id === data.fields.responsible_department_id
      const inDifDep = data.fields.appoint_department_id !== data.fields.responsible_department_id
      const inOneSubDep = data.fields.appoint_subdepartment_id === data.fields.responsible_subdepartment_id
      const inDifSubDep = data.fields.appoint_subdepartment_id !== data.fields.responsible_subdepartment_id

      if (data.fields.setResponseUser_on === 'true') {
        try {
          console.log('Задача от начальника в свой отдел add_new_task')
          await addReadStatusQ({
            task_id: data.fields.task_id,
            user_id: data.fields.responsible_user_id,
            read_status: 'unread',
          })
          await noticeToResponceUserT('Задача от руководителя', data.fields)
          await addReadStatusQ({
            task_id: data.fields.task_id,
            user_id: data.fields.responsible_department_id,
            read_status: 'unread',
          })
          await noticeResponceToGeneralT('Задача от руководителя', data.fields)
          await updateReadStatusQ({
            task_id: data.fields.task_id,
            user_id: data.fields.appoint_subdepartment_id,
            read_status: 'readed',
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
              read_status: 'unread',
            })
            await noticeToResponceLeadT('Новая задача', data.fields)
            await addReadStatusQ({
              task_id: data.fields.task_id,
              user_id: data.fields.responsible_department_id,
              read_status: 'unread',
            })
            await noticeResponceToGeneralT('Новая задача', data.fields)
            await updateReadStatusQ({
              task_id: data.fields.task_id,
              user_id: data.fields.appoint_subdepartment_id,
              read_status: 'readed',
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
              read_status: 'unread',
            })
            await noticeToResponceLeadT('Новая задача', data.fields)
            await addReadStatusQ({
              task_id: data.fields.task_id,
              user_id: data.fields.responsible_department_id,
              read_status: 'unread',
            })
            await noticeResponceToGeneralT('Новая задача', data.fields)
            await addReadStatusQ({
              task_id: data.fields.task_id,
              user_id: data.fields.appoint_department_id,
              read_status: 'unread',
            })
            await noticeAppoinToGeneralT('Новая задача', data.fields)
            await updateReadStatusQ({
              task_id: data.fields.task_id,
              user_id: data.fields.appoint_subdepartment_id,
              read_status: 'readed',
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
            read_status: 'readed',
          })
          await noticeToAppointLeadT('Новая задача', data.fields)
          await addReadStatusQ({
            task_id: data.fields.task_id,
            user_id: data.fields.appoint_subdepartment_id,
            read_status: 'unread',
          })
        } catch (error) {
          throw new Error('Ошибка запроса к базе данных', error)
        }
      }
      res.setHeader('Content-Type', 'application/json')
      res.statusCode = 200
      res.end(
        JSON.stringify({
          message: 'Status accepted',
        })
      )
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
          console.log('Задача внутри одного отдела в одном департаменте approved_on')
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
              read_status: 'unread',
            })
            await noticeToResponceLeadT('Новая задача', data)
            await addReadStatusQ({
              task_id: data.task_id,
              user_id: data.appoint_department_id,
              read_status: 'unread',
            })
            await addReadStatusQ({
              task_id: data.task_id,
              user_id: data.responsible_department_id,
              read_status: 'unread',
            })
            await noticeResponceToGeneralT('Новая задача', data)
            await updateReadStatusQ({
              task_id: data.task_id,
              user_id: data.appoint_subdepartment_id,
              read_status: 'readed',
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
              read_status: 'unread',
            })
            await noticeToResponceLeadT('Новая задача', data)
            await addReadStatusQ({
              task_id: data.task_id,
              user_id: data.responsible_department_id,
              read_status: 'unread',
            })
            await noticeResponceToGeneralT('Новая задача', data)
            await addReadStatusQ({
              task_id: data.task_id,
              user_id: data.appoint_department_id,
              read_status: 'unread',
            })
            await noticeAppoinToGeneralT('Новая задача', data)
            await updateReadStatusQ({
              task_id: data.task_id,
              user_id: data.appoint_subdepartment_id,
              read_status: 'readed',
            })
          } catch (error) {
            throw new Error('Ошибка запроса к базе данных', error)
          }
        }
      }
      if (data.setResponseUser_on) {
        if (inOneDep && inOneSubDep) {
          console.log('Задача внутри одного отдела в одном департаменте setResponseUser_on')
          try {
            await updateTaskByEventrQ(data)
            await addReadStatusQ({
              task_id: data.task_id,
              user_id: data.responsible_user_id ? data.responsible_user_id : 0,
              read_status: 'unread',
            })
            await noticeToAppointUserT('Назанчен отвественный', data)
            await noticeToResponceUserT('Новая задача', data)
            await addReadStatusQ({
              task_id: data.task_id,
              user_id: data.appoint_department_id,
              read_status: 'unread',
            })
            await noticeAppoinToGeneralT('Новая задача', data)
            await updateReadStatusQ({
              task_id: data.task_id,
              user_id: data.appoint_subdepartment_id,
              read_status: 'readed',
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
              read_status: 'unread',
            })
            await addReadStatusQ({
              task_id: data.task_id,
              user_id: data.responsible_user_id ? data.responsible_user_id : 0,
              read_status: 'unread',
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
              read_status: 'unread',
            })
            await addReadStatusQ({
              task_id: data.task_id,
              user_id: data.responsible_user_id ? data.responsible_user_id : 0,
              read_status: 'unread',
            })
            await noticeToResponceUserT('Новая задача', data)
            await noticeAppoinToGeneralT('Назанчен отвественный', data) //?
            await noticeResponceToGeneralT('Назанчен отвественный', data) //?
            await updateReadStatusQ({
              task_id: data.task_id,
              user_id: data.responsible_subdepartment_id,
              read_status: 'readed',
            })
          } catch (error) {
            throw new Error('Ошибка запроса к базе данных', error)
          }
        }
      }

      if (data.confirmation_on) {
        if (inOneDep && inOneSubDep) {
          console.log('Задача внутри одного отдела в одном департаменте confirmation_on')
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
              read_status: 'unread',
            })
            data.current_user === data.responsible_user_id
              ? await noticeToResponceLeadT('Задача отправленна на проверку', data)
              : await noticeToResponceUserT('Задача отправленна на проверку', data)
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
              read_status: 'readed',
            })
            // ! WTF!!!
            await updateReadStatusQ({
              task_id: data.task_id,
              user_id: data.appoint_subdepartment_id,
              read_status: 'unread',
            })
            data.current_user === data.responsible_user_id
              ? await noticeToResponceLeadT('Задача отправленна на проверку', data)
              : await noticeToResponceUserT('Задача отправленна на проверку', data)
          } catch (error) {
            throw new Error('Ошибка запроса к базе данных', error)
          }
        }
      }

      if (data.closed_on) {
        if (inOneDep && inOneSubDep) {
          console.log('Задача внутри одного отдела в одном департаменте closed_on')
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
                read_status: 'readed',
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
      res.statusCode = 200
      res.end(
        JSON.stringify({
          message: 'Status accepted',
        })
      )
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

  async updateTask(req, res) {
    try {
      const authDecodeUserData = req.user
      const postPayload = authDecodeUserData.payLoad
      const fields = postPayload.fields
      const files = postPayload.files
      const fileNames = []
      const taskFolderName = postPayload.fields.task_id
      const filesToRemoveName = postPayload.fields.filesToRemove

      if (filesToRemoveName) {
        try {
          const arrFilesToRemove = filesToRemoveName.split(',')
          for (const [key] of Object.entries(arrFilesToRemove)) {
            await deleteTaskFileQ(taskFolderName, arrFilesToRemove[key])
            await deleteFile(arrFilesToRemove[key], 'uploads/tasks', taskFolderName)
          }
        } catch (error) {
          throw new Errorr('Произошла ошибка при удалении файла:', error)
        }
      }
      if (files) {
        try {
          for (const [key, file] of Object.entries(files)) {
            const fileName = await saveAndConvert(file, 'tasks', taskFolderName)
            fileNames.push(fileName.fileName)
          }
        } catch (error) {
          throw new Error('Произошла ошибка при сохранении файла:', error)
        }
      }
      await updateTaskDataQ(postPayload, fileNames)
      sendResponseWithData(res, 'updateTask')
    } catch (error) {
      handleError(res, 'updateTask')
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
        ok: 'ok',
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
      // Условия уведомления:
      await handleTaskComment(postPayload)
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

const handleTaskComment = async postPayload => {
  const {
    user_role,
    task_status,
    user_id,
    appoint_user_id,
    user_dep,
    user_subDep,
    appoint_subdepartment_id,
    responsible_user_id,
    responsible_subdepartment_id,
    responsible_department_id,
    appoint_department_id,
    task_id,
  } = postPayload
  console.log('>>>>>>>>>>..', postPayload)

  const inDifDep = appoint_department_id !== responsible_department_id
  const inOneSubDep = appoint_subdepartment_id === responsible_subdepartment_id
  const inDifSubDep = !inDifDep && !inOneSubDep

  switch (true) {
    // !##################################################
    case inDifDep:
      switch (user_role) {
        case 'general':
          if (responsible_user_id === null) {
            if (user_dep === appoint_department_id) {
              try {
                await noticeToResponceLeadT('Новая коментарий', postPayload)
                await noticeResponceToGeneralT('Новая коментарий', postPayload)
                const ts = await getLeadIdQ(postPayload.appoint_subdepartment_id)
                if (appoint_user_id === ts[0].id) {
                  await noticeToAppointLeadT('Новая коментарий', postPayload)
                } else {
                  await noticeToAppointUserT('Новый коментарий', postPayload)
                  await noticeToAppointLeadT('Новая коментарий', postPayload)
                }
              } catch (error) {
                handleError(res, 'handleTaskComment')
              }
            }
            if (user_dep === responsible_department_id) {
              try {
                await noticeAppoinToGeneralT('Новая коментарий', postPayload)
                await noticeToResponceLeadT('Новая коментарий', postPayload)
                const ts = await getLeadIdQ(postPayload.appoint_subdepartment_id)
                if (appoint_user_id === ts[0].id) {
                  await noticeToAppointLeadT('Новая коментарий', postPayload)
                } else {
                  await noticeToAppointUserT('Новый коментарий', postPayload)
                  await noticeToAppointLeadT('Новая коментарий', postPayload)
                }
              } catch (error) {
                handleError(res, 'handleTaskComment')
              }
            }
          }
          if (responsible_user_id !== null) {
            if (user_dep === appoint_department_id) {
              try {
                await noticeToResponceLeadT('Новая коментарий', postPayload)
                await noticeResponceToGeneralT('Новая коментарий', postPayload)
                await noticeToResponceUserT('Новый коментарий', postPayload)
                const ts = await getLeadIdQ(postPayload.appoint_subdepartment_id)
                if (appoint_user_id === ts[0].id) {
                  await noticeToAppointLeadT('Новая коментарий', postPayload)
                } else {
                  await noticeToAppointUserT('Новый коментарий', postPayload)
                  await noticeToAppointLeadT('Новая коментарий', postPayload)
                }
              } catch (error) {
                handleError(res, 'handleTaskComment')
              }
            }
            if (user_dep === responsible_department_id) {
              try {
                await noticeAppoinToGeneralT('Новая коментарий', postPayload)
                await noticeToResponceLeadT('Новая коментарий', postPayload)
                await noticeToResponceUserT('Новый коментарий', postPayload)
                const ts = await getLeadIdQ(postPayload.appoint_subdepartment_id)
                if (appoint_user_id === ts[0].id) {
                  await noticeToAppointLeadT('Новая коментарий', postPayload)
                } else {
                  await noticeToAppointUserT('Новый коментарий', postPayload)
                  await noticeToAppointLeadT('Новая коментарий', postPayload)
                }
              } catch (error) {
                handleError(res, 'handleTaskComment')
              }
            }
          }
          break
        case 'chife':
          if (responsible_user_id === null) {
            if (user_subDep === responsible_subdepartment_id) {
              try {
                await noticeAppoinToGeneralT('Новая коментарий', postPayload)
                await noticeResponceToGeneralT('Новая коментарий', postPayload)
                const ts = await getLeadIdQ(postPayload.appoint_subdepartment_id)
                if (appoint_user_id === ts[0].id) {
                  await noticeToAppointLeadT('Новая коментарий', postPayload)
                } else {
                  await noticeToAppointUserT('Новый коментарий', postPayload)
                  await noticeToAppointLeadT('Новая коментарий', postPayload)
                }
              } catch (error) {
                handleError(res, 'handleTaskComment')
              }
            }
            if (user_subDep === appoint_subdepartment_id) {
              try {
                await noticeToResponceLeadT('Новая коментарий', postPayload)
                await noticeAppoinToGeneralT('Новая коментарий', postPayload)
                await noticeResponceToGeneralT('Новая коментарий', postPayload)
                const ts = await getLeadIdQ(postPayload.appoint_subdepartment_id)
                if (appoint_user_id === ts[0].id) {
                  await noticeToAppointLeadT('Новая коментарий', postPayload)
                } else {
                  await noticeToAppointUserT('Новый коментарий', postPayload)
                }
              } catch (error) {
                handleError(res, 'handleTaskComment')
              }
            }
          }
          if (responsible_user_id !== null) {
            if (user_subDep.toString() === responsible_subdepartment_id.toString()) {
              try {
                await noticeAppoinToGeneralT('Новая коментарий', postPayload)
                await noticeResponceToGeneralT('Новая коментарий', postPayload)
                await noticeToResponceUserT('Новый коментарий', postPayload)
                const ts = await getLeadIdQ(postPayload.appoint_subdepartment_id)
                if (appoint_user_id === ts[0].id) {
                  await noticeToAppointLeadT('Новая коментарий', postPayload)
                } else {
                  await noticeToAppointUserT('Новый коментарий', postPayload)
                  await noticeToAppointLeadT('Новая коментарий', postPayload)
                }
              } catch (error) {
                handleError(res, 'handleTaskComment')
              }
            }
            if (user_subDep.toString() === appoint_subdepartment_id.toString()) {
              try {
                await noticeAppoinToGeneralT('Новая коментарий', postPayload)
                await noticeResponceToGeneralT('Новая коментарий', postPayload)
                await noticeToResponceUserT('Новый коментарий', postPayload)
                const ts = await getLeadIdQ(postPayload.appoint_subdepartment_id)
                if (appoint_user_id === ts[0].id) {
                  await noticeToResponceLeadT('Новая коментарий', postPayload)
                } else {
                  await noticeToAppointUserT('Новый коментарий', postPayload)
                  await noticeToResponceLeadT('Новая коментарий', postPayload)
                }
              } catch (error) {
                handleError(res, 'handleTaskComment')
              }
            }
          }
          break
        case 'user':
          if (responsible_user_id === null) {
            try {
              await noticeResponceToGeneralT('Новая коментарий', postPayload)
              await noticeAppoinToGeneralT('Новая коментарий', postPayload)
              await noticeToResponceLeadT('Новая коментарий', postPayload)
              await noticeToAppointLeadT('Новая коментарий', postPayload)
            } catch (error) {
              handleError(res, 'handleTaskComment')
            }
          }
          if (responsible_user_id !== null) {
            try {
              if (user_id === appoint_user_id) {
                await noticeResponceToGeneralT('Новая коментарий', postPayload)
                await noticeAppoinToGeneralT('Новая коментарий', postPayload)
                await noticeToResponceLeadT('Новая коментарий', postPayload)
                await noticeToAppointLeadT('Новая коментарий', postPayload)
                await noticeToResponceUserT('Новая коментарий', postPayload)
              } else if (user_id === responsible_user_id) {
                await noticeResponceToGeneralT('Новая коментарий', postPayload)
                await noticeAppoinToGeneralT('Новая коментарий', postPayload)
                await noticeToResponceLeadT('Новая коментарий', postPayload)
                const ts = await getLeadIdQ(postPayload.appoint_subdepartment_id)
                if (appoint_user_id === ts[0].id) {
                  await noticeToAppointLeadT('Новая коментарий', postPayload)
                } else {
                  await noticeToAppointUserT('Новый коментарий', postPayload)
                  await noticeToAppointLeadT('Новая коментарий', postPayload)
                }
              }
            } catch (error) {
              handleError(res, 'handleTaskComment')
            }
          }
          break
      }
      break
    // !##################################################
    case inOneSubDep:
      switch (user_role) {
        case 'general':
          if (responsible_user_id === null) {
            try {
              await noticeToAppointUserT('Новый коментарий', postPayload)
              await noticeToAppointLeadT('Новая коментарий', postPayload)
            } catch (error) {
              handleError(res, 'handleTaskComment')
            }
          } else {
            try {
              await noticeToAppointUserT('Новый коментарий', postPayload)
              await noticeToResponceUserT('Новый коментарий', postPayload)
              await noticeToAppointLeadT('Новая коментарий', postPayload)
            } catch (error) {
              handleError(res, 'handleTaskComment')
            }
          }
          break
        case 'chife':
          if (responsible_user_id === null) {
            try {
              await noticeAppoinToGeneralT('Новый коментарий', postPayload)
              await noticeToAppointUserT('Новый коментарий', postPayload)
            } catch (error) {
              handleError(res, 'handleTaskComment')
            }
          } else {
            try {
              if (user_id === appoint_user_id) {
                console.log(user_id === appoint_user_id)
                await noticeAppoinToGeneralT('Новая коментарий', postPayload)
                await noticeToResponceUserT('Новый коментарий', postPayload)
                await updateReadStatusQ({
                  task_id: task_id,
                  user_id: appoint_subdepartment_id,
                  read_status: 'readed',
                })
              } else {
                user_id === responsible_user_id ? '' : await noticeToResponceUserT('Новый коментарий', postPayload)
                user_id === responsible_user_id ? '' : await noticeToAppointUserT('Новый коментарий', postPayload)
                user_id !== responsible_user_id ? '' : await noticeToAppointUserT('Новый коментарий', postPayload)
                await noticeAppoinToGeneralT('Новая коментарий', postPayload)
              }
            } catch (error) {
              handleError(res, 'handleTaskComment')
            }
          }
          break
        case 'user':
          if (responsible_user_id === null) {
            try {
              await noticeResponceToGeneralT('Новая коментарий', postPayload)
              await noticeAppoinToGeneralT('Новая коментарий', postPayload)
              await noticeToResponceLeadT('Новая коментарий', postPayload)
              await noticeToAppointLeadT('Новая коментарий', postPayload)
            } catch (error) {
              handleError(res, 'handleTaskComment')
            }
          }
          if (responsible_user_id !== null) {
            try {
              if (user_id === appoint_user_id) {
                await noticeAppoinToGeneralT('Новая коментарий', postPayload)
                await noticeToAppointLeadT('Новая коментарий', postPayload)
                await noticeToResponceUserT('Новая коментарий', postPayload)
              } else if (user_id === responsible_user_id) {
                await noticeAppoinToGeneralT('Новая коментарий', postPayload)
                const ts = await getLeadIdQ(postPayload.appoint_subdepartment_id)
                if (appoint_user_id === ts[0].id) {
                  await noticeToAppointLeadT('Новая коментарий', postPayload)
                } else {
                  await noticeToAppointUserT('Новый коментарий', postPayload)
                  await noticeToAppointLeadT('Новая коментарий', postPayload)
                }
              }
            } catch (error) {
              handleError(res, 'handleTaskComment')
            }
          }
          break
      }
      break
    // !##################################################
    case inDifSubDep:
      switch (user_role) {
        case 'general':
          if (responsible_user_id === null) {
            if (user_dep === appoint_department_id) {
              try {
                const ts = await getLeadIdQ(postPayload.appoint_subdepartment_id)
                if (appoint_user_id === ts[0].id) {
                  await noticeToAppointLeadT('Новая коментарий', postPayload)
                } else {
                  await noticeToAppointUserT('Новый коментарий', postPayload)
                  await noticeToAppointLeadT('Новая коментарий', postPayload)
                }
              } catch (error) {
                handleError(res, 'handleTaskComment')
              }
            }
            if (user_dep === responsible_department_id) {
              try {
                await noticeToResponceLeadT('Новая коментарий', postPayload)
              } catch (error) {
                handleError(res, 'handleTaskComment')
              }
            }
          }
          if (responsible_user_id !== null) {
            if (user_dep === appoint_department_id) {
              try {
                await noticeToResponceLeadT('Новая коментарий', postPayload)
                await noticeToResponceUserT('Новый коментарий', postPayload)
                const ts = await getLeadIdQ(postPayload.appoint_subdepartment_id)
                if (appoint_user_id === ts[0].id) {
                  await noticeToAppointLeadT('Новая коментарий', postPayload)
                } else {
                  await noticeToAppointUserT('Новый коментарий', postPayload)
                  await noticeToAppointLeadT('Новая коментарий', postPayload)
                }
              } catch (error) {
                handleError(res, 'handleTaskComment')
              }
            }
            if (user_dep === responsible_department_id) {
              try {
              } catch (error) {
                handleError(res, 'handleTaskComment')
              }
            }
          }
          break
        case 'chife':
          if (responsible_user_id === null) {
            if (user_subDep === responsible_subdepartment_id) {
              try {
                await noticeAppoinToGeneralT('Новая коментарий', postPayload)
                const ts = await getLeadIdQ(postPayload.appoint_subdepartment_id)
                if (appoint_user_id === ts[0].id) {
                  await noticeToAppointLeadT('Новая коментарий', postPayload)
                } else {
                  await noticeToAppointUserT('Новый коментарий', postPayload)
                  await noticeToAppointLeadT('Новая коментарий', postPayload)
                }
              } catch (error) {
                handleError(res, 'handleTaskComment')
              }
            }
            if (user_subDep === appoint_subdepartment_id) {
              try {
                await noticeToResponceLeadT('Новая коментарий', postPayload)
                await noticeAppoinToGeneralT('Новая коментарий', postPayload)
                const ts = await getLeadIdQ(postPayload.appoint_subdepartment_id)
                if (appoint_user_id === ts[0].id) {
                  await noticeToAppointLeadT('Новая коментарий', postPayload)
                } else {
                  await noticeToAppointUserT('Новый коментарий', postPayload)
                }
              } catch (error) {
                handleError(res, 'handleTaskComment')
              }
            }
          }
          if (responsible_user_id !== null) {
            if (user_subDep.toString() === responsible_subdepartment_id.toString()) {
              try {
                await noticeAppoinToGeneralT('Новая коментарий', postPayload)
                await noticeToResponceUserT('Новый коментарий', postPayload)
                const ts = await getLeadIdQ(postPayload.appoint_subdepartment_id)
                if (appoint_user_id === ts[0].id) {
                  await noticeToAppointLeadT('Новая коментарий', postPayload)
                } else {
                  await noticeToAppointUserT('Новый коментарий', postPayload)
                  await noticeToAppointLeadT('Новая коментарий', postPayload)
                }
              } catch (error) {
                handleError(res, 'handleTaskComment')
              }
            }
            if (user_subDep.toString() === appoint_subdepartment_id.toString()) {
              try {
                await noticeAppoinToGeneralT('Новая коментарий', postPayload)
                await noticeToResponceUserT('Новый коментарий', postPayload)
                const ts = await getLeadIdQ(postPayload.appoint_subdepartment_id)
                if (appoint_user_id === ts[0].id) {
                  await noticeToResponceLeadT('Новая коментарий', postPayload)
                } else {
                  await noticeToAppointUserT('Новый коментарий', postPayload)
                  await noticeToResponceLeadT('Новая коментарий', postPayload)
                }
              } catch (error) {
                handleError(res, 'handleTaskComment')
              }
            }
          }
          break
        case 'user':
          if (responsible_user_id === null) {
            try {
              await noticeAppoinToGeneralT('Новая коментарий', postPayload)
              await noticeToResponceLeadT('Новая коментарий', postPayload)
              await noticeToAppointLeadT('Новая коментарий', postPayload)
            } catch (error) {
              handleError(res, 'handleTaskComment')
            }
          }
          if (responsible_user_id !== null) {
            try {
              if (user_id === appoint_user_id) {
                await noticeAppoinToGeneralT('Новая коментарий', postPayload)
                await noticeToResponceLeadT('Новая коментарий', postPayload)
                await noticeToAppointLeadT('Новая коментарий', postPayload)
                await noticeToResponceUserT('Новая коментарий', postPayload)
              } else if (user_id === responsible_user_id) {
                await noticeAppoinToGeneralT('Новая коментарий', postPayload)
                await noticeToResponceLeadT('Новая коментарий', postPayload)
                const ts = await getLeadIdQ(postPayload.appoint_subdepartment_id)
                if (appoint_user_id === ts[0].id) {
                  await noticeToAppointLeadT('Новая коментарий', postPayload)
                } else {
                  await noticeToAppointUserT('Новый коментарий', postPayload)
                  await noticeToAppointLeadT('Новая коментарий', postPayload)
                }
              }
            } catch (error) {
              handleError(res, 'handleTaskComment')
            }
          }
          break
      }
    default:
      // Действия по умолчанию, если ни одно из условий не соответствует
      break
  }
}

const test = () => {
  handleTaskComment({
    task_id: '942f2034-9bb7-4ec3-8883-924c2b0e9bd4',
    comment: 'В другой департамент',
    user_id: '1003',
    user_dep: '2',
    user_subDep: '2',
    user_role: 'chife',
    task_status: 'approved',
    appoint_user_id: 1004,
    appoint_department_id: 2,
    appoint_subdepartment_id: 2,
    responsible_user_id: null,
    responsible_department_id: 3,
    responsible_subdepartment_id: 3,
  })
  handleTaskComment({
    task_id: 'e576e83b-d398-46d2-88f4-554ecff68931',
    comment: 'В смежный отдел',
    user_id: '1003',
    user_dep: '2',
    user_subDep: '2',
    user_role: 'chife',
    task_status: 'approved',
    appoint_user_id: 1004,
    appoint_department_id: 2,
    appoint_subdepartment_id: 2,
    responsible_user_id: null,
    responsible_department_id: 2,
    responsible_subdepartment_id: 7,
  })
  handleTaskComment({
    task_id: 'b931dae8-c450-499b-b82c-45f8a29cdcda',
    comment: 'В свой отдел',
    user_id: '1003',
    user_dep: '2',
    user_subDep: '2',
    user_role: 'chife',
    task_status: 'inWork',
    appoint_user_id: 1004,
    appoint_department_id: 2,
    appoint_subdepartment_id: 2,
    responsible_user_id: 1018,
    responsible_department_id: 2,
    responsible_subdepartment_id: 2,
  })
}

// test()

module.exports = new TasksControler()

// if (postPayload.user_role.toString() === 'chife') {
//   console.log('Lead')
//   if (postPayload.user_id.toString() !== postPayload.appoint_user_id.toString()) {
//     console.log('Lead ............')
//     await noticeToAppointUserT('Новый коментарий 1212', postPayload)
//   }
//   if (postPayload.responsible_user_id === null && postPayload.task_status.toString() === 'approved') {
//     postPayload.user_subDep === postPayload.appoint_subdepartment_id ? await noticeToResponceLeadT('Новый коментарий', postPayload) : ''
//     postPayload.user_subDep !== postPayload.appoint_subdepartment_id ? await noticeToAppointLeadT('Новый коментарий', postPayload) : ''
//   }
//   if (postPayload.responsible_user_id !== null && postPayload.task_status.toString() === 'inWork') {
//     if (postPayload.user_subDep === postPayload.responsible_subdepartment_id) {
//       await noticeToResponceUserT('Новый коментарий вввв', postPayload)
//       postPayload.user_subDep === postPayload.responsible_department_id ? await noticeToAppointLeadT('Новый коментарий', postPayload) : ''

//     } else {
//       await noticeToResponceUserT('Новый коментарий', postPayload)
//       postPayload.user_subDep === postPayload.appoint_subdepartment_id ? await noticeToResponceLeadT('Новый коментарий', postPayload) : ''
//       postPayload.user_subDep !== postPayload.appoint_subdepartment_id ? await noticeToAppointLeadT('Новый коментарий', postPayload) : ''
//     }
//   }
//   if (
//     (postPayload.responsible_user_id !== null && postPayload.task_status.toString() === 'needToConfirm') ||
//     postPayload.task_status.toString() === 'closed'
//   ) {
//     if (postPayload.user_subDep === postPayload.appoint_subdepartment_id) {
//       await noticeToResponceUserT('Новый коментарий', postPayload)
//       postPayload.user_subDep === postPayload.responsible_department_id ? '' : await noticeToResponceLeadT('Новый коментарий', postPayload)
//     } else {
//       await noticeToResponceUserT('Новый коментарий', postPayload)
//       postPayload.user_subDep === postPayload.appoint_subdepartment_id ? await noticeToResponceLeadT('Новый коментарий', postPayload) : ''
//       postPayload.user_subDep !== postPayload.appoint_subdepartment_id ? await noticeToAppointLeadT('Новый коментарий', postPayload) : ''
//     }
//   }
// } else if (postPayload.user_role.toString() === 'general') {
//   console.log('General')
// } else if (postPayload.user_role.toString() === 'user') {
//   console.log('User')
//   if (postPayload.task_status.toString() === 'toApprove') {
//     console.log('User ............')
//     await noticeToAppointLeadT('Новый коментарий', postPayload)
//   }
//   if (postPayload.responsible_user_id === null && postPayload.task_status.toString() === 'approved') {
//     await noticeToResponceLeadT('Новый коментарий', postPayload)
//     await noticeToAppointLeadT('Новый коментарий', postPayload)
//   }
//   if (postPayload.responsible_user_id !== null && postPayload.task_status.toString() === 'inWork') {
//     if (postPayload.user_subDep === postPayload.responsible_subdepartment_id) {
//       await noticeToAppointLeadT('Новый коментарий ммм', postPayload)
//       // !111
//       postPayload.user_subDep === postPayload.responsible_department_id ? await noticeToResponceLeadT('Новый коментарий', postPayload) : ''

//       postPayload.user_id === postPayload.appoint_user_id ? await noticeToResponceUserT('Новый коментарий', postPayload) : ''
//       postPayload.user_id !== postPayload.appoint_user_id ? await noticeToAppointUserT('Новый коментарий', postPayload) : ''
//     } else {
//       await noticeToResponceLeadT('Новый коментарий', postPayload)
//       await noticeToAppointLeadT('Новый коментарий', postPayload)
//       postPayload.user_id === postPayload.appoint_user_id ? await noticeToResponceUserT('Новый коментарий', postPayload) : ''
//       postPayload.user_id !== postPayload.appoint_user_id ? await noticeToAppointUserT('Новый коментарий', postPayload) : ''
//     }
//   }
//   if (
//     (postPayload.responsible_user_id !== null && postPayload.task_status.toString() === 'needToConfirm') ||
//     postPayload.task_status.toString() === 'closed'
//   ) {
//     if (postPayload.user_subDep === postPayload.appoint_subdepartment_id) {
//       await noticeToAppointLeadT('Новый коментарий', postPayload)
//       postPayload.user_id === postPayload.appoint_user_id ? await noticeToResponceUserT('Новый коментарий', postPayload) : ''
//       postPayload.user_subDep === postPayload.responsible_department_id ? '' : await noticeToResponceLeadT('Новый коментарий', postPayload)
//     } else {
//       await noticeToResponceLeadT('Новый коментарий', postPayload)
//       await noticeToAppointLeadT('Новый коментарий', postPayload)
//       postPayload.user_id === postPayload.appoint_user_id ? await noticeToResponceUserT('Новый коментарий', postPayload) : ''
//       postPayload.user_id !== postPayload.appoint_user_id ? await noticeToAppointUserT('Новый коментарий', postPayload) : ''
//     }
//   }
// }

// if (responsible_user_id === null) {
//   try {
//     console.log('responsible_user_id: null')
//   } catch (error) {
//     handleError(res, 'handleTaskComment')
//   }
// }
// if (user_subDep === appoint_subdepartment_id) {
//   console.log('Creator!!')
//   if (user_id === appoint_user_id) {
//     console.log('this Creator!!')
//   } else {
//     console.log('I am lead!!!')
//   }
// }
// if (user_subDep === responsible_subdepartment_id) {
//   console.log('Responcer!!')
// }
// else {
//   try {
//     await noticeResponceToGeneralT('Новая задача', postPayload)
//     await noticeAppoinToGeneralT('Новая задача', postPayload)
//     await noticeToResponceLeadT('Новая задача inOneSubDep', postPayload)
//     await noticeToResponceUserT('Новый коментарий inOneSubDep', postPayload)
//     user_id === appoint_user_id ? '' : await noticeToAppointUserT('Новый коментарий inOneSubDep', postPayload)
//   } catch (error) {
//     handleError(res, 'handleTaskComment')
//   }
// }
