'use strict'

const { error } = require('console');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const { pipeline } = require('stream');
const { promisify } = require('util');
const pipelineAsync = promisify(pipeline);

const currentDirectory = process.cwd();
const defaultPath = path.join(currentDirectory, 'uploads')

const saveAndConvert = async (file, rootCustomFolder, taskFolderName) => {
  try {
    await fs.promises.access(defaultPath, fs.constants.W_OK);
    const ext = path.extname(file.originalFilename);
    const fileName = `${Date.now()}${ext}`; // задаем имя файла, например, используя метку времени
    const folderFullPath = path.join(defaultPath, rootCustomFolder, taskFolderName); // полный путь
    const newFilePath = path.join(folderFullPath, fileName); // задаем полный путь к файлу
    // Создаем папку, если она не существует
    await fs.promises.mkdir(folderFullPath, {
      recursive: true
    });

    const readStream = fs.createReadStream(file.filepath);
    const writeStream = fs.createWriteStream(newFilePath);

    await pipelineAsync(readStream, writeStream);

    // readStream.close(); // Закрываем поток чтения
    // writeStream.close(); // Закрываем поток записи
    readStream.destroy()
    writeStream.destroy()

    await fs.promises.unlink(file.filepath);

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
          // .toFile(thumbnailFilePath, (err, info) => { console.log(info, err)});
          .toBuffer()
          .then( data => {
            fs.writeFile(thumbnailFilePath, data, (err) => {
              if (err) {
                console.error('Ошибка при записи сжатого изображения:', err);
              } else {
                // console.log('Сжатое изображение успешно создано и сохранено.');
                sharp.cache(false); // Освободить все ресурсы после успешной операции
              }
            })
          })
          .catch( err => console.log(err));
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
          // .toFile(compresFilePath);
          .toBuffer()
          .then( data => {
            fs.writeFile(compresFilePath, data, (err) => {
              if (err) {
                console.error('Ошибка при записи сжатого изображения:', err);
              } else {
                // console.log('Сжатое изображение успешно создано и сохранено.');
                sharp.cache(false); // Освободить все ресурсы после успешной операции
              }
            })
          })
          .catch( err => console.log(err));
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