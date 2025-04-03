import { useEffect, useState } from "react"
import {
  Box,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Stack,
  ImageList,
  ImageListItem,
  Tooltip,
} from "@mui/material"
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined"
import PrintIcon from "@mui/icons-material/Print"
import DeleteIcon from "@mui/icons-material/Delete"
import { getDataFromEndpoint } from "../../../../../../utils/getDataFromEndpoint"
import { Loader } from "../../../../../FormComponents/Loader/Loader"
import { UploadButton } from "../uploads/button/UploadButton"
import { LabComments } from "../LabComments/LabComments"
import { formatDateV2 } from "../../../../../../utils/formatDate"
import { ModalCustom } from "../../../../../ModalCustom/ModalCustom"
import { ConfirmationDialog } from "../../../../../FormComponents/ConfirmationDialog/ConfirmationDialog"
import { PictureAsPdfOutlined, DescriptionOutlined, PhotoOutlined, InsertDriveFileOutlined } from "@mui/icons-material"

// const renderIndicators = indicatorsString => {
//   try {
//     const indicators = JSON.parse(indicatorsString) // Преобразуем строку в массив объектов

//     return indicators
//       .filter(indicator => indicator.value) // Фильтруем индикаторы, у которых value не пустое
//       .map((indicator, index) => (
//         <div key={index}>
//           {indicator.name}: {indicator.value}
//         </div>
//       ))
//   } catch (error) {
//     console.error("Error parsing indicators:", error)
//     return <div>Error parsing indicators</div>
//   }
// }

const renderReportUser = data => {
  try {
    const user = JSON.parse(data)
    return `Сформировал: ${user.last_name || ""} ${user.first_name.slice(0, 1)}.${user.middle_name.slice(0, 1)}.`
  } catch (error) {
    console.error("Ошибка при парсинге данных пользователя:", error)
    return "<div>Пользователь не найден</div>" // Возвращаем сообщение об ошибке
  }
}

const renderIndicators = indicatorsString => {
  try {
    const indicators = JSON.parse(indicatorsString) // Преобразуем строку в массив объектов
    const filteredIndicators = indicators.filter(indicator => indicator.value)
    if (!indicators || indicators.length === 0) {
      return <div>Нет данных для отображения</div>
    }
    return (
      <>
        {/* ----------------------------V3----------------- */}
        <TableContainer component={Paper} sx={{ padding: 0 }}>
          <Table size="small" sx={{ borderCollapse: "collapse" }}>
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ border: "1px solid #ccc" }}></TableCell>
                {filteredIndicators.map((indicator, index) => (
                  <TableCell key={index} align="center" sx={{ border: "1px solid #ccc" }}>
                    {indicator.name}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell align="center" sx={{ border: "1px solid #ccc" }}>
                  Показатели:
                </TableCell>
                {filteredIndicators.map((indicator, index) => (
                  <TableCell key={index} align="center" sx={{ border: "1px solid #ccc" }}>
                    {indicator.value || "-"}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
          </Table>
        </TableContainer>
        {/* ----------------------------V3----------------- */}
      </>
    )
  } catch (error) {
    console.error("Error parsing indicators:", error)
    return <div>Error parsing indicators</div>
  }
}

const renderReportIndicators = indicatorsString => {
  try {
    const indicators = JSON.parse(indicatorsString) // Преобразуем строку в массив объектов
    // Фильтруем массив, исключая записи с пустым oldValue
    const filteredIndicators = indicators.filter(indicator => indicator.oldValue !== "")

    // Проверяем, что у каждого индикатора есть значения
    if (!indicators || indicators.length === 0) {
      return <div>Нет данных для отображения</div>
    }

    return (
      <>
        {/* ----------------------------V3----------------- */}
        <TableContainer component={Paper}>
          <Table size="small" sx={{ borderCollapse: "collapse" }}>
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ border: "1px solid #ccc" }}>
                  Показатели:
                </TableCell>
                {filteredIndicators.map((indicator, index) => (
                  <TableCell key={index} align="center" sx={{ border: "1px solid #ccc" }}>
                    {indicator.name}.
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell align="center" sx={{ border: "1px solid #ccc" }}>
                  Контракт:
                </TableCell>
                {filteredIndicators.map((indicator, index) => (
                  <TableCell key={index} align="center" sx={{ border: "1px solid #ccc" }}>
                    {indicator.oldValue || "-"}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell align="center" sx={{ border: "1px solid #ccc" }}>
                  Факт:
                </TableCell>
                {filteredIndicators.map((indicator, index) => (
                  <TableCell key={index} align="center" sx={{ border: "1px solid #ccc" }}>
                    {indicator.newValue || "-"}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell align="center" sx={{ border: "1px solid #ccc" }}>
                  Отклонение:
                </TableCell>
                {filteredIndicators.map((indicator, index) => (
                  <TableCell key={index} align="center" sx={{ border: "1px solid #ccc" }}>
                    {indicator.absoluteDeviation || "-"}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell align="center" sx={{ border: "1px solid #ccc" }}>
                  Удостоверение:
                </TableCell>
                {filteredIndicators.map((indicator, index) => (
                  <TableCell key={index} align="center" sx={{ border: "1px solid #ccc" }}>
                    {indicator.cardValue || "-"}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell align="center" sx={{ border: "1px solid #ccc" }}>
                  От клиента:
                </TableCell>
                {filteredIndicators.map((indicator, index) => (
                  <TableCell key={index} align="center" sx={{ border: "1px solid #ccc" }}>
                    {indicator.responseValue || "-"}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
          </Table>
        </TableContainer>
        {/* ----------------------------V3----------------- */}
      </>
    )
  } catch (error) {
    console.error("Error parsing indicators:", error)
    return <div>Error parsing indicators</div>
  }
}

const handlePrintSelectedReq = (user, request, getReqLabComments) => {
  const indicatorsContent = JSON.parse(request.indicators)
    .filter(indicator => indicator.value)
    .map(
      (indicator, index) => `
    <div class="indicator-item" key="${index}">
      <strong> - ${indicator.name}:</strong> ${indicator.value}
    </div>
  `
    )
    .join("")

  const usersContent = request.users
    .map(
      user => `
        <div class="user-item">
          <div class="subdepartment-name">${user.subdepartment_name}<br>${user.position_name}</div>
          <div class="user-name">${user.approval_status === "approved" ? `Согласована ${formatDateV2(user.approved_at, true)}` : "________________"} ${
        user.last_name_only
      } ${user.first_name_only.charAt(0)}.${user.middle_name_only.charAt(0)}.</div>
        </div>
      `
    )
    .join("")

  const printContent = `
    <div class="print-content">
      <h2>Культура: ${request.culture}. Урожай: ${request.yearOfHarvest}г. ${
    request.classType ? `${request.type.toLowerCase()} класс: ${request.classType}` : ""
  }</h2>
      <h3>Масса: ${request.tonnage} т. (+/- 5%) | Покупатель: ${request.contractor}</h3>
      <h4>Качественные показатели(${request.gost}):</h4>


      <div class="indicators-container">
        ${indicatorsContent}
      </div>

      ${
        request.commentsThenCreate
          ? `
        <p><strong>Комментарий:</strong></p>
        <div>
          ${request.commentsThenCreate}
        </div>
      `
          : ""
      }
      <p><strong>Лист согласования:</strong></p>
      <div class="user-list">${usersContent}</div>
    </div>
  `
  // Ваша функция для открытия окна печати
  const printWindow = window.open("", "_blank")
  printWindow.document.write(`
    <html>
      <head>
        <style>
          body {
            margin: 0;
            padding: 20px;
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            color: #333;
          }
          h2, h3, h4 {
            text-align: center;
            color: #2c3e50;
          }
          .print-content {
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 20px;
            background-color: #fff;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }
          .indicators-container {
            display: flex;
            flex-wrap: wrap; /* Позволяет элементам переноситься на следующую строку */
            justify-content: center; /* Центрирует элементы по горизонтали */
            margin: 20px 0;
          }
          .indicator-item {
            flex: 0 0 45%; /* Задает ширину элемента 45% */
            margin: 5px; /* Отступ между элементами */
            text-align: left; /* Выравнивание текста влево */
          }
          .user-list {
            margin: 20px 0;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            background-color: #f1f1f1;
          }
          .user-item {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            padding: 5px;
            border-bottom: 1px solid #ccc;
          }
          .comments-list {
            margin: 20px 0;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            background-color: #f1f1f1;
          }
          .comments-item {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            padding: 5px;
            border-bottom: 1px solid #ccc;
          }
          .subdepartment-name, .user-name {
            flex: 1;
          }
          @media print {
            @page {
              margin-top: 0;
              margin-bottom: 0;
            }
            body {
              padding-top: 5rem;
              padding-bottom: 5rem;
            }
          }
        </style>
      </head>
      <body>
        <h2>Запрос <br> №: ${request.reqNum} от ${formatDateV2(request.approved_at)} <br> в лабораторию ${
        request.department_name
      } <br> для заключения договора с "${request.contractor}" <br> продажа: ${request.salesPoint}</h2>
        ${printContent}
      </body>
    </html>
`)

  printWindow.document.close()
  printWindow.focus()
  printWindow.print()
  printWindow.close()
}

const handlePrintComments = (request, getReqLabComments) => {
  const comments = getReqLabComments?.map(
    (comment, index) => `
      <div class="comments-item" key="${index}">
        <div>${comment.comment} &nbsp </div>
        <div>${comment.last_name} ${comment.first_name.charAt(0)}.${comment.middle_name.charAt(0)}.</div>
        <div>&nbsp${formatDateV2(comment.created_on, true)}</div>
      </div>
    `
  )

  const printContent = `
    <div class="print-content">
      <p><strong>Протокол:</strong></p>
      <div class="comments-list">
        ${comments.join('')}
      </div>
    </div>
  `

  // Ваша функция для открытия окна печати
  const printWindow = window.open("", "_blank")
  printWindow.document.write(`
    <html>
      <head>
        <style>
          body {
            margin: 0;
            padding: 20px;
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            color: #333;
          }
          h2, h3, h4 {
            text-align: center;
            color: #2c3e50;
          }
          .print-content {
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 20px;
            background-color: #fff;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }
          .indicators-container {
            display: flex;
            flex-wrap: wrap; /* Позволяет элементам переноситься на следующую строку */
            justify-content: center; /* Центрирует элементы по горизонтали */
            margin: 20px 0;
          }
          .indicator-item {
            flex: 0 0 45%; /* Задает ширину элемента 45% */
            margin: 5px; /* Отступ между элементами */
            text-align: left; /* Выравнивание текста влево */
          }
          .user-list {
            margin: 20px 0;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            background-color: #f1f1f1;
          }
          .user-item {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            padding: 5px;
            border-bottom: 1px solid #ccc;
          }
          .comments-list {
            margin: 20px 0;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            background-color: #f1f1f1;
          }
          .comments-item {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            padding: 5px;
            border-bottom: 1px solid #ccc;
          }
          .subdepartment-name, .user-name {
            flex: 1;
          }
          @media print {
            @page {
              margin-top: 0;
              margin-bottom: 0;
            }
            body {
              padding-top: 5rem;
              padding-bottom: 5rem;
            }
          }
        </style>
      </head>
      <body>
        <h2>Комментарии к запросу <br> №: ${request.reqNum} от ${formatDateV2(request.approved_at)} <br> в лабораторию ${request.department_name}
          <br> контрагент:  "${request.contractor}"
        </h2>
        ${printContent}
      </body>
    </html>
    `
  )

  printWindow.document.close()
  printWindow.focus()
  printWindow.print()
  printWindow.close()
}

const handlePrintReqReport = request => {
  // Проверяем наличие actual_indicators и корректность JSON
  let indicators = []
  try {
    indicators = JSON.parse(request.actual_indicators) || [] // Преобразуем строку в массив объектов
  } catch (error) {
    console.error("Error parsing actual_indicators:", error)
    return // Завершаем выполнение функции, если произошла ошибка
  }

  // Фильтруем массив, исключая записи с пустым oldValue
  const filteredIndicators = indicators.filter(indicator => indicator.oldValue !== "")

  // ! WTF request.report_data содержит request.report_data.actual_indicators !!
  const reportData = JSON.parse(request.report_data)

  const translatedTransportType = {
    auto: "Авто",
    railway: "ЖД",
  }
  const transportType = translatedTransportType[reportData.shipped] || reportData.shipped // Получаем русский статус

  const printContent = `
    <div style="width: 100%; margin: 20px 0; overflow: hidden;">
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="border: 1px solid #ccc; text-align: center; font-weight: bold; background-color: #f1f1f1;">
              Показатели:
            </th>
            ${filteredIndicators
              .map(
                indicator => `
              <th style="border: 1px solid #ccc; text-align: center;">
                ${indicator.name.slice(0, 3)}.
              </th>
            `
              )
              .join("")}
          </tr>
          <tr>
            <th style="border: 1px solid #ccc; text-align: center; font-weight: bold; background-color: #f1f1f1;">
              Контракт:
            </th>
            ${filteredIndicators
              .map(
                indicator => `
              <th style="border: 1px solid #ccc; text-align: center;">
                ${indicator.oldValue || "-"}
              </th>
            `
              )
              .join("")}
          </tr>
          <tr>
            <th style="border: 1px solid #ccc; text-align: center; font-weight: bold; background-color: #f1f1f1;">
              Факт:
            </th>
            ${filteredIndicators
              .map(
                indicator => `
              <th style="border: 1px solid #ccc; text-align: center;">
                ${indicator.newValue || "-"}
              </th>
            `
              )
              .join("")}
          </tr>
          <tr>
            <th style="border: 1px solid #ccc; text-align: center; font-weight: bold; background-color: #f1f1f1;">
              Отклонение:
            </th>
            ${filteredIndicators
              .map(
                indicator => `
              <th style="border: 1px solid #ccc; text-align: center;">
                ${indicator.absoluteDeviation || "-"}
              </th>
            `
              )
              .join("")}
          </tr>
          <tr>
            <th style="border: 1px solid #ccc; text-align: center; font-weight: bold; background-color: #f1f1f1;">
              Удостоверение:
            </th>
            ${filteredIndicators
              .map(
                indicator => `
              <th style="border: 1px solid #ccc; text-align: center;">
                ${indicator.cardValue || "-"}
              </th>
            `
              )
              .join("")}
          </tr>
          <tr>
            <th style="border: 1px solid #ccc; text-align: center; font-weight: bold; background-color: #f1f1f1;">
              От клиента:
            </th>
            ${filteredIndicators
              .map(
                indicator => `
              <th style="border: 1px solid #ccc; text-align: center;">
                ${indicator.responseValue || "-"}
              </th>
            `
              )
              .join("")}
          </tr>
        </thead>
      </table>
      <div style="margin-top: 10px; font-family: Arial, sans-serif; padding: 10px;">
        <div style="margin-bottom: 5px;">
          <span>Отгружено всего: ${request.total_tonnage || "-"} т.</span>
          ${request.aspiration_dust ? `<span> АП: ${request.aspiration_dust}</span>` : ""}
          ${request.natural_loss ? `<span> ЕУ: ${request.natural_loss}</span>` : ""}
        </div>
        ${
          request.sub_sorting
            ? `
          <div style="margin-bottom: 5px;">
            <p style="margin: 0;">Под сортировано: ${request.sub_sorting}%</p>
          </div>
        `
            : ""
        }
        <div style="margin-bottom: 5px;">
          <p style="margin: 0;">${request.commentsThenClosed || "-"}</p>
          <p style="margin: 0;">Тип отгрузки: ${transportType || "-"}</p>
        </div>
      </div>
    </div>
  `

  // Ваша функция для открытия окна печати
  const printWindow = window.open("", "_blank")
  printWindow.document.write(`
    <html>
      <head>
        <style>
          body {
            margin: 0;
            padding: 20px;
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            color: #333;
          }
          h2, h3, h4 {
            text-align: center;
            color: #2c3e50;
          }
          .print-content {
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 20px;
            background-color: #fff;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }
          .indicators-container {
            display: flex;
            flex-wrap: wrap; /* Позволяет элементам переноситься на следующую строку */
            justify-content: center; /* Центрирует элементы по горизонтали */
            margin: 20px 0;
          }
          .indicator-item {
            flex: 0 0 45%; /* Задает ширину элемента 45% */
            margin: 5px; /* Отступ между элементами */
            text-align: left; /* Выравнивание текста влево */
          }
          .user-list {
            margin: 20px 0;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            background-color: #f1f1f1;
          }
          .user-item {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            padding: 5px;
            border-bottom: 1px solid #ccc;
          }
          .comments-list {
            margin: 20px 0;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            background-color: #f1f1f1;
          }
          .comments-item {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            padding: 5px;
            border-bottom: 1px solid #ccc;
          }
          .subdepartment-name, .user-name {
            flex: 1;
          }
          @media print {
            @page {
              margin-top: 0;
              margin-bottom: 0;
            }
            body {
              padding-top: 5rem;
              padding-bottom: 5rem;
            }
          }
        </style>
      </head>
      <body>
        <h2> Отчет по контракту.<br> Запрос №: ${request.reqNum}<br> от ${formatDateV2(request.approved_at)} <br> в лабораторию ${
    request.department_name
  } <br> контрагент "${request.contractor} <br> продажа: "${request.salesPoint}"</h2>
        ${printContent}
      </body>
    </html>
    `)

  printWindow.document.close()
  printWindow.focus()
  printWindow.print()
  printWindow.close()
}

export const ReqInfoViewTest = ({ request, currentUser, closeModal, reRender, totalUnreadCount, checkFullScreenOpen }) => {
  const [reqStatus, setReqStatus] = useState({ loading: false, error: null })
  const [getReqLabComments, setGetReqLabComments] = useState([])
  const [formKey, setFormKey] = useState(0)
  const [files, setFiles] = useState([])
  const [isImageFile, setIsImageFile] = useState([])
  const [isDocFile, setIsDocFile] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setReqStatus({ loading: true, error: null })
        // Первый запрос - получаем файлы
        const filesData = await getDataFromEndpoint(currentUser.token, "/lab/getAllLabReqFiles", "POST", request.reqForAvail_id, setReqStatus)
        setFiles(filesData[0])
        // Второй запрос - получаем превью (зависит от первого запроса)
        if (files) {
          const previewData = await getDataFromEndpoint(
            currentUser.token,
            "/lab/getPreviewFileContent",
            "POST",
            {
              // files: files.old_files, // Используем данные из первого запроса
              files: filesData[0].old_files, // Используем данные из первого запроса
              req_id: request.reqForAvail_id,
            },
            setReqStatus
          )
          // Обработка превью
          setIsImageFile([])
          setIsDocFile([])
          if (Array.isArray(previewData)) {
            previewData.forEach(file => {
              file.type === ".jpg" || file.type === ".png" ? setIsImageFile(prev => [...prev, file]) : setIsDocFile(prev => [...prev, file])
            })
          }
        }
        setReqStatus({ loading: false, error: null })
      } catch (error) {
        setReqStatus({ loading: false, error: error.message })
      }
    }
    fetchData()
  }, [currentUser.token, request, formKey])

  return (
    <>
      <Loader reqStatus={reqStatus}>
        <Box sx={{ p: 1 }}>
          <Grid container spacing={2} alignItems="flex-start">
            <Grid item xs={8} sx={{ height: "fit-content" }}>
              {/* -------------------------------------------------------- */}
              <Paper sx={{ p: 1, m: 1 }}>
                <Typography variant="body1" textAlign="center">
                  Заявка №: {request.reqNum} от {formatDateV2(request.approved_at)} продажа от: {request.salesPoint}
                </Typography>
              </Paper>
              {/* -------------------------------------------------------- */}
              {request.commentsThenCreate && (
                <Paper sx={{ p: 1, m: 1 }}>
                  <Typography variant="body2" textAlign="center">
                    {request.commentsThenCreate}
                  </Typography>
                </Paper>
              )}
              {/* -------------------------------------------------------- */}
              {request.req_status !== "closed" && (
                <>
                  <Paper sx={{ p: 1, m: 1 }}>
                    <InfoViewForLabReq request={request} />
                    <ApprovedUsersListViewReqLab request={request} currentUser={currentUser} reRender={setFormKey} />
                  </Paper>
                </>
              )}
              {/* -------------------------------------------------------- */}
              {request.req_status === "closed" && (
                <Paper sx={{ p: 1, m: 1 }}>
                  <ReportReqLabView request={request} />
                </Paper>
              )}
              {/* -------------------------------------------------------- */}
              <Loader reqStatus={reqStatus}>
                <Paper sx={{ p: 1, m: 1 }}>
                  <Box sx={{ mb: 2 }}>
                    <UploadButton data={request} reRender={setFormKey} />
                  </Box>
                  <FilesViewForLabReq request={request} currentUser={currentUser} isImageFile={isImageFile} isDocFile={isDocFile} reRender={setFormKey} />
                </Paper>
              </Loader>
              {/* -------------------------------------------------------- */}
            </Grid>
            <Grid item xs={4} sx={{ height: "fit-content" }}>
              <Grid container spacing={2} direction="column">
                <Grid item xs={12}>
                  <Paper sx={{ p: 1, display: "flex", justifyContent: "flex-end" }}>
                    <Stack direction="row" alignItems="center" spacing={0.5} sx={{ width: "100%", justifyContent: "space-between" }}>
                      <Box sx={{ justifyContent: "flex-start" }}>{request.req_status === "closed" && renderReportUser(request.reportByUser)}</Box>
                      <IconButton color="primary" onClick={() => handlePrintSelectedReq(null, request, getReqLabComments)}>
                        <PrintIcon />
                        <Typography variant="caption" sx={{ fontSize: "0.75rem", color: "gray" }}>
                          запрос
                        </Typography>
                      </IconButton>
                      {/* если есть комментарии */}
                      {getReqLabComments.length > 0 && (
                        <IconButton color="primary" onClick={() => handlePrintComments(request, getReqLabComments)}>
                          <PrintIcon />
                          <Typography variant="caption" sx={{ fontSize: "0.75rem", color: "gray" }}>
                            комментарии
                          </Typography>
                        </IconButton>
                      )}
                      {/* если контракт закрыт */}
                      {request.req_status === "closed" && (
                        <IconButton color="primary" onClick={() => handlePrintReqReport(request)}>
                          <PrintIcon />
                          <Typography variant="caption" sx={{ fontSize: "0.75rem", color: "gray" }}>
                            отчет
                          </Typography>
                        </IconButton>
                      )}
                    </Stack>
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Paper sx={{ p: 1 }}>
                    <LabComments request={request} reRender={reRender} checkFullScreenOpen={checkFullScreenOpen} setGetReqLabComments={setGetReqLabComments} />
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  -
                </Grid>
                <Grid item xs={12}>
                  -
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Loader>
    </>
  )
}

export const ApprovedUsersListViewReqLab = ({ request, currentUser, closeModal, reRender }) => {
  return (
    <TableContainer sx={{ margin: 0, mt: 2, border: "1px solid #ddd" }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography variant="caption">Должность</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="caption">Предприятие</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="caption">Имя пользователя</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="caption">Дата</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {request.users &&
            request.users.map(user => (
              <TableRow key={user.position_id} sx={{ backgroundColor: user.approval_status === "approved" ? "lightgreen" : "inherit" }}>
                <TableCell>
                  <Typography variant="caption" sx={{ fontSize: "0.75rem", color: "gray" }}>
                    {user.position_name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="caption" sx={{ fontSize: "0.75rem", color: "gray" }}>
                    {user.department_name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="caption" sx={{ fontSize: "0.75rem", color: "gray" }}>
                    {user.last_name_only} {user.first_name_only.charAt(0)}.{user.middle_name_only.charAt(0)}.
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="caption" sx={{ fontSize: "0.75rem", color: "gray" }}>
                    {user.approved_at ? formatDateV2(user.approved_at, true) : null}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export const InfoViewForLabReq = ({ request }) => {
  return (
    <>
      <Typography variant="h6" textAlign="center">
        Качество по контракту:
      </Typography>
      {renderIndicators(request.indicators)}
    </>
  )
}

export const FilesViewForLabReq = ({ request, isDocFile, isImageFile, currentUser, reRender }) => {
  const [reqStatus, setReqStatus] = useState({ loading: false, error: null })
  const isCreator = request.creator.toString() === currentUser.id.toString()
  const [toDelete, setToDelete] = useState(null)
  const [dialogText, setDialogText] = useState({ title: "", message: "" })
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedImage, setSelectedImage] = useState({})
  const [modalOpen, setModalOpen] = useState(false)

  const handleDownload = async file => {
    const endpoint = `/lab/getFullFileContent`
    try {
      setReqStatus({ loading: true, error: null })
      const fullFile = await getDataFromEndpoint(currentUser.token, endpoint, "POST", { file: file, req_id: request.reqForAvail_id }, setReqStatus)
      setReqStatus({ loading: false, error: null })
      // Создаем ссылку для скачивания файла
      const downloadLink = document.createElement("a")
      downloadLink.href = `data:${fullFile.type};base64,${fullFile.content}`
      downloadLink.download = fullFile.name

      // Добавляем ссылку на страницу и эмулируем клик по ней для скачивания файла
      document.body.appendChild(downloadLink)
      downloadLink.click()

      // Удаляем ссылку после скачивания файла
      document.body.removeChild(downloadLink)
    } catch (error) {
      setReqStatus({ loading: false, error: error.message })
      console.error("Ошибка при загрузке файла:", error)
    }
  }

  const handleImageClick = async file => {
    const endpoint = `/lab/getFullFileContent`
    try {
      setReqStatus({ loading: true, error: null })
      const fullFile = await getDataFromEndpoint(currentUser.token, endpoint, "POST", { file: file, req_id: request.reqForAvail_id }, setReqStatus)
      setReqStatus({ loading: false, error: null })
      setSelectedImage(fullFile)
      setModalOpen(true)
    } catch (error) {
      setReqStatus({ loading: false, error: error.message })
    }
  }

  const closeImagePreview = () => {
    setSelectedImage({})
    setModalOpen(false)
  }

  /**
   * Удаляет файл на основе переданных данных.
   * @param {Object} fileData - Данные для удаления файла.
   * @param {Object} fileData.file - Информация о файле.
   * @param {string} fileData.req_id - Идентификатор запроса.
   */
  const deleteFile = async file => {
    const endpoint = `/lab/deleteFile`
    try {
      setReqStatus({ loading: true, error: null })
      await getDataFromEndpoint(currentUser.token, endpoint, "POST", file, setReqStatus)
      reRender(prev => prev + 1)
      setReqStatus({ loading: false, error: null })
    } catch (error) {
      setReqStatus({ loading: false, error: error.message })
    }
  }

  // Функция для определения иконки в зависимости от типа файла
  const getIconByFileType = fileName => {
    if (fileName.endsWith(".pdf")) return <PictureAsPdfOutlined fontSize="small" />
    if (fileName.endsWith(".doc") || fileName.endsWith(".docx")) return <DescriptionOutlined fontSize="small" />
    if (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg") || fileName.endsWith(".png")) return <PhotoOutlined fontSize="small" />
    return <InsertDriveFileOutlined fontSize="small" />
  }

  return (
    <>
      <Grid container spacing={2} alignItems="flex-start" direction="column">
        {/* Блок с документами */}
        <Grid item xs={12} sx={{ height: "fit-content" }}>
          <Paper sx={{ padding: 1, maxHeight: "calc(70vh - 270px)", overflowY: "auto" }}>
            {/* Заголовок "Документы" */}
            <Typography variant="caption" sx={{ ml: 1, fontWeight: "bold", mb: 1 }}>
              Документы:
            </Typography>

            {/* Если есть документы, показываем их список */}
            {isDocFile && isDocFile.length > 0 ? (
              <ImageList sx={{ width: "100%", height: "100%" }} cols={4} rowHeight={80}>
                {isDocFile.map((file, index) => (
                  <ImageListItem key={index} sx={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Box sx={{ p: 1, width: "100%", textAlign: "center" }}>
                      {/* Иконка файла и название */}
                      <Tooltip title="Нажмите, чтобы скачать" onClick={() => handleDownload(file)}>
                        <Stack direction="column" justifyContent="center" alignItems="center" spacing={0.5} sx={{ cursor: "pointer", width: "100%" }}>
                          {getIconByFileType(file.name)}
                          <Typography
                            variant="caption"
                            sx={{
                              fontSize: "0.75rem",
                              color: "gray",
                              wordBreak: "break-word", // Разрешаем перенос слов
                              whiteSpace: "normal", // Разрешаем многострочный текст
                              // overflow: "hidden",
                              textAlign: "center",
                              maxWidth: "100%",
                            }}>
                            {file.name}
                          </Typography>
                        </Stack>
                      </Tooltip>

                      {/* Кнопка удаления (если пользователь имеет право) */}
                      {isCreator && (
                        <Tooltip title="Нажмите, чтобы удалить">
                          <IconButton
                            aria-label="delete"
                            onClick={() => {
                              setToDelete({ file: file, req_id: request.reqForAvail_id })
                              setDialogText({
                                title: "Подтверждение удаления",
                                message: "Вы уверены, что хотите удалить этот фаил?",
                              })
                              setOpenDialog(true)
                            }}
                            size="small"
                            sx={{
                              position: "absolute",
                              top: 4,
                              right: 4,
                              color: "error.main",
                              "&:hover": { backgroundColor: "rgba(255, 0, 0, 0.1)" },
                            }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </ImageListItem>
                ))}
              </ImageList>
            ) : (
              // Если документов нет, показываем сообщение
              <Typography variant="body2" textAlign="center" sx={{ mt: 2 }}>
                Нет прикрепленных документов.
              </Typography>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ padding: 1, maxHeight: "calc(70vh - 270px)", overflowY: "auto" }}>
            <Typography variant="body2" sx={{ ml: 1, wordBreak: "break-word" }}>
              Изображения:
            </Typography>
            {isImageFile && isImageFile.length > 0 && (
              <ImageList sx={{ width: "100%", height: "100%" }} cols={3} rowHeight={82}>
                {isImageFile.map((file, index) => (
                  <ImageListItem key={index} sx={{ display: "flex", justifyContent: "center" }}>
                    <Tooltip title="Нажмите, чтобы увеличить" onClick={() => handleImageClick(file)}>
                      <img
                        key={index}
                        src={`data:${file.type};base64,${file.content}`}
                        alt="File Preview"
                        loading="lazy"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "4px",
                          border: "1px solid #ddd",
                          cursor: "pointer",
                        }}
                      />
                    </Tooltip>
                    {isCreator && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          backgroundColor: "background.paper",
                          borderRadius: "50%",
                          boxShadow: 1,
                        }}>
                        <IconButton
                          aria-label="delete"
                          onClick={() => {
                            // deleteFile({ file: file, req_id: request.reqForAvail_id })
                            setToDelete({ file: file, req_id: request.reqForAvail_id })
                            setDialogText({
                              title: "Подтверждение удаления",
                              message: "Вы уверены, что хотите удалить этот фаил?",
                            })
                            setOpenDialog(true)
                          }}
                          size="small">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    )}
                  </ImageListItem>
                ))}
              </ImageList>
            )}
          </Paper>
        </Grid>
      </Grid>
      {/* ------------------------------------- */}
      {/* <Grid container spacing={2} sx={{ border: "1px solid #ccc", borderRadius: "4px", padding: "16px", mt: 2 }}>
        <Grid item xs={12} sx={{ border: "1px solid #ccc", borderRadius: "4px", padding: "16px" }}>
          DOC
        </Grid>
        <Grid item xs={12} sx={{ border: "1px solid #ccc", borderRadius: "4px", padding: "16px", mt: 2 }}>
          IMAGE
        </Grid>
      </Grid>
      <Grid container spacing={2} sx={{ border: "1px solid #ccc", borderRadius: "4px", padding: "16px", mt: 2 }}>
        <Grid item xs={6} sx={{ border: "1px solid #ccc", borderRadius: "4px", padding: "16px" }}>
          DOC
        </Grid>
        <Grid item xs={6} sx={{ border: "1px solid #ccc", borderRadius: "4px", padding: "16px" }}>
          IMAGE
        </Grid>
      </Grid> */}
      {/* ------------------------------------- */}

      <ModalCustom isOpen={modalOpen} onClose={closeImagePreview} infoText={selectedImage.name}>
        <Loader reqStatus={reqStatus}>
          <ImageList sx={{ width: "100%", height: "100%" }} cols={1}>
            <ImageListItem>
              <img src={`data:${selectedImage.type};base64,${selectedImage.content}`} alt="File Preview" loading="lazy" title="Нажмите, чтобы удалить" />
            </ImageListItem>
          </ImageList>
        </Loader>
      </ModalCustom>
      {/* ------------------------ */}
      <ConfirmationDialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false)
        }}
        onConfirm={async () => {
          try {
            setOpenDialog(false) // Закрываем диалог перед выполнением действия
            if (toDelete) {
              await deleteFile(toDelete)
            }
          } catch (error) {
            console.error("Ошибка при удалении файла:", error.message)
          }
        }}
        title={dialogText.title}
        message={dialogText.message}
      />
      {/* ------------------------ */}
    </>
  )
}

export const ReportReqLabView = ({ request }) => {
  const reportData = JSON.parse(request.report_data)

  const translatedTransportType = {
    auto: "Авто",
    railway: "ЖД",
  }

  const transportType = translatedTransportType[reportData.shipped] || reportData.shipped // Получаем русский статус

  return (
    <>
      {/* <Box component="div" sx={{ width: "100%", maxWidth: "95%", mx: "auto", mt: 2 }}> */}
      <Typography variant="h6">Качество по контракту:</Typography>
      {renderReportIndicators(request.actual_indicators)}
      <Stack direction="row" spacing={1} alignItems="center">
        {/* Аспирационные потери */}
        <Typography variant="body2">Отгружено всего: {request.total_tonnage} т.</Typography>
        {request.aspiration_dust && <Typography variant="body2">АП: {request.aspiration_dust}</Typography>}
        {/* Естественная убыль */}
        {request.natural_loss && <Typography variant="body2">ЕУ: {request.natural_loss}</Typography>}
      </Stack>
      <Stack direction={"column"}>
        <Typography variant="body2"> {request.commentsThenClosed}</Typography>
        {request.sub_sorting && <Typography variant="body2">Под сортировано: {request.sub_sorting}</Typography>}
      </Stack>
      <Stack direction={"column"}>
        {/* <Typography variant="body2"> {request.commentsThenCreate}</Typography> */}
        {request.sub_sorting && <Typography variant="body2">Тип отгрузки: {transportType}</Typography>}
      </Stack>
      {/* </Box> */}
    </>
  )
}
