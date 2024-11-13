export const calculateTotalTime = (start, end) => {
  // console.log(start, end)
  const startDate = new Date(start.split(' ').join('T')) // Преобразуем строку в формат ISO
  const endDate = new Date(end.split(' ').join('T'))
  const totalTimeInSeconds = (endDate - startDate) / 1000 // Разница в миллисекундах
  const hours = Math.floor(totalTimeInSeconds / 3600)
  const minutes = Math.floor((totalTimeInSeconds % 3600) / 60)
  const seconds = Math.floor(totalTimeInSeconds % 60)
  return `${hours}ч ${minutes}м ${seconds}с` // Форматируем результат
}
