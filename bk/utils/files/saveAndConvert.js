const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const currentDirectory = process.cwd();
const defaultPath = path.join(currentDirectory, 'uploads')

const saveAndConvert = async (file, folder = null, folderPath = defaultPath) => {
  try {
    // Проверяем права на запись в директорию
    await fs.promises.access(folderPath, fs.constants.W_OK);
    const ext = path.extname(file.originalFilename);
    const fileName = `${Date.now()}${ext}`; // задаем имя файла, например, используя метку времени
    const folderFullPath = path.join(folderPath, folder); // полный путь
    const newFilePath = path.join(folderFullPath, fileName); // задаем полный путь к файлу
    // Создаем папку, если она не существует
    await fs.promises.mkdir(folderFullPath, {
      recursive: true
    });
    // Копируем файл из временной директории в целевую
    await fs.promises.copyFile(file.filepath, newFilePath);
    // Удаляем исходный файл
    await fs.promises.unlink(file.filepath).catch(console.error);
    let thumbnailFileName = '';
    let compersFileName = '';
    if (ext !== '.pdf') {
      // Создаем превью изображения
      thumbnailFileName = `thumbnail_${fileName}`;
      const thumbnailFilePath = path.join(folderFullPath, thumbnailFileName);
      try {
        await sharp(newFilePath)
          .rotate()
          .resize(100)
          .toFile(thumbnailFilePath);
      } catch (error) {
        console.log('thumbnailFileName', error);
      }
      compersFileName = `compres_${fileName}`;
      const compresFilePath = path.join(folderFullPath, compersFileName);
      try {
        await sharp(newFilePath)
          .rotate()
          .resize(1024) // Ширина 800 пикселей (высота будет автоматически рассчитана)
          .toFormat('jpeg', {
            mozjpeg: true,
            chromaSubsampling: '4:4:4',
          })
          .toFile(compresFilePath);
      } catch (error) {
        console.log('compersFileName', error);
      }
    }
    return {
      fileName,
      thumbnailFileName,
      compersFileName,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  saveAndConvert,
}