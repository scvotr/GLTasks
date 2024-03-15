export const formatDate = (dateString) => {
  // Функция для форматирования даты
  // const options = { year: "numeric", month: "long", day: "numeric" };
  // const options = { year: "numeric", month: "numeric", day: "numeric" };
  const options = { day: "numeric", month: "numeric", year: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};