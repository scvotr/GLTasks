'use strict'
const path = require('path')
const { readFileAsync } = require('./readFileAsync')

/**
 * Получает миниатюры файлов для заданных файлов и папки.
 *
 * @param {Array<Object>} files - Массив объектов файлов, каждый из которых содержит информацию о файлах.
 * @param {string} [folderName] - (Опционально) Имя папки, в которой находятся файлы. Если не указано, используется путь по умолчанию.
 *
 * @returns {Promise<Array<Object>>} - Возвращает Promise, который разрешается массивом объектов задач,
 * где каждый объект содержит обновленные данные о файлах, включая старые файлы с их типами, именами и содержимым.
 *
 * @description
 * Функция выполняет следующие действия:
 * 1. Проходит по каждому файлу в массиве `files`.
 * 2. Если у файла есть свойство `file_names`, оно разбивается на массив имен файлов.
 * 3. Для каждого имени файла определяется расширение (`file_ext`) и путь (`file_path`).
 * 4. Если файл является изображением (`.jpg` или `.png`), пытается прочитать его миниатюру.
 *    Если миниатюра не найдена, используется изображение по умолчанию (`404.jpg`).
 * 5. Для каждого файла создается объект с типом, именем и содержимым (если применимо).
 * 6. Обновленные данные добавляются в массив `tasks`, который возвращается в конце.
 */

const getThumbnailFiles = async (files, folderName) => {
  const currentDirectory = process.cwd()
  const tasks = []

  for (let i = 0; i < files.length; i++) {
    const file = files[i]

    if (file.file_names) {
      file.file_names = file.file_names.split('|')
      file.old_files = []

      for (let j = 0; j < file.file_names.length; j++) {
        const file_ext = path.extname(file.file_names[j])
        const file_name = file.file_names[j]

        let file_path
        let file_content

        if (file_ext !== '.jpg' && file_ext !== '.png') {
          file_path = file_name
          file_content = file_path
        } else {
          file_path = folderName
            ? `${currentDirectory}/uploads/${folderName}/${file.task_id}/thumbnail_${file_name}`
            : `${currentDirectory}/uploads/${file.task_id}/thumbnail_${file_name}`
          try {
            file_content = await readFileAsync(file_path, 'base64')
          } catch (error) {
            file_path = `${currentDirectory}/uploads/default/404.jpg`
            file_content = await readFileAsync(file_path, 'base64')
          }
        }
        file.old_files.push({
          type: file_ext,
          name: file_name,
          // content: file_content,
        })
      }
    } else {
      file.file_names = []
      file.files = []
    }
    tasks.push(file)
  }
  return tasks
}

module.exports = {
  getThumbnailFiles,
}
