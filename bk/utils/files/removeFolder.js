'use strict'

const fs = require('fs')
const path = require('path')

const currentDirectory = process.cwd()
const defaultPath = path.join(currentDirectory, 'uploads')

const removeFolder = async (folder, folderPath = defaultPath) => {
  try {
    const fullFolderPath = path.join(defaultPath, folderPath, folder)

    // Проверить существование каталога перед сканированием его содержимого
    const folderExists = fs.existsSync(fullFolderPath)
    if (!folderExists) {
      console.log('Каталог не существует:', fullFolderPath)
      return
    }

    const files = await fs.promises.readdir(fullFolderPath)

    for (const file of files) {
      const filePath = path.join(fullFolderPath, file)
      const stats = await fs.promises.lstat(filePath)

      if (stats.isDirectory()) {
        // Рекурсивно удалить подкаталог, если это каталог
        await removeFolder(file, fullFolderPath)
      } else {
        // Проверить доступ на запись перед удалением файла
        await fs.promises.access(filePath, fs.constants.W_OK)
        // Установить права доступа к файлу перед удалением
        await fs.promises.chmod(filePath, 0o777) // Устанавливает полные права доступа
        // Удалить файл, если это файл
        await fs.promises.unlink(filePath)
      }
    }
    // Удалить сам каталог после удаления всех файлов и подкаталогов
    await fs.promises.rmdir(fullFolderPath)
  } catch (error) {
    console.error(error)
    throw error
  }
}

/**
 * Удаляет файл и связанные файлы (если это изображение).
 * @param {string} folder - Имя папки с файлами (например, "c6e9ebac-5561-491e-a4f4-6a0dccd367a4").
 * @param {string} folderPath - Путь к папке, где находятся файлы (по умолчанию './uploads').
 * @param {string} fileName - Имя файла для удаления (например, "example.jpg").
 * @returns {Promise<void>} - Возвращает Promise, который разрешается после завершения операции.
 * @throws {Error} - Выбрасывает ошибку, если папка или файл не существуют.
*/
const removeFileAndAssociatedFiles = async (folder, folderPath = defaultPath, fileName) => {
  try {
    const fullFolderPath = path.join(defaultPath, folderPath, folder)
    const fullFilePath = path.join(fullFolderPath, fileName)
    // Проверка существования папки
    const folderExists = fs.existsSync(fullFolderPath)
    if (!folderExists) {
      console.log(`Папка "${folder}" не существует.`)
      return
    }
    // Проверка существования файла
    const fileExists = fs.existsSync(fullFilePath)
    if (!fileExists) {
      console.log(`Файл "${fileName}" не существует.`)
      return
    }
    // Получение расширения файла
    const fileExtension = path.extname(fileName).toLowerCase()
    // Проверка типа файла
    if (['.png', '.jpg', '.jpeg'].includes(fileExtension)) {
      // Если это изображение, находим и удаляем связанные файлы
      const baseName = path.basename(fileName, fileExtension) // Имя без расширения
      // Чтение содержимого папки
      const files = await fs.promises.readdir(fullFolderPath)
      // Фильтрация файлов по базовому имени и префиксам
      const prefixes = ['compres_', 'thumbnail_']
      const filesToDelete = files.filter(file => prefixes.some(prefix => file.startsWith(prefix + baseName)) || file === fileName)
      // Удаление файлов
      await Promise.all(filesToDelete.map(file => fs.promises.unlink(path.join(fullFolderPath, file))))
      // console.log('Связанные файлы удалены:', filesToDelete)
    } else {
      // Проверка прав доступа на запись
      await fs.promises.access(fullFilePath, fs.constants.W_OK)
      // Установка прав доступа (на случай, если файл защищен)
      await fs.promises.chmod(fullFilePath, 0o777) // Устанавливаем полные права
      // Удаление файла
      await fs.promises.unlink(fullFilePath)
      // console.log(`Файл "${fileName}" успешно удален из папки "${folder}".`)
    }
  } catch (error) {
    console.error('Ошибка при удалении файла и связанных файлов:', error)
  }
}

module.exports = {
  removeFolder,
  removeFileAndAssociatedFiles,
}
