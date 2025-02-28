const { getLabsPreviewFiles, getFullFile } = require('../../Database/queries/Lab/labFilesUtils/labFilesUtils')
const {
  createNewReqForAvailableQ,
  appendApprovalsUsersQ,
  getUsersForApprovalQ,
  getAllRequestsWithApprovalsQ,
  getAllRequestsQ,
  updateApprovalsUserQ,
  addLabReqReadStatusQ,
  appendUserForApprovalQ,
  updateLabReqReadStatusQ,
  updateAppendApprovalsUsersQ,
  deleteReqForLabQ,
  sendNotifyThenNewCommentQ,
  getAllLabReqCommentQ,
  addNewLabReqCommentQ,
  getAllLabReqFilesNameQ,
  deleteFileQ,
  updateReqStatusQ,
  addReportQ,
} = require('../../Database/queries/Lab/labQueries')
const { executeDatabaseQueryAsync } = require('../../Database/utils/executeDatabaseQuery/executeDatabaseQuery')
const { saveAndConvert } = require('../../utils/files/saveAndConvert')
const { handleError, sendResponseWithData } = require('../../utils/response/responseUtils')
const { update } = require('../Admin/Devices/Motors/MotorController')

class LabController {
  async addNewLabsReqForAvailability(req, res) {
    try {
      const authDecodeUserData = req.user
      const payLoad = JSON.parse(authDecodeUserData.payLoad)
      await createNewReqForAvailableQ(payLoad)
      await appendUserForApprovalQ(payLoad)
      // Если статус запрос не драфт а новый то сразу рассылаем уведомления
      if (payLoad.req_status === 'new') {
        await updateApprovalsUserQ(payLoad)
        await updateAppendApprovalsUsersQ(payLoad)
      }
      sendResponseWithData(res, 'addNewLabsReqForAvailability-ok')
    } catch (error) {
      handleError(res, 'addNewLabsReqForAvailability')
    }
  }

  async getAllRequestsWithApprovals(req, res) {
    const authDecodeUserData = req.user
    // Проверяем, есть ли данные пользователя
    if (!authDecodeUserData) {
      return handleError(res, 'User data not found')
    }
    const payLoad = JSON.parse(authDecodeUserData.payLoad)
    try {
      // Получаем все запросы
      const requests = await getAllRequestsQ()
      // console.log(requests)
      // Проверяем, есть ли запросы
      if (!requests || requests.length === 0) {
        return sendResponseWithData(res, []) // Возвращаем пустой массив, если запросов нет
      }
      // Создаем массив промисов для получения пользователей для каждого запроса
      const requestsWithUsers = await Promise.all(
        requests.map(async request => {
          try {
            // Получаем пользователей для текущего запроса
            const users = await getUsersForApprovalQ(request.reqForAvail_id)
            // Возвращаем объект с данными запроса и пользователями
            return {
              ...request, // Все данные запроса
              users: users || [], // Добавляем пользователей или пустой массив, если пользователей нет
            }
          } catch (userError) {
            console.error('Ошибка при получении пользователей для запроса:', userError)
            return {
              ...request,
              users: [], // Возвращаем пустой массив пользователей в случае ошибки
            }
          }
        })
      )
      // Отправляем ответ с данными
      sendResponseWithData(res, requestsWithUsers)
    } catch (error) {
      console.error('Ошибка при получении запросов с одобрениями:', error)
      handleError(res, 'addNewLabsReqForAvailability')
    }
  }

  async getUserConfirmation(req, res) {
    try {
      const authDecodeUserData = req.user
      const payLoad = JSON.parse(authDecodeUserData.payLoad)
      await updateApprovalsUserQ(payLoad)
      // обновляем статус прочтено
      // await appendApprovalsUsersQ(payLoad)
      
      // !Что бы не уведомлять при согласовании конкретным пользователем
      //! await updateAppendApprovalsUsersQ(payLoad)
      sendResponseWithData(res, 'getUserConfirmation-ok')
    } catch (error) {
      console.error('Ошибка при получении запросов с одобрениями:', error)
      handleError(res, 'getUserConfirmation')
    }
  }

  async updateReadStatus(req, res) {
    try {
      const authDecodeUserData = req.user
      const payLoad = JSON.parse(authDecodeUserData.payLoad)
      await updateLabReqReadStatusQ(payLoad)
      sendResponseWithData(res, 'updateReadStatus-ok')
    } catch (error) {
      console.error('Ошибка при updateReadStatus:', error)
      handleError(res, 'updateReadStatus')
    }
  }
  async addFilesForRequest(req, res) {
    try {
      const authDecodeUserData = req.user
      const user_id = authDecodeUserData.id
      const postPayload = authDecodeUserData.payLoad
      const fields = postPayload.fields
      const files = postPayload.files
      const taskFolderName = fields.reqForAvail_id
      const fileNames = []
      for (const [key, file] of Object.entries(files)) {
        try {
          const fileName = await saveAndConvert(file, 'labRequests', taskFolderName)
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

      for (let i = 0; i < data.fileNames.length; i++) {
        const file_name = data.fileNames[i]
        if (!file_name) {
          //.file_name || !file.file_path
          continue
        }

        const command3 = `INSERT INTO lab_req_files (req_id, user_id, file_name) VALUES (?, ?, ?);`
        try {
          await executeDatabaseQueryAsync(command3, [data.fields.reqForAvail_id, data.user_id, file_name])
          console.log(`File ${file_name} added successfully to the lab request`)
        } catch (error) {
          console.error(`Error adding file ${file_name} to the lab request: `, error)
          throw new Error('Ошибка запроса к базе данных')
        }
      }
      // await updateLabReqReadStatusQ(payLoad)
      sendResponseWithData(res, 'addFilesForRequest-ok')
    } catch (error) {
      console.error('Ошибка при addFilesForRequest:', error)
      handleError(res, 'addFilesForRequest')
    }
  }

  async getAllLabReqFiles(req, res) {
    try {
      const authDecodeUserData = req.user
      const req_id = JSON.parse(authDecodeUserData.payLoad)
      const allFilesName = await getAllLabReqFilesNameQ(req_id)
      sendResponseWithData(res, allFilesName)
    } catch (error) {
      handleError(res, 'getAllLabReqFiles-error', error)
    }
  }

  async getPreviewLabReqFileContent(req, res) {
    try {
      const authDecodeUserData = req.user
      const files = JSON.parse(authDecodeUserData.payLoad)
      if (!files.files || !files.files.length) {
        // console.error('Файлы не предоставлены или массив пуст')
        sendResponseWithData(res, 'files не содержит req_id или files')
      } else {
        const filesLabsPreview = await getLabsPreviewFiles(files.req_id, 'labRequests', files.files)
        sendResponseWithData(res, filesLabsPreview)
      }
    } catch (error) {
      console.log(error)
      handleError(res, 'getPreviewLabReqFileContent-error')
    }
  }

  async getFullFileContent(req, res) {
    try {
      const authDecodeUserData = req.user
      const postPayload = JSON.parse(authDecodeUserData.payLoad)
      const fulFile = await getFullFile(postPayload, 'labRequests')
      sendResponseWithData(res, fulFile)
    } catch (error) {
      handleError(res, 'getFullFileContent')
    }
  }
  /**
   * Удаляет файл на основе данных из запроса.
   *
   * @param {Object} req - Объект HTTP-запроса.
   * @param {Object} req.user - Данные пользователя, извлеченные из токена аутентификации.
   * @param {string} req.user.payLoad - Строка JSON, содержащая данные для удаления файла.
   * @param {Object} res - Объект HTTP-ответа.
   *
   * @returns {Promise<void>} - Возвращает Promise, который разрешается после завершения операции.
   *
   * @throws {Error} - Выбрасывает ошибку, если произошла проблема при обработке запроса,
   * декодировании данных или выполнении операции удаления.
   *
   * @description
   * Метод выполняет следующие действия:
   * 1. Извлекает данные пользователя из объекта запроса (`req.user`).
   * 2. Декодирует полезную нагрузку (`payLoad`) из строки JSON.
   * 3. Вызывает функцию `deleteFileQ` для удаления файла из базы данных и сервера.
   * 4. Возвращает успешный ответ клиенту через функцию `sendResponseWithData`.
   * 5. В случае ошибки вызывает функцию `handleError` для обработки и отправки ошибки клиенту.
   */
  async deleteFile(req, res) {
    try {
      const authDecodeUserData = req.user
      const postPayload = JSON.parse(authDecodeUserData.payLoad)
      await deleteFileQ(postPayload)
      sendResponseWithData(res, 'deleteFile-ok')
    } catch (error) {
      handleError(res, 'deleteFile')
    }
  }
  async deleteReqForLab(req, res) {
    // ! добавить удаление файлов к запросу!!
    try {
      const authDecodeUserData = req.user
      const payLoad = JSON.parse(authDecodeUserData.payLoad)
      await deleteReqForLabQ(payLoad)
      sendResponseWithData(res, 'deleteReqForLab-ok')
    } catch (error) {
      console.error('Ошибка при deleteReqForLab:', error)
      handleError(res, 'deleteReqForLab')
    }
  }
  async addNewLabReqComment(req, res) {
    try {
      const authDecodeUserData = req.user
      const payLoad = JSON.parse(authDecodeUserData.payLoad)
      await addNewLabReqCommentQ(payLoad)
      // Отправка уведомления
      await sendNotifyThenNewCommentQ(payLoad)
      sendResponseWithData(res, 'addNewLabReqComment-ok')
    } catch (error) {
      console.error('Ошибка при addNewLabReqComment:', error)
      handleError(res, 'addNewLabReqComment')
    }
  }
  async getAllLabReqComment(req, res) {
    try {
      const authDecodeUserData = req.user
      const payLoad = JSON.parse(authDecodeUserData.payLoad)
      const allComments = await getAllLabReqCommentQ(payLoad)
      sendResponseWithData(res, allComments)
    } catch (error) {
      console.error('Ошибка при getAllLabReqCommentQ:', error)
      handleError(res, 'getAllLabReqCommentQ')
    }
  }
  async updateReqStatus(req, res) {
    try {
      const authDecodeUserData = req.user
      const payLoad = JSON.parse(authDecodeUserData.payLoad)
      // Обновление статуса у запроса
      await updateReqStatusQ(payLoad)
      // Уведомление пользователей
      await updateAppendApprovalsUsersQ(payLoad)
      sendResponseWithData(res, 'updateReqStatus-ok')
    } catch (error) {
      console.error('Ошибка при getAllLabReqCommentQ:', error)
      handleError(res, 'getAllLabReqCommentQ')
    }
  }
  async addReport(req, res) {
    try {
      const authDecodeUserData = req.user
      const payLoad = JSON.parse(authDecodeUserData.payLoad)
      // console.log("🚀 ~ LabController ~ addReport ~ payLoad:", payLoad)
      
      await addReportQ(payLoad)

      sendResponseWithData(res, 'addReport-ok')
    } catch (error) {
      console.error('Ошибка при addReport:', error)
      handleError(res, 'addReport')
    }
  }
}

module.exports = new LabController()
