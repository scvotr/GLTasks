'use strict'

const fs = require('fs')
const path = require('path')

const currentDirectory = process.cwd()
const defaultPath = path.join(currentDirectory, 'uploads')

const removeFolder = async (folder, folderPath = defaultPath) => {
  try {
    const fullFolderPath = path.join(defaultPath, folderPath, folder);

    // Проверить существование каталога перед сканированием его содержимого
    const folderExists = fs.existsSync(fullFolderPath);
    if (!folderExists) {
      console.log('Каталог не существует:', fullFolderPath);
      return;
    }

    const files = await fs.promises.readdir(fullFolderPath);

    for (const file of files) {
      const filePath = path.join(fullFolderPath, file);
      const stats = await fs.promises.lstat(filePath);

      if (stats.isDirectory()) {
        // Рекурсивно удалить подкаталог, если это каталог
        await removeFolder(file, fullFolderPath);
      } else {
        console.log('!!!!!!', filePath)
        // Проверить доступ на запись перед удалением файла
        await fs.promises.access(filePath, fs.constants.W_OK);
        // Установить права доступа к файлу перед удалением
        await fs.promises.chmod(filePath, 0o777); // Устанавливает полные права доступа
        // Удалить файл, если это файл
        await fs.promises.unlink(filePath);
      }
    }
    // Удалить сам каталог после удаления всех файлов и подкаталогов
    await fs.promises.rmdir(fullFolderPath);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  removeFolder,
}