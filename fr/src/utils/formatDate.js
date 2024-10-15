export const formatDate = dateString => {
  // Функция для форматирования даты
  // const options = { year: "numeric", month: "long", day: "numeric" };
  // const options = { year: "numeric", month: "numeric", day: "numeric" };
  const options = { day: 'numeric', month: 'numeric', year: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

export const formatDateV2 = (dateString, includeTime = false) => {
  // Опции для форматирования даты
  const dateOptions = { day: 'numeric', month: 'numeric', year: 'numeric' }

  // Опции для форматирования времени
  const timeOptions = { hour: 'numeric', minute: 'numeric', second: 'numeric' }

  // Создаем объект даты
  const date = new Date(dateString)

  // Проверяем, является ли дата корректной
  if (isNaN(date.getTime())) {
    return 'Данных нет' // Или любое другое сообщение об ошибке
  }

  // Форматируем дату
  const formattedDate = date.toLocaleDateString(undefined, dateOptions)

  // Если нужно включить время, форматируем и его
  if (includeTime) {
    const formattedTime = date.toLocaleTimeString(undefined, timeOptions)
    return `${formattedDate} ${formattedTime}` // Возвращаем дату и время
  }

  return formattedDate // Возвращаем только дату
}

// !usege
// const dateString = "2024-10-10T05:36:27"; // Пример строки даты
// console.log(formatDate(dateString)); // Выводит: "10/10/2024"
// console.log(formatDate(dateString, true)); // Выводит: "10/10/2024 5:36:27 AM" (или в зависимости от локали)
