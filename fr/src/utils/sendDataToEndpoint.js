import { HOST_ADDR } from "./remoteHosts";
import { convertToFormData } from "./convertToFormData";

/**
 * Функция для отправки данных на серверный endpoint с использованием fetch API.
 *
 * @param {string} token - Токен для аутентификации пользователя.
 * @param {object} formData - Данные, которые будут отправлены на сервер.
 * @param {string} endpoint - Конечная точка (URL) сервера, на который будет отправлен запрос.
 * @param {string} method - HTTP метод запроса (например, "GET", "POST").
 * @param {string} responseType - Тип ожидаемого ответа от сервера ("json" или "blob"). По умолчанию - "json".
 * @param {function} onSuccess - Функция обратного вызова, которая будет вызвана при успешном завершении запроса.
 */
export const sendDataToEndpoint = async (
  token,
  formData,
  endpoint,
  method,
  responseType = "json",
  onSuccess,
) => {
  // Удаление свойства filePreviews из formData, если оно присутствует
  if (formData.hasOwnProperty("filePreviews")) {
    delete formData.filePreviews;
  }
  // Преобразование formData в объект FormData
  const data = convertToFormData(formData);
  try {
    // Отправка запроса на сервер через fetch API
    const res = await fetch(HOST_ADDR + endpoint, {
      method: method,
      headers: {
        Authorization: token,
      },
      body: data,
    });
    if (res.ok) {
      let responseData;
      // Обработка ответа в зависимости от указанного типа responseType
      if (responseType === "json") {
        responseData = await res.json(); // Получение JSON данных из ответа сервера
      } else if (responseType === 'blob') {
        const fileBlob = await res.blob(); // Получение объекта Blob из ответа сервера
        const fileUrl = URL.createObjectURL(fileBlob); // Создание URL объекта Blob
        responseData = fileUrl; // Использование URL объекта Blob как ответа
      }
      return responseData; // Вызов функции обратного вызова onSuccess с полученными данными
    } else {
      throw new Error("Server response was not ok");
    }
  } catch (error) {
    console.log(error); // Вызов функции обратного вызова onSuccess с ошибкой, если произошла ошибка
  }
};

// Передача объекта Blob:
// Преимущество: Этот подход позволяет полностью контролировать обработку данных в вашем компоненте. Вы можете дополнительно манипулировать объектом Blob, если это необходимо.
// Недостаток: Вам придется использовать URL.createObjectURL непосредственно в вашем компоненте для создания ссылки на скачивание файла.

// Передача URL объекта Blob:
// Преимущество: Этот подход может уменьшить сложность кода в вашем компоненте, поскольку вы передаете уже готовую ссылку для скачивания файла.
// Недостаток: Ваша функция sendDataToEndpoint будет ответственна за создание URL объекта Blob, что может усложнить ее логику и сделать ее менее модульной.


// import React from 'react';

// const DownloadLink = ({ blobUrl, fileName }) => {
//   return (
//     <a href={blobUrl} download={fileName}>
//       Скачать файл
//     </a>
//   );
// };

// export default DownloadLink;

// <DownloadLink blobUrl={URL.createObjectURL(blobData)} fileName="document.docx" />