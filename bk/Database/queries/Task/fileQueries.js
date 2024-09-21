const fs = require("fs");
const path = require("path");

const getFullFileContent = async (file) => {
  const fullFile = await getTaskCompresFiles(file);
  return fullFile;
}
// вынести в утилиты фалов
const getTaskCompresFiles = async (file) => {
  const currentDirectory = process.cwd();
  const { type, name, task_id } = file;

  const fullFile = {};
  let file_path;
  let file_content;

  if (type !== ".jpg" && type !== '.png') {
    file_path = `${currentDirectory}/uploads/tasks/${task_id}/${name}`;
    file_content = await readFileAsync(file_path, "base64");
  } else {
    file_path = `${currentDirectory}/uploads/tasks/${task_id}/compres_${name}`;
    file_content = await readFileAsync(file_path, "base64");
  }

  fullFile.type = type;
  fullFile.name = name;
  fullFile.content = file_content;

  return fullFile;
}

const getPreviewFileContent = async (task) => {
  // console.log('getPreviewFileContent', task.task_id, task.old_files)
  // return await getTaskPreviewFiles(task.venchel_id, task.old_files);
  return await getTaskPreviewFiles(task.task_id, task.old_files);
}
// вынести в утилиты фалов
// Вспомогательная функция для асинхронного чтения файла
const readFileAsync = (file_path, encoding) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file_path, encoding, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};
// вынести в утилиты фалов
const getTaskPreviewFiles = async (task_id, files) => {
  const currentDirectory = process.cwd();

  const filesPrev = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const { type, name } = file;
    let file_path;
    let file_content;

    file_path = `${currentDirectory}/uploads/tasks/${task_id}/thumbnail_${name}`

    try {
      file_content = await readFileAsync(file_path, "base64");
    } catch (error) {
      file_path = `${currentDirectory}/uploads/default/404.jpg`;
      file_content = await readFileAsync(file_path, "base64");
    }

    filesPrev.push({
      type: type,
      name: name,
      content: file_content,
    });
  }
  return filesPrev;
};


module.exports = {
  getFullFileContent,
  getPreviewFileContent,
}