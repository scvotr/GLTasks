'use strict'

const fs = require('fs')
const path = require('path')

const currentDirectory = process.cwd()
const defaultPath = path.join(currentDirectory, 'uploads')

const removeFolder = async (rootCustomFolder, folder) => {
  try {
    const fullPath = path.join(defaultPath, rootCustomFolder)
    const fullFolderPath = path.join(fullPath, folder)
    let files;

    try {
      files = await fs.promises.readdir(fullFolderPath);
    } catch (err) {
      if (err.code === 'ENOENT') {
        return;
      } else {
        for (const file of files) {
          const filePath = path.join(fullFolderPath, file)
          const stats = await fs.promises.lstat(filePath)

          if (stats.isDirectory()) {
            await removeFolder(file, fullFolderPath)
          } else {
            await fs.promises.unlink(filePath)
          }
        }
        await fs.promises.rmdir(fullFolderPath)
      }
    }
  } catch (error) {
    throw error;
  }
}

module.exports = {
  removeFolder,
}