const { noticeForLabSystemUsersT, noticeForLabSystemUsersT2, noticeForLabSystemUsersTNewCommentT } = require('../../../controllers/Lab/LabNoticeFor')
const { getThumbnailFiles } = require('../../../utils/files/getThumbnailFiles')
const { removeFolder, removeFileAndAssociatedFiles } = require('../../../utils/files/removeFolder')
const { executeDatabaseQueryAsync } = require('../../utils/executeDatabaseQuery/executeDatabaseQuery')

const createNewReqForAvailableQ = async data => {
  const insertQuery = `
    INSERT INTO reqForAvailableTable (
      reqForAvail_id,
      culture,
      tonnage,
      classType,
      type,
      contractor,
      selectedDepartment,
      creator,
      creator_subDep,
      creator_role,
      approved,
      req_status,
      gost,
      commentsThenCreate,
      yearOfHarvest,
      tonnagePermissible,
      reqNum,
      basis,
      approved_at,
      salesPoint,
      contractor_id,
      indicators
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
  `
  const params = [
    data.reqForAvail_id,
    data.culture,
    data.tonnage,
    data.classType,
    data.type,
    data.contractor,
    data.selectedDepartment,
    data.creator,
    data.creator_subDep,
    data.creator_role,
    data.approved,
    data.req_status,
    data.gost,
    data.comment, // thenCreate
    data.yearOfHarvest,
    data.tonnagePermissible,
    data.reqNum,
    data.basis,
    data.req_status === 'new' ? new Date().toISOString() : null, // Устанавливаем время только если статус "new"
    data.salesPoint,
    data.contractor_id,
    JSON.stringify(data.indicators), // Сохраняем индикаторы как JSON
  ]
  try {
    await executeDatabaseQueryAsync(insertQuery, params)
  } catch (error) {
    console.error('Error - createNewReqForAvailableQ:', error)
    throw error
  }
}

const appendUserForApprovalQ = async data => {
  const of = [2, 33, 47]
  const ae = [15, 16]
  // const ae = []
  const pe = [27, 28]

  const insertApprovalQuery = `
    INSERT INTO request_approvals (reqForAvail_id, user_id, position_id, status)
    VALUES (?, ?, ?, 'pending');
  `
  const getUserIdByPositionIdQuery = `
    SELECT id AS user_id FROM users WHERE position_id = ?;
  `
  try {
    let userListForApprove = []
    if (data.selectedDepartment === 3) {
      userListForApprove = [...of, ...ae]
    } else if (data.selectedDepartment === 4) {
      userListForApprove = [...of, ...pe]
    }

    const promises = userListForApprove.map(async position_id => {
      const userResult = await executeDatabaseQueryAsync(getUserIdByPositionIdQuery, [position_id])
      const user_id = userResult.length > 0 ? userResult[0].user_id : null
      if (user_id) {
        const readStatus = user_id.toString() === data.creator.toString() ? 'readed' : 'unread'
        // Устанавливаем статус чтения
        await addLabReqReadStatusQ({ req_id: data.reqForAvail_id, user_id, read_status: readStatus })
        // Вставка в request_approvals
        await executeDatabaseQueryAsync(insertApprovalQuery, [data.reqForAvail_id, user_id, position_id])
      } else {
        console.warn(`User not found for position_id: ${position_id}`)
        return Promise.resolve()
      }
    })
    await Promise.all(promises)
  } catch (error) {
    console.error('Error - appendApprovalsUsersQ:', error)
    throw error
  }
}

const appendApprovalsUsersQ = async data => {
  const getAllReqUsers = `
    SELECT user_id FROM request_approvals WHERE reqForAvail_id = ?
  `
  try {
    const allUsersForLabReq = await executeDatabaseQueryAsync(getAllReqUsers, [data.reqForAvail_id])
    const promises = allUsersForLabReq.map(async user => {
      if (user) {
        const readStatus = user.user_id.toString() === data.user_id.toString() ? 'readed' : 'unread'
        const wtf = user.user_id.toString() === data.user_id.toString()
        // Устанавливаем статус чтения
        await updateLabReqReadStatusQ({ req_id: data.reqForAvail_id, user_id: user.user_id, read_status: readStatus })
        wtf ? null : await noticeForLabSystemUsersT(user.user_id, 'Новый запрос')
      } else {
        console.warn(`User not found for position_id: ${position_id}`)
        return Promise.resolve()
      }
    })
    await Promise.all(promises)
  } catch (error) {
    console.error('Error - appendApprovalsUsersQ:', error)
    throw error
  }
}

const updateAppendApprovalsUsersQ = async data => {
  if (!data || !data.reqForAvail_id || !data.user_id) {
    console.warn('Invalid data provided:', data)
    return
  }
  // const statusTranslations = {
  //   new: 'Новый запрос',
  //   approved: 'Запрос одобрен',
  //   discard: 'Запрос отклонен',
  //   in_progress: 'Открыт контракт',
  //   on_confirm: 'Требуется отчет',
  //   closed: 'Сформирован отчет',
  //   canceled: 'Запрос аннулирован',
  // }
  // Объект переводов статусов
  const statusTranslations = {
    new: {
      title: 'Новый запрос',
      description: data =>
        `Новый запрос: ${data.selectedDepartment_name ? data.selectedDepartment_name : data.currentRequest.department_name} ${
          data.culture ? data.culture : data.currentRequest.culture
        } ${data.gost ? data.gost : data.currentRequest.gost} тоннаж: ${data.tonnage ? data.tonnage : data.currentRequest.tonnage} покупатель: ${
          data.contractor ? data.contractor : data.currentRequest.contractor
        }`,
    },
    approved: {
      title: 'Запрос одобрен',
      description: data =>
        `Запрос одобрен: ${data.currentRequest.department_name} ${data.currentRequest.culture} ${data.currentRequest.gost} тоннаж: ${data.currentRequest.tonnage} покупатель: ${data.currentRequest.contractor} продавец: ${data.currentRequest.salesPoint}`,
    },
    discard: {
      title: 'Запрос отклонен',
      description: data =>
        `Запрос отклонен: ${data.currentRequest.department_name} ${data.currentRequest.culture} ${data.currentRequest.gost} тоннаж: ${data.currentRequest.tonnage} покупатель: ${data.currentRequest.contractor} продавец: ${data.currentRequest.salesPoint}`,
    },
    in_progress: {
      title: 'Открыт контракт',
      description: data =>
        `Открыт контракт: ${data.currentRequest.department_name} ${data.currentRequest.culture} ${data.currentRequest.gost} тоннаж: ${data.currentRequest.tonnage} покупатель: ${data.currentRequest.contractor} продавец: ${data.currentRequest.salesPoint}`,
    },
    on_confirm: {
      title: 'Контракт закрыт',
      description: data =>
        `Контракт закрыт: ${data.currentRequest.department_name} ${data.currentRequest.culture} ${data.currentRequest.gost} тоннаж: ${data.currentRequest.tonnage} покупатель: ${data.currentRequest.contractor} продавец: ${data.currentRequest.salesPoint}`,
    },
    closed: {
      title: 'Сформирован отчет',
      description: data =>
        `Сформирован отчет: ${data.currentRequest.department_name} ${data.currentRequest.culture} ${data.currentRequest.gost} тоннаж: ${data.currentRequest.tonnage} покупатель: ${data.currentRequest.contractor} продавец: ${data.currentRequest.salesPoint}`,
    },
    canceled: {
      title: 'Запрос аннулирован',
      description: data =>
        `Запрос аннулирован: ${data.currentRequest.department_name} ${data.currentRequest.culture} ${data.currentRequest.gost} тоннаж: ${data.currentRequest.tonnage} покупатель: ${data.currentRequest.contractor} продавец: ${data.currentRequest.salesPoint}`,
    },
  }
  // const translatedStatus = statusTranslations[data.req_status] || data.req_status // Получаем русский статус
  // Получаем русский статус и описание
  const translatedStatus = statusTranslations[data.req_status]
  if (!translatedStatus) {
    console.warn(`Unknown status: ${data.req_status}`)
    return
  }
  const { title, description } = translatedStatus
  const text = description(data) // Генерируем описание

  const email_body = {
    task_descript: text,
  }
  console.log('🚀 ~ email_body:', email_body)
  const getAllReqUsers = `
    SELECT user_id FROM request_approvals WHERE reqForAvail_id = ?
  `
  try {
    const allUsersForLabReq = await executeDatabaseQueryAsync(getAllReqUsers, [data.reqForAvail_id])
    const promises = allUsersForLabReq.map(async user => {
      if (!user) {
        console.warn(`User not found for reqForAvail_id: ${data.reqForAvail_id}`)
        return // Игнорируем пользователя, если он не найден
      }
      const readStatus = user.user_id.toString() === data.user_id.toString() ? 'readed' : 'unread'
      await updateLabReqReadStatusQ({ req_id: data.reqForAvail_id, user_id: user.user_id, read_status: readStatus })
      if (readStatus === 'unread') {
        // await noticeForLabSystemUsersT(user.user_id, 'Новый запрос', {task_descript : email_body})
        await noticeForLabSystemUsersT(user.user_id, title, email_body)
      }
    })
    await Promise.all(promises)
  } catch (error) {
    console.error('Error - updateAppendApprovalsUsersQ:', error)
    throw error // Пробрасываем ошибку дальше
  }
}
// console.log('appendApprovalsUsersQ', data)
// const of = [2, 33, 45, 47]
// const ae = [15, 16]
// const pe = [27, 28]

// const insertApprovalQuery = `
//   INSERT INTO request_approvals (reqForAvail_id, user_id, position_id, status)
//   VALUES (?, ?, ?, 'pending');
// `
// const getUserIdByPositionIdQuery = `
//   SELECT id AS user_id FROM users WHERE position_id = ?;
// `
// try {
//   let userListForApprove = []
//   if (data.selectedDepartment === 3) {
//     userListForApprove = [...of, ...ae]
//   } else if (data.selectedDepartment === 4) {
//     userListForApprove = [...of, ...pe]
//   }

//   const promises = userListForApprove.map(async position_id => {
//     const userResult = await executeDatabaseQueryAsync(getUserIdByPositionIdQuery, [position_id])
//     const user_id = userResult.length > 0 ? userResult[0].user_id : null
//     if (user_id) {
//       const readStatus = user_id.toString() === data.creator ? 'readed' : 'unread'
//       // Устанавливаем статус чтения
//       await addLabReqReadStatusQ({ req_id: data.reqForAvail_id, user_id, read_status: readStatus })
//       // ! обьеденить!!!
//       await noticeForLabSystemUsersT(user_id, 'work')
//       // Вставка в request_approvals
//       return executeDatabaseQueryAsync(insertApprovalQuery, [data.reqForAvail_id, user_id, position_id])
//     } else {
//       console.warn(`User not found for position_id: ${position_id}`)
//       return Promise.resolve()
//     }
//   })
//   await Promise.all(promises)
// } catch (error) {
//   console.error('Error - appendApprovalsUsersQ:', error)
//   throw error
// }

const getAllRequestsWithApprovalsQ = async () => {
  const query = `
    SELECT 
        r.reqForAvail_id AS request_id,
        r.culture AS culture,
        r.tonnage AS tonnage,
        r.classType AS classType,
        r.contractor AS contractor,
        p.id AS position_id,
        p.name AS position_name,
        u.last_name || ' ' || u.first_name AS user_name, -- Объединяем имя и фамилию
        ra.status AS approval_status,
        sb.name AS subdepartment_name,
        dp.name AS department_name
    FROM 
        reqForAvailableTable r
    LEFT JOIN 
        request_approvals ra ON r.reqForAvail_id = ra.reqForAvail_id
    LEFT JOIN 
      positions p ON ra.position_id = p.id
    LEFT JOIN 
      users u ON ra.position_id = u.position_id
    LEFT JOIN 
      subdepartments sb ON p.subdepartment_id = sb.id
    LEFT JOIN 
      departments dp ON sb.department_id = dp.id;
  `

  try {
    const result = await executeDatabaseQueryAsync(query)
    return result // Вернёт массив объектов с заявками и пользователями
  } catch (error) {
    console.error('Error fetching requests with approvals:', error)
    throw new Error('Failed to fetch requests with approvals')
  }
}
const getAllRequestsQ = async () => {
  const query = `
    SELECT
      req_number, 
      reqForAvail_id,
      culture,
      tonnage,
      classType,
      type,
      contractor,
      selectedDepartment,
      creator,
      creator_subDep,
      creator_role,
      approved,
      commentsThenCreate,
      yearOfHarvest,
      req_status, -- WTF
      gost,               -- Добавлено поле gost
      indicators,         -- Добавлено поле indicators
      --
      total_tonnage, -- всего отгружено
      commentsThenClosed, -- комментарий к отчету
      aspiration_dust, -- аспирационные потери
      natural_loss, --естественная убыль
      destination_point, -- цель\получатель
      sub_sorting, -- подсортировка
      actual_indicators, -- Фактически отгружено
      shipped, -- отгружено тип
      tonnagePermissible,
      salesPoint,
      basis,
      reqNum,
      reportByUser, -- кто составил отчет
      --
      -- test
      JSON_OBJECT(
        'total_tonnage', total_tonnage, 
        'commentsThenClosed', commentsThenClosed, 
        'aspiration_dust', aspiration_dust, 
        'natural_loss', natural_loss, 
        'destination_point', destination_point, 
        'sub_sorting', sub_sorting, 
        'shipped', shipped, 
        'actual_indicators', actual_indicators
      ) AS report_data, -- Группируем поля в объект
      --
      dp.name AS department_name,
      cr.name AS cr_name,
      DATETIME(created_at, 'localtime') AS created_at,
      DATETIME(updated_at, 'localtime') AS updated_at,  
      DATETIME(approved_at, 'localtime') AS approved_at  
    FROM 
      reqForAvailableTable
    LEFT JOIN 
      departments dp ON reqForAvailableTable.selectedDepartment = dp.id
    LEFT JOIN   
      contractors cr ON reqForAvailableTable.contractor_id == cr.id;
  `
  try {
    const result = await executeDatabaseQueryAsync(query)
    return result // Вернёт массив объектов с заявками и пользователями
  } catch (error) {
    console.error('Error fetching requests with approvals:', error)
    throw new Error('Failed to fetch requests with approvals')
  }
}

const getUsersForApprovalQ = async reqForAvail_id => {
  const query = `
    SELECT 
        r.reqForAvail_id AS request_id,
        p.id AS position_id,
        p.name AS position_name,
        u.id AS user_id,
        u.last_name || ' ' || u.first_name AS user_name, -- Объединяем имя и фамилию
        u.last_name as last_name_only,
        u.middle_name as middle_name_only,
        u.first_name as first_name_only,
        ra.status AS approval_status,
        sb.name AS subdepartment_name,
        dp.name AS department_name,
        lrs.read_status AS read_status,
        DATETIME(ra.approved_at, 'localtime') AS approved_at
        FROM 
            reqForAvailableTable r
        LEFT JOIN 
            request_approvals ra ON r.reqForAvail_id = ra.reqForAvail_id
        LEFT JOIN 
          positions p ON ra.position_id = p.id
        LEFT JOIN 
          users u ON ra.position_id = u.position_id
        LEFT JOIN 
          subdepartments sb ON p.subdepartment_id = sb.id
        LEFT JOIN 
          departments dp ON sb.department_id = dp.id
        LEFT JOIN 
          lab_req_readStatus lrs ON u.id = lrs.user_id AND ra.reqForAvail_id = lrs.req_id --wtf!!! 
        WHERE 
          ra.reqForAvail_id = ?
        GROUP BY 
          r.reqForAvail_id, p.id, p.name, u.id, u.last_name, u.first_name, ra.status, sb.name, dp.name, lrs.read_status;  
  `

  try {
    const result = await executeDatabaseQueryAsync(query, [reqForAvail_id])
    return result // Вернёт массив объектов с пользователями и их статусами
  } catch (error) {
    console.error('Error fetching users for approval:', error)
    throw new Error('Failed to fetch users for approval')
  }
}

const updateApprovalsUserQ = async data => {
  const updateApprovalQuery = `
    UPDATE request_approvals
    SET status = ?, approved_at = CURRENT_TIMESTAMP
    WHERE reqForAvail_id = ? AND position_id = ?;
  `
  const approveReq = `
    UPDATE reqForAvailableTable
    SET approved = TRUE, req_status = ? , approved_at = CURRENT_TIMESTAMP
    WHERE reqForAvail_id = ?;
  `
  try {
    const { reqForAvail_id, position_id, status } = data

    if (data.status === 'new') {
      await executeDatabaseQueryAsync(approveReq, [status, reqForAvail_id])
    }
    await executeDatabaseQueryAsync(updateApprovalQuery, [status === 'new' ? 'approved' : 'approved', reqForAvail_id, position_id])
  } catch (error) {
    console.error('Error - updateApprovalsUserQ:', error)
    throw error
  }
}

const addLabReqReadStatusQ = async data => {
  const { req_id, user_id, read_status } = data
  const command = `INSERT INTO lab_req_readStatus (req_id, user_id, read_status) VALUES (?, ?, ?)`
  try {
    await executeDatabaseQueryAsync(command, [req_id, user_id, read_status])
  } catch (error) {
    console.error('Error - addLabReqReadStatusQ:', error)
    throw error
  }
}
const updateLabReqReadStatusQ = async data => {
  const { req_id, user_id, read_status } = data
  const command = `UPDATE lab_req_readStatus SET read_status = ? WHERE req_id = ? AND user_id = ?`

  // Выполняем обновление только если текущий статус 'unread'
  const command2 = `
    UPDATE lab_req_readStatus 
    SET read_status = ? 
    WHERE req_id = ? AND user_id = ? AND read_status = 'unread'
  `

  try {
    await executeDatabaseQueryAsync(command, [read_status, req_id, user_id])
  } catch (error) {
    console.error('Error - updateLabReqReadStatusQ:', error)
    throw error
  }
}

const deleteReqForLabQ = async data => {
  const { reqForAvail_id } = data
  const command = `DELETE FROM reqForAvailableTable where reqForAvail_id = ?`
  const command2 = `DELETE FROM lab_req_files where req_id = ?`
  const command3 = `DELETE FROM lab_req_readStatus where req_id = ?`
  const command4 = `DELETE FROM lab_req_comments where req_id = ?`
  const command5 = `DELETE FROM request_approvals where reqForAvail_id = ?`
  try {
    await executeDatabaseQueryAsync(command, [reqForAvail_id])
    await executeDatabaseQueryAsync(command2, [reqForAvail_id])
    await executeDatabaseQueryAsync(command3, [reqForAvail_id])
    await executeDatabaseQueryAsync(command4, [reqForAvail_id])
    await executeDatabaseQueryAsync(command5, [reqForAvail_id])
    console.log(`Successfully deleted record from reqForAvailableTable with reqForAvail_id: ${reqForAvail_id}`)
    console.log(`Successfully deleted record from lab_req_files with reqForAvail_id: ${reqForAvail_id}`)
    console.log(`Successfully deleted record from lab_req_readStatus with reqForAvail_id: ${reqForAvail_id}`)
    console.log(`Successfully deleted record from lab_req_comments with reqForAvail_id: ${reqForAvail_id}`)
    console.log(`Successfully deleted record from request_approvals with reqForAvail_id: ${reqForAvail_id}`)
    await removeFolder(reqForAvail_id, 'labRequests')
  } catch (error) {
    console.error('Error - deleteReqForLabQ:', error)
    throw error
  }
}
/**
 * Удаляет файл из базы данных и связанные файлы на сервере.
 *
 * @param {Object} data - Объект, содержащий данные для удаления файла.
 * @param {number|string} data.req_id - Идентификатор запроса (req_id) в базе данных.
 * @param {Object} data.file - Объект, представляющий файл.
 * @param {string} data.file.name - Имя файла, который нужно удалить.
 *
 * @returns {Promise<void>} - Возвращает Promise, который разрешается после завершения операции.
 *
 * @throws {Error} - Выбрасывает ошибку, если произошла проблема при выполнении SQL-запроса
 * или удалении файлов на сервере.
 *
 * @description
 * Функция выполняет следующие действия:
 * 1. Удаляет запись о файле из таблицы `lab_req_files` базы данных.
 * 2. Удаляет файл и связанные с ним файлы (например, миниатюры или компрессированные версии)
 *    из папки на сервере.
 */
const deleteFileQ = async data => {
  try {
    const command = `DELETE FROM lab_req_files where req_id = ? AND file_name = ?`
    await executeDatabaseQueryAsync(command, [data.req_id, data.file.name])
    await removeFileAndAssociatedFiles(data.req_id, 'labRequests', data.file.name)
  } catch (error) {
    console.error('Error - deleteFileQ:', error)
    throw error
  }
}

const addNewLabReqCommentQ = async data => {
  const { reqForAvail_id, user_id, comment } = data
  const command = `
    INSERT INTO lab_req_comments (req_id, user_id, comment) VALUES (?, ?, ?)
  `
  try {
    await executeDatabaseQueryAsync(command, [reqForAvail_id, user_id, comment])
  } catch (error) {
    console.error('Error - addNewLabReqCommentQ:', error)
    throw error
  }
}

// const sendNotifyThenNewCommentQ = async data => {
//   const getAllReqUsers = `
//     SELECT user_id FROM request_approvals WHERE reqForAvail_id = ?
//   `
//   try {
//     const allUsersForLabReq = await executeDatabaseQueryAsync(getAllReqUsers, [data.reqForAvail_id])

//     const promises = allUsersForLabReq.map(async user => {
//       const readStatus = user.user_id.toString() === data.user_id.toString() ? 'readed' : 'unread'
//       // Логируем информацию о пользователе и статусе
//       console.log(`Updating read status for user: ${user.user_id}, status: ${readStatus}`)
//       // Устанавливаем статус чтения
//       if (data.user_id.toString() !== user.user_id.toString()) {
//         await updateLabReqReadStatusQ({ req_id: data.reqForAvail_id, user_id: user.user_id, read_status: readStatus })
//         await noticeForLabSystemUsersTNewCommentT(user.user_id, 'Новый комментарий')
//       }
//     })
//     await Promise.all(promises)
//   } catch (error) {
//     console.error('Error - sendNotifyThenNewCommentQ:', error)
//     throw error
//   }
// }

const sendNotifyThenNewCommentQ = async data => {
  const getAllReqUsers = `
    SELECT user_id FROM request_approvals WHERE reqForAvail_id = ?
  `

  try {
    const allUsersForLabReq = await executeDatabaseQueryAsync(getAllReqUsers, [data.reqForAvail_id])

    for (const user of allUsersForLabReq) {
      const readStatus = user.user_id.toString() === data.user_id.toString() ? 'readed' : 'unread'
      // Логируем информацию о пользователе и статусе
      // console.log(`Updating read status for user: ${user.user_id}, status: ${readStatus}`)
      // Устанавливаем статус чтения
      if (data.user_id.toString() !== user.user_id.toString()) {
        await updateLabReqReadStatusQ({ req_id: data.reqForAvail_id, user_id: user.user_id, read_status: readStatus })
        await noticeForLabSystemUsersTNewCommentT(user.user_id, 'Новый комментарий', { task_descript: data.comment })
      }
      // if (data.user_id.toString() !== user.user_id.toString()) {
      //   if (data.modal_isOpen === false) {
      //     await updateLabReqReadStatusQ({ req_id: data.reqForAvail_id, user_id: user.user_id, read_status: readStatus })
      //     await noticeForLabSystemUsersTNewCommentT(user.user_id, 'Новый комментарий')
      //   } else if (data.modal_isOpen === true) {
      //     await noticeForLabSystemUsersTNewCommentT(user.user_id, 'Новый комментарий222')
      //   }
      // }
    }
  } catch (error) {
    console.error('Error - sendNotifyThenNewCommentQ:', error)
    throw error
  }
}

const getAllLabReqCommentQ = async req_id => {
  const command = `
    SELECT 
      lrc.comment,
      DATETIME(lrc.created_on, 'localtime') AS created_on,
      u.last_name,
      u.first_name,
      u.middle_name
    FROM lab_req_comments lrc
    LEFT JOIN users u ON lrc.user_id = u.id
    WHERE req_id = ?  
    ORDER BY lrc.created_on DESC
  `
  try {
    const result = await executeDatabaseQueryAsync(command, [req_id])
    return result
  } catch (error) {
    console.error('Error - getAllLabReqCommentQ:', error)
    throw error
  }
}

const getAllLabReqFilesNameQ = async req_id => {
  const command = `
    SELECT
      REPLACE(GROUP_CONCAT(DISTINCT file_name), ',', '|') AS file_names
    FROM 
      lab_req_files 
    WHERE 
      req_id = ?
  `
  try {
    // получаю название файлов из таблицы
    const allFiles = await executeDatabaseQueryAsync(command, [req_id])
    // получаем имена и типы файлов делим на новые и старые
    const getFiles = await getThumbnailFiles(allFiles, 'labRequests')
    return getFiles
  } catch (error) {
    console.error('Error - getAllLabReqFilesNameQ:', error)
    throw error
  }
}

const updateReqStatusQ = async data => {
  const { reqForAvail_id, req_status, position_id } = data
  const query = `
    UPDATE reqForAvailableTable 
    SET 
      req_status = ?
    WHERE reqForAvail_id = ?
  `
  try {
    await executeDatabaseQueryAsync(query, [req_status, reqForAvail_id])
    if (data.req_status === 'new') {
      const updateApprovalQuery = `
        UPDATE request_approvals
        SET status = ?, approved_at = CURRENT_TIMESTAMP
        WHERE reqForAvail_id = ? AND position_id = ?;
      `
      const query = `
        UPDATE reqForAvailableTable 
          SET 
            req_status = ?,
            approved_at = ?
          WHERE reqForAvail_id = ?
        `
      await executeDatabaseQueryAsync(updateApprovalQuery, [req_status === 'new' ? 'approved' : 'approved', reqForAvail_id, position_id])
      await executeDatabaseQueryAsync(query, [req_status, req_status === 'new' ? new Date().toISOString() : null, reqForAvail_id])
    }
  } catch (error) {
    console.error('Error - getAllLabReqFilesNameQ:', error)
    throw error
  }
}

const addReportQ = async data => {
  const query = `
    UPDATE reqForAvailableTable 
    SET 
      commentsThenClosed = ?,
      sub_sorting = ?,
      total_tonnage = ?,
      aspiration_dust = ?,
      natural_loss = ?,
      destination_point = ?,
      shipped = ?,
      actual_indicators = ?,
      reportByUser = ?
    WHERE reqForAvail_id = ?
  `
  try {
    const params = [
      data.comment,
      data.subSorting,
      data.totalTonnage,
      data.aspirationDust,
      data.naturalLoss,
      data.destinationPoint,
      data.transportType,
      JSON.stringify(data.indicators), // Сохраняем индикаторы как JSON
      JSON.stringify(data.reportByUser), // Сохраняем индикаторы как JSON
      data.reqForAvail_id,
    ]
    await executeDatabaseQueryAsync(query, params)
  } catch (error) {
    console.error('Error - getAllLabReqFilesNameQ:', error)
    throw error
  }
}

const getContractorsQ = async () => {
  const query = `
    SELECT id, name FROM contractors
  `
  try {
    const result = await executeDatabaseQueryAsync(query)
    return result
  } catch (error) {
    console.error('Error - getContractorsQ:', error)
    throw error
  }
}
const addContractorQ = async data => {
  const query = `
    INSERT INTO contractors(
      name
    ) VALUES (?);
  `
  try {
    await executeDatabaseQueryAsync(query, data.name)
  } catch (error) {
    console.error('Error - getContractorsQ:', error)
    throw error
  }
}
const getRequestForRepeatQ = async currentRequest_id => {
  const query = `
    SELECT rft.*, d.name AS dep_name  
    FROM reqForAvailableTable rft 
    JOIN departments d ON d.id = rft.selectedDepartment
    WHERE reqForAvail_id = ?
  `
  try {
    const result = await executeDatabaseQueryAsync(query, currentRequest_id)
    return result
  } catch (error) {
    console.error('Error - getRequestForRepeatQ:', error)
    throw error
  }
}

module.exports = {
  createNewReqForAvailableQ,
  appendUserForApprovalQ,
  appendApprovalsUsersQ,
  updateAppendApprovalsUsersQ,
  getAllRequestsWithApprovalsQ,
  getUsersForApprovalQ,
  updateApprovalsUserQ,
  getAllRequestsQ,
  addLabReqReadStatusQ,
  updateLabReqReadStatusQ,
  deleteReqForLabQ,
  sendNotifyThenNewCommentQ,
  getAllLabReqCommentQ,
  addNewLabReqCommentQ,
  getAllLabReqFilesNameQ,
  deleteFileQ,
  updateReqStatusQ,
  addReportQ,
  getContractorsQ,
  addContractorQ,
  getRequestForRepeatQ,
}
